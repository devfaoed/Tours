import AppError from '../utils/appError.js';

// function to handle cast error from database
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

// error function to handle duplicate fields entries e.g name which is set to be unique
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. value already exist please use another value`;
  return new AppError(message, 400);
};

// function to handle cast error from database
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data.${errors.join(". ")}`;
  return new AppError(message, 400);
};

const developmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const productionError = (err, res) => {
  // opertaionla trusted error to be sent to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming error or unknown error which is not be leaked it details to the client
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
};

export const globalError = (err, req, res, next) => {
  // console.log(err.stack);
  // initializing a default statuscode
  err.statusCode = err.statusCode || 500;
  // initializing status
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   error: err,
    //   message: err.message,
    //   stack: err.stack,
    // });
    developmentError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   message: err.message,
    // });
    let error = { ...err };
    // redesign error from mongoose by sending nice error message to the client
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'validationError')
      error = handleValidationErrorDB(error);

    productionError(error, res);
  }
};
