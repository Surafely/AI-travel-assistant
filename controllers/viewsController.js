const Trip = require('../models/tripModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const trips = await Trip.find();

  res.status(200).render('overview', {
    title: 'All Trips',
    trips,
  });
});

exports.getTrip = (req, res) => {
  res.status(200).render('trip', {
    title: 'Paris Art And History',
  });
};
