const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello World from the server',
//     app: 'ai-travel-assistant',
//   });
// });

const trips = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/trips-simple.json`),
);

app.get('/api/v1/trips', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: trips.length,
    data: {
      trips,
    },
  });
});

app.get('/api/v1/trips/:id', (req, res) => {
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
});

app.patch('/api/v1/trips/:id', (req, res) => {
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
});

app.delete('/api/v1/trips/:id', (req, res) => {
  if (req.params.id > trips.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

app.post('/api/v1/trips', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
