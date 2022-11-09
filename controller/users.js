// users controller

// user model importation
import User from '../model/userModel.js';

// import catchAsync function
import { catchAsync } from '../utils/catchAsync.js';

// get all users
export const getAllUsers = catchAsync(async (req, res, next) => {
  // try {
  const allUser = await User.find();
  res.status(200).json({
    status: 'success',
    number: allUser.length,
    message: 'all users list',
    data: {
      allUser,
    },
  });
  //   } catch (err) {
  //     res.status(500).json(err.message);
  //   }
});

//register a new user
export const registerNewUser = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'no user registered yet!!',
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//a single user
export const singleUser = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'no user registered yet!!',
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// update user account
export const updateUser = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'no user registered yet!!',
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'no user registered yet!!',
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
