import fs from 'fs';

//reading our API data
// const tourData = JSON.parse(
//   fs.readFileSync('./dev-data/data/tours-simple.json')
// );

// tour model importation
import Tour from '../model/tourModel.js';

// asyncCatch error handling importation
import { catchAsync } from '../utils/catchAsync.js';

// api  query features importation
import APIFeatures from '../utils/apiFeatures.js';
// app error importation
import AppError from '../utils/appError.js';

// creating middleware to check for id
export const checkId = (req, res, next, val) => {
  console.log(`Tour id is :${val}`);
  if (req.params.id * 1 > tourData.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  next();
};

// controller for top tours
export const topTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

//controller function for Tour crud operation
export const getAllTour = catchAsync(async (req, res, next) => {
  // executing query command
  // const getTour = await query;
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .pagination();
  const getTour = await features.query;
  res.status(200).send({
    status: 'succes',
    results: getTour.length,
    data: {
      tour: getTour,
    },
  });
  // try {
  // // beggining of search query
  // // how to use search query to find data in the database and this can work without the queryObj stated above
  // // two different ways of search query
  // // 1
  // // initailizing what to be used fo query search and 3rd parties operation not to be included
  // const queryObj = { ...req.query };
  // const excludeFields = ['page', 'sort', 'limit', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // // Advance query search i.e adding >= && <= in mogoose and mongodb
  // // first thing is to convert the object to string
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // // continuation of step 1 instead of JSON.parse(queryString) req.query or the specific area to search condition can be put in the find() method e.g{duration: 5, difficulty: easy} it will work without the sorting below
  // let query = Tour.find(JSON.parse(queryStr));

  // // sorting feature using price
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  // // filed limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   // projecting is know as selecting few fields eg "name duration price" from a database
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  // // pagination
  // // limiting item on each page
  // // skip(number) means the number of document we want to skip before goingg to another page i.e number of documents to be on each page
  // // here 1-5 will be on page one and 5-10 will be on page2
  // // we use *1 to covert a string to a value
  // // initializing default page value i.e page 1
  // const page = req.query.page * 1 || 1;
  // // limiting default documents number to each pages
  // const limit = req.query.limit * 1 || 100;
  // // to calculate page number enter by user
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error('Page does not exist');
  // }

  // // executing query command
  // // const getTour = await query;
  // const features = new APIFeatures(Tour.find(), req.query)
  //   .filter()
  //   .sort()
  //   .limitField()
  //   .pagination();
  // const getTour = await features.query;

  // step 2
  // const getTour = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');
  // end of search query

  // const getTour = await Tour.find();
  // res.status(200).send({
  //   status: 'succes',
  //   results: getTour.length,
  //   data: {
  //     tour: getTour,
  //   },
  // });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'unable to list tours',
  //   });
  // }
});

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

export const CreateTour = catchAsync(async (req, res, next) => {
  const createTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: createTour,
    },
  });
  // try {
  // const createTour = await Tour.create(req.body);
  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     tour: createTour,
  //   },
  // });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'invalid data sent!',
  //   });
  // }
});

export const getTourById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const singleTour = await Tour.findById(id);

  // to check if tour we are finding with the sepcified id exist
  if (!singleTour) {
    return next(new AppError(`No tour found with the id of ${id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    message: ` tour ${id} find successfully`,
    data: {
      tour: singleTour,
    },
  });
  // try {
  // const singleTour = await Tour.findById(id);
  // res.status(200).json({
  //   status: 'success',
  //   message: ` tour ${id} find successfully`,
  //   data: {
  //     tour: singleTour,
  //   },
  // });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: `unable to get tour with the id of ${id}`,
  //   });
  // }
});

export const patchTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updateTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  // to check if tour we are finding with the sepcified id exist
  if (!updateTour) {
    return next(new AppError(`No tour found with the id of ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    message: `tour with id ${id} updated successfully`,
    data: {
      tour: updateTour,
    },
  });
  // try {
  // const updateTour = await Tour.findByIdAndUpdate(id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  // res.status(200).json({
  //   status: 'success',
  //   message: `tour with id ${id} updated successfully`,
  //   data: {
  //     tour: updateTour,
  //   },
  // });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: `unable to update tour with id ${id}`,
  //   });
  // }
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deleteTour = await Tour.findByIdAndRemove(id);

  // to check if tour we are finding with the sepcified id exist
  if (!deleteTour) {
    return next(new AppError(`No tour found with the id of ${id}`, 404));
  }

  res.status(204).json({
    status: 'success',
    message: `tour with id ${id} deleted successfully`,
    data: null,
  });
  // try {
  //   await Tour.findByIdAndRemove(id);
  //   res.status(204).json({
  //     status: 'success',
  //     message: `tour with id ${id} deleted successfully`,
  //     data: null,
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: `tour with the id ${id} deleted successfully`,
  //   });
  // }
});

// function to calculate some calculations on our tours like average price, max and minimun and certain percentage off
// example of this is when u want to filter for the price of good in jumia by the most expensive, less expensive and cheaptest
export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      // group is to be used to calculate the avarage of something here is tour e.g average of tour which difficulty level is medium, esy or difficult; and we are calculating all this together in one big group
      $group: {
        _id: { $toUpper: '$difficulty' },
        // for calculating total number of tours present
        totalTour: { $sum: 1 },
        // for calculating total number of rating
        ratings: { $sum: '$ratingsQuantity' },
        // for calculating averagerating
        avgRating: { $avg: '$ratingsAverage' },
        // for calculating averageprice
        avgPrice: { $avg: '$price' },
        // for calculating the minimum price
        minPrice: { $min: '$price' },
        // for calculating the maximum price
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      tours: stats,
    },
  });
  // try {
  // const stats = await Tour.aggregate([
  //   {
  //     $match: {
  //       ratingsAverage: { $gte: 4.5 },
  //     },
  //   },
  //   {
  //     // group is to be used to calculate the avarage of something here is tour e.g average of tour which difficulty level is medium, esy or difficult; and we are calculating all this together in one big group
  //     $group: {
  //       _id: { $toUpper: '$difficulty' },
  //       // for calculating total number of tours present
  //       totalTour: { $sum: 1 },
  //       // for calculating total number of rating
  //       ratings: { $sum: '$ratingsQuantity' },
  //       // for calculating averagerating
  //       avgRating: { $avg: '$ratingsAverage' },
  //       // for calculating averageprice
  //       avgPrice: { $avg: '$price' },
  //       // for calculating the minimum price
  //       minPrice: { $min: '$price' },
  //       // for calculating the maximum price
  //       maxPrice: { $max: '$price' },
  //     },
  //   },
  //   {
  //     $sort: { avgPrice: 1 },
  //   },
  // ]);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tours: stats,
  //   },
  // });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
});

// to know the total number of tour to happen per month
export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`), // first day of the year
          $lte: new Date(`${year}-12-31`), // last day of the year
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        // the number of tour for the specific month
        tourNumberStarts: { $sum: 1 },
        // information on which tour
        tour: { $push: '$name' },
      },
    },
    // add the number of month on the calender
    {
      $addFields: { month: '$_id' },
    },
    //removing id is with 0 and 1 to make id to show
    {
      $project: { _id: 0 },
    },
    // sorting the tours in order 1  for decending and -1 for ascending
    {
      $sort: { tourNumberStarts: -1 },
    },
    // adding limit
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    numberOfTours: plan.length,
    data: {
      tours: plan,
    },
  });
  // try {
  // const year = req.params.year * 1; // 2021
  // const plan = await Tour.aggregate([
  //   {
  //     $unwind: '$startDates',
  //   },
  //   {
  //     $match: {
  //       startDates: {
  //         $gte: new Date(`${year}-01-01`), // first day of the year
  //         $lte: new Date(`${year}-12-31`), // last day of the year
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: { $month: '$startDates' },
  //       // the number of tour for the specific month
  //       tourNumberStarts: { $sum: 1 },
  //       // information on which tour
  //       tour: { $push: '$name' },
  //     },
  //   },
  //   // add the number of month on the calender
  //   {
  //     $addFields: { month: '$_id' },
  //   },
  //   //removing id is with 0 and 1 to make id to show
  //   {
  //     $project: { _id: 0 },
  //   },
  //   // sorting the tours in order 1  for decending and -1 for ascending
  //   {
  //     $sort: { tourNumberStarts: -1 },
  //   },
  //   // adding limit
  //   {
  //     $limit: 12,
  //   },
  // ]);
  // res.status(200).json({
  //   status: 'success',
  //   numberOfTours: plan.length,
  //   data: {
  //     tours: plan,
  //   },
  // });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
});
