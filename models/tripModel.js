const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A trip must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A trip name must have less or equal to 40 characters.'],
      minlength: [
        10,
        'A trip name must have greater or equal to 10 characters.',
      ],
    },

    slug: String,

    price: {
      type: Number,
      required: [true, 'A trip must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Discount price ({VALUE}) should be less than the regular price',
      },
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
      max: [5, 'Ratings must be below 5.0'],
      min: [1, 'Ratings must be above 5.0'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Trips difficulty must be either easy, medium or difficulty',
      },
    },

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

    startLocations: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

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

// tripSchema.index({ price: 1 });
tripSchema.index({ price: 1, ratingsAverage: -1 });
tripSchema.index({ slug: 1 });
tripSchema.index({ startLocations: '2dsphere' });

tripSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE
tripSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tripSchema.pre(/^find/, function () {
  this.find({ secretTrip: { $ne: true } });
});

// AGGREGATE MIDDLEWARE
// tripSchema.pre('aggregate', function () {
//   this.pipeline().unshift({ $match: { secretTrip: { $ne: true } } });
// });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
