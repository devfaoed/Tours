import fs from 'fs';
import express from 'express';
const app = express();
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// setting up module to allow the use of {__dirnname}
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

// importing appError created by myself
import AppError from './utils/appError.js';

// setting up middleware
// dotenv configuration file
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// serving static file to express
app.use(express.static(`${__dirname}/public`));

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// index route
app.get('/', (req, res) => {
  res.status(200).redirect('/api/v1/tours');
});

// app.get('/api/v1/tours', getAllTour);

// getting tour by id
// app.get('/api/v1/tours/:id', getTourById);

//creating tour
// app.post('/api/v1/tours', CreateTour);

//using patch to update tour
// app.patch('/api/v1/tours/:id', patchTour);

//deleting a tour
// app.delete('/api/v1/tours/:id', deleteTour);

// simplifying our Tour route
// importing tourRoute from Route folder
import tourRounter from './routes/tourRoutes.js';
app.use('/api/v1/tours', tourRounter);

//users route
// importing userRoute from Route folder
import userRouter from './routes/userRoutes.js';
app.use('/api/v1/users', userRouter);

// route to render erorr 404 page
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `the requested page ${req.originalUrl} cant be found on the server!`,
  // });
  // const err = new Error(
  //   `the requested page ${req.originalUrl} cant be found on the server!`
  // );
  // err.status = 'fail';
  // err.statusCode = 404;

  next(
    new AppError(
      `the requested page ${req.originalUrl} cant be found on the server!`,
      404
    )
  );
});

// middleware function to handle erros
// app.use((err, req, res, next) => {
//   // initializing a default statuscode
//   err.statusCode = err.statusCode || 500;
//   // initializing status
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

// importing define error from the controller
import {globalError} from './controller/errorController.js';
app.use(globalError);

// exporting server where port is listenning
export default app;
