// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

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

module.exports = Trip;
