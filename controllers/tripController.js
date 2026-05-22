const Trip = require('../models/tripModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllTrips = async (req, res) => {
  try {
    //EXCUTE QUERY
    const features = new APIFeatures(Trip.find(), req.query)
      .filter()
      .sort()
      .limitFileds()
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        trip,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const newTrip = await Trip.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        trip: newTrip,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        trip,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTripStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
