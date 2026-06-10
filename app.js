const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHsndler = require('./controllers/errorController');

const tripsRouter = require('./routes/tripRoutes');
const usersRouter = require('./routes/userRoutes');

const app = express();

app.set('query parser', 'extended');

// GLOBAL MIDDLEWARES

// SET SECURITY HTTP HEADERS
app.use(helmet());

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

console.log(
  process.env.NODE_ENV === 'development'
    ? 'DEVELOPMENT MODE..............'
    : 'PRODUCTION MODE..............',
);

// LIMIT REQUEST FROM SAME API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

// BODY PARSER, READING DATA FROM BODY INTO req.body
app.use(express.json({ limit: '10kb' }));

// SERVING STATICF FIELS
app.use(express.static(`${__dirname}/public`));

// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

//ROUTES

app.use('/api/v1/trips', tripsRouter);
app.use('/api/v1/users', usersRouter);

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHsndler);

module.exports = app;
