const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHsndler = require('./controllers/errorController');
const cookiesParser = require('cookie-parser');

const tripsRouter = require('./routes/tripRoutes');
const usersRouter = require('./routes/userRoutes');
const conversationRouter = require('./routes/conversationRoutes');
const viewRouter = require('./routes/viewRoutes');
const authController = require('./controllers/authController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.set('query parser', 'extended');

//                                               GLOBAL MIDDLEWARES

// SET SECURITY HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://tile.openstreetmap.org'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", 'https://unpkg.com'],
        scriptSrcAttr: ["'none'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://unpkg.com',
        ],
        connectSrc: ["'self'", 'ws://127.0.0.1:*', 'ws://localhost:*'],
      },
    },
  }),
);

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
app.use(cookiesParser());

// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

//ROUTES
app.use(authController.isLoggedIn);
app.use('/', viewRouter);

// SERVING STATICF FIELS
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/trips', tripsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/conversations', conversationRouter);

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHsndler);

module.exports = app;
