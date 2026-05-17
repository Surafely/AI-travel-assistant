const express = require('express');
const morgan = require('morgan');
const tripsRouter = require('./routes/tripRoutes');
const usersRouter = require('./routes/userRoutes');
const app = express();

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

module.exports = app;
