const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DB Connected Successfully !!!');
});

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A trip must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A trip must have a price'],
  },
  duration: {
    type: Number,
    // required: [true, 'A trip must have a duration'],z
  },
  difficulty: {
    type: String,
    // required: [true, 'A trip must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
});

const Trip = mongoose.model('Trip', tripSchema);

const testTrip = new Trip({
  name: 'Test Trip 1',
  price: 1000,
});

testTrip
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
