import express from 'express';
const tourRounter = express.Router();

// importing the user route which contain the middleware for protecting route
// import {protect} from "../controller/auth.js";

// importing users controllers function
import {
  getMonthlyPlan,
  getTourStats,
  topTours,
  getAllTour,
  CreateTour,
  getTourById,
  patchTour,
  deleteTour,
} from '../controller/tour.js';

// bringing events on id
// tourRounter.param('id', checkId);

// route to get the first 5 cheap tours
tourRounter.route('/top-5-cheap').get(topTours, getAllTour);

// route to get the statistics perfrom on all tour e.g avgrating, avgprice, minprice, maxprice
tourRounter.route('/tour-stats').get(getTourStats);

// route to get montly -plan activities
tourRounter.route('/montly-plan/:year').get(getMonthlyPlan);

tourRounter.route('/').get(getAllTour).post(CreateTour);
tourRounter.route('/:id').get(getTourById).patch(patchTour).delete(deleteTour);

export default tourRounter;
