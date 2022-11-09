import mongoose from 'mongoose';
import validator from 'validator';
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'a tour name must not be greater than 50 characters'],
      minlength: [
        10,
        'a tour name must greater than or equals to 10 characters',
      ],
      // validate: [
      //   validator.isAlpha,
      //   'Name must contain only letters, no special character',
      // ],
    },
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'minimum rating should be 1.0'],
      max: [5, 'maximum rating should be 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        // this only points to current document
        return val < this.price;
      },
      message: 'discount price ({VALUE}) should be blow regular price',
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // to hide something or data by not allowing it to be sent to the client we use select like the example below
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// mongoose vitual model properties
tourSchema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
