const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide your valid email.'],
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same.',
    },
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  loginAttempts: {
    type: Number,
    default: 0,
  },

  lockUntil: Date,
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.incLoginAttempts = async function () {
  // Lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;

    return await this.save({ validateBeforeSave: false });
  }

  // Increase failed attempts
  this.loginAttempts += 1;

  // Lock account after 5 failed attempts
  const maxAttempts = Number(process.env.MAX_LOGIN_ATTEMPTS);
  const lockTime = Number(process.env.LOCK_TIME);

  console.log({
    attempts: this.loginAttempts,
    maxAttempts,
    lockTime,
  });

  if (this.loginAttempts >= maxAttempts && !this.isLocked) {
    console.log('LOCKING ACCOUNT');

    this.lockUntil = Date.now() + lockTime;

    console.log('lockUntil:', this.lockUntil);
  }
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
