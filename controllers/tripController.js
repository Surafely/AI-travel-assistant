const fs = require('fs');
const Trip = require('../models/tripModel');

exports.checkId = (req, res, next, val) => {
  console.log(`Trip ID is: ${val}`);

  if (req.params.id > trips.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTrips = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    // results: trips.length,
    // data: {
    //   trips,
    // },
  });
};

exports.getTrip = (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;
  // const trip = trips.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     trip,
  //   },
  // });
};

exports.createTrip = (req, res) => {
  // console.log(req.body);
  res.status(201).json({
    status: 'success',
    // data: {
    //   trip: newTrip,
    // },
  });
};

exports.updateTrip = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      trip: 'Update your Trips....',
    },
  });
};

exports.deleteTrip = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// module.exports = {
//   getAllTrips,
//   getTrip,
//   createTrip,
//   updateTrip,
//   deleteTrip,
// };
