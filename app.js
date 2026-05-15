const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const trips = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/trips-simple.json`),
);

const getAllTrips = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: trips.length,
    data: {
      trips,
    },
  });
};

const getTrip = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const trip = trips.find((el) => el.id === id);

  // if (id > trips.length)
  if (!trip)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'success',
    data: {
      trip,
    },
  });
};

const createTrip = (req, res) => {
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

const updateTrip = (req, res) => {
  if (req.params.id > trips.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'success',
    data: {
      trip: 'Update your Trips....',
    },
  });
};

const deleteTrip = (req, res) => {
  if (req.params.id > trips.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// app.get('/api/v1/trips', getAllTrips);
// app.get('/api/v1/trips/:id', getTrip);
// app.patch('/api/v1/trips/:id', updateTrip);
// app.delete('/api/v1/trips/:id', deleteTrip);
// app.post('/api/v1/trips', createTrip);

app.route('/api/v1/trips').get(getAllTrips).post(createTrip);

app
  .route('/api/v1/trips/:id')
  .get(getTrip)
  .patch(updateTrip)
  .delete(deleteTrip);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
