// user authentication
import bcrypt from 'bcryptjs';
// jwt importation
import jwt from 'jsonwebtoken';

// user model importation
import User from '../model/userModel.js';

// importing app error
import AppError from '../utils/appError.js';

// catchAsync error importation
import { catchAsync } from '../utils/catchAsync.js';

// using id of user to create token for authentication
// all imported from env file but it not a must for it to be in the env file it might be inside another file
// the jwt secret token to be imported should be at least 32 characters long
// JWT_EXPIRES_IN means the time for the token to expire
const signToken = (id) => {
  // {id:id} or {id}
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };
  const user = await User.create(newUser);

  // using id of user to create token for authentication
  // all imported from env file but it not a must for it to be in the env file it might be inside another file
  // the jwt secret token to be imported should be at least 32 characters long
  // JWT_EXPIRES_IN means the time for the token to expire
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  // or
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    message: 'account created successfully',
    data: {
      user,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  // const email = req.body.email;
  // const password = req.body.password;
  //  or
  const { email, password } = req.body;
  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }
  // check if user exist check if password is correct
  // i can use either {email:email} or {email} any of the two will work
  // we use .select("+password") because the password is set to be hidden in the model and this will set the hidden to true here
  const user = await User.findOne({ email }).select('+password');
  // correctPassword is from user model
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrecct email or password', 401));
  }
  // check if everthing is ok and send jwt token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    message: 'login successfully',
    token,
  });
});

//route to protect tour route 
// export const protect = catchAsync(async(req, res, next) => {
//   let token;
//   // checking if user have token and if the token is valid
//   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
//      token = req.headers.authorization.split(" ")[1]
//   }

//   // check if token exist
//   if(!token){
//     return new(new AppError("You are not login! please login to get access", 401))
//   }
//   next()
// })
