// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A trip must have a name'],
    unique: true,
    trim: true,
  },

  price: {
    type: Number,
    required: [true, 'A trip must have a price'],
  },

  destination: {
    type: String,
    required: [true, 'A trip must have a destination'],
  },

  budget: {
    type: Number,
    required: [true, 'A trip must have a budget'],
  },

  duration: {
    type: Number,
    required: [true, 'A trip must have a duration'],
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  maxGroupSize: {
    type: Number,
    required: [true, 'A trip must have a group size'],
  },

  difficulty: {
    type: String,
    required: [true, 'A trip must have a difficulty'],
  },

  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, 'A trip must have an imagecover.'],
  },

  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  startDates: [Date],

  // itinerary: [
  //   {
  //     day: {
  //       type: Number,
  //       required: true,
  //     },

  //     activity: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
