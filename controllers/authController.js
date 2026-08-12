const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: 'lax',
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // REMOVE PASSWORD FROM OUTPUT
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //   const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt,
    // role: req.body.role,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;

  try {
    const email = new Email(newUser, url);
    await email.sendWelcome();
  } catch (err) {
    console.error('Welcome email could not be sent:', err.message);
  }

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Find user
  const user = await User.findOne({ email }).select('+password');

  // User not found
  if (!user) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  // Check if account is locked
  if (user.isLocked) {
    const remainingMs = user.lockUntil - Date.now();

    const minutes = Math.floor(remainingMs / (60 * 1000));
    const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);

    return next(
      new AppError(
        `Account is locked. Try again in ${minutes}m ${seconds}s.`,
        401,
      ),
    );
  }

  // Check password
  const correct = await user.correctPassword(password, user.password);
  const passwordWasStoredPlainText = !correct && password === user.password;

  // Wrong password
  if (!correct && !passwordWasStoredPlainText) {
    await user.incLoginAttempts();

    return next(new AppError('Incorrect email or password!', 401));
  }

  // Successful login
  if (passwordWasStoredPlainText) user.password = password;
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // GETTING TOKEN CHECK IF IT'S THERE
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'loggedout')
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401),
    );

  // VERIFICATION TOKEN

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // CHECK IF THERE IS A USER STILL

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does not exist.', 401),
    );

  // CHECK IF THE USER CHANGED PASSWORD AFTER TOKEN IS ISSUED
  if (currentUser.changesPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password. please login again.',
        401,
      ),
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // VERIFICATION TOKEN
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // CHECK IF THERE IS A USER STILL
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // CHECK IF THE USER CHANGED PASSWORD AFTER TOKEN IS ISSUED
      if (currentUser.changesPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  return next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // GET USER WITH POSTED EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with this email adress.', 404));

  // GENERATE RANDOM TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // SEND IT TO THE USER'S EMAIL

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
    const email = new Email(user, resetURL);
    await email.sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There is an error sending the email. Please try again later.',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // GET USER BASED ON THE TOKEN
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // IF THE TOKEN DOESN'T EXPIRE AND IF THE USER EXIST, CREATE NEW PASSWORD
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // LOG THE USER IN AND SEND JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // GET USER FROM COLLECTION
  const user = await User.findById(req.user.id).select('+password');

  // CHECK IF POSTED PASSWORD IS CORRECT
  const currentPasswordCorrect = await user.correctPassword(
    req.body.passwordCurrent,
    user.password,
  );
  const currentPasswordWasStoredPlainText =
    !currentPasswordCorrect && req.body.passwordCurrent === user.password;

  if (!currentPasswordCorrect && !currentPasswordWasStoredPlainText) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // IF PASSWORD IS CORRECT, UPDATE PASSWORD
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // LOG THE USER IN AND SEND JWT
  createSendToken(user, 200, res);
});
