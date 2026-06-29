const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate fields value: ${value}. Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data input: ${errors.join('. ')} `;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Expired token. Please login again.', 401);

const getRenderErrorContent = (err) => {
  if (err.statusCode === 404) {
    return {
      title: 'Page not found',
      msg: 'The page you are looking for does not exist. Please check the URL or return to the homepage.',
    };
  }

  if (err.isOperational) {
    return {
      title: 'Something went wrong !',
      msg: err.message,
    };
  }

  return {
    title: 'Something went wrong !',
    msg: 'Please try again later.',
  };
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.log('Error 💥💥💥', err);

    const { title, msg } = getRenderErrorContent(err);

    res.status(err.statusCode).render('error', {
      title,
      msg,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A. API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.log('Error 💥💥💥', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong !',
    });
  }

  // B. FOR RENDERED
  if (!err.isOperational) {
    console.log('Error 💥💥💥', err);
  }

  const { title, msg } = getRenderErrorContent(err);

  return res.status(err.statusCode).render('error', {
    title,
    msg,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, req, res);
  }
};
