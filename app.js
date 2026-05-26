const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHsndler = require('./controllers/errorController');

const tripsRouter = require('./routes/tripRoutes');
const usersRouter = require('./routes/userRoutes');

const app = express();

app.set('query parser', 'extended');

// MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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
