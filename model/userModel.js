import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a namw'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
    // to check if passwordconfirm is equal to password
    // using self custom validator
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password does not match with confirm password',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// how to encrept or hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // hash password with cost of 12
  this.password = (await bcrypt.hash(this.password, 12));
  // delete the ocnfirm password so it wont be saved in the database
  this.passwordConfirm = undefined;
  next();
});

// check if password match when login
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

export default User;
