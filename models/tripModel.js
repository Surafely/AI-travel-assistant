const mongoose = require('mongoose');
const slugify = require('slugify');

const tripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A trip must have a name'],
      unique: true,
      trim: true,
    },

    slug: String,

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
      select: false,
    },

    startDates: [Date],

    secretTrip: {
      type: Boolean,
      default: false,
    },

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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tripSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tripSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tripSchema.pre(/^find/, function () {
  this.find({ secretTrip: { $ne: true } });
});

tripSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTrip: { $ne: true } } });
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
