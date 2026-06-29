const Trip = require('../models/tripModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const trips = await Trip.find();

  res.status(200).render('overview', {
    title: 'All Trips',
    trips,
  });
});

exports.getTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findOne({
    slug: req.params.slug,
  });

  if (!trip) {
    return next(new AppError('There is no trip with that name!!'), 404);
  }

  res.status(200).render('trip', {
    title: trip ? trip.name : 'Trip Details',
    page: 'trip',
    trip,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account',
    page: 'login',
  });
};
