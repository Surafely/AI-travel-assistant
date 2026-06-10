const Trip = require('../models/tripModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTrips = catchAsync(async (req, res, next) => {
  //EXCUTE QUERY
  const features = new APIFeatures(Trip.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const trips = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: trips.length,
    data: {
      trips,
    },
  });
});

exports.getTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(new AppError('No trip found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      trip,
    },
  });
});

exports.createTrip = catchAsync(async (req, res, next) => {
  const newTrip = await Trip.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      trip: newTrip,
    },
  });
});

exports.updateTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!trip) {
    return next(new AppError('No trip found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      trip,
    },
  });
});

exports.deleteTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);

  if (!trip) {
    return next(new AppError('No trip found with that ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTripStats = catchAsync(async (req, res, next) => {
  const stats = await Trip.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        _id: '$difficulty',
        numtrips: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },

    {
      $sort: {
        avgPrice: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Trip.aggregate([
    {
      $unwind: '$startDates',
    },

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' },
        numTripStarts: { $sum: 1 },
        trips: { $push: '$name' },
      },
    },

    {
      $addFields: { month: '$_id' },
    },

    {
      $project: {
        _id: 0,
      },
    },

    {
      $sort: { numTripStarts: 1 },
    },

    {
      $limit: 2,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
