import express from 'express';
const userRouter = express.Router();

// importing users controllers function
import {
  getAllUsers,
  registerNewUser,
  singleUser,
  updateUser,
  deleteUser,
} from '../controller/users.js';
// auth controller
import {signup, login} from '../controller/auth.js';

userRouter.post('/signup', signup);
userRouter.post('/login', login);




userRouter.route('/').get(getAllUsers).post(registerNewUser);
userRouter.route('/:id').get(singleUser).patch(updateUser).delete(deleteUser);

export default userRouter;
