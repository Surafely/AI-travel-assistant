const fs = require('fs');

const trips = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/trips-simple.json`),
);

exports.checkId = (req, res, next, val) => {
  console.log(`Trip ID is: ${val}`);

  if (req.params.id > trips.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  next();
};

exports.getAllTrips = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    results: trips.length,
    data: {
      trips,
    },
  });
};

exports.getTrip = (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;
  const trip = trips.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      trip,
    },
  });
};

exports.createTrip = (req, res) => {
  // console.log(req.body);
  const newId = trips[trips.length - 1].id + 1;
  const newTrip = Object.assign({ id: newId }, req.body);

  trips.push(newTrip);

  fs.writeFile(
    `${__dirname}/dev-data/data/trips-simple.json`,
    JSON.stringify(trips),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          trip: newTrip,
        },
      });
    },
  );
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
