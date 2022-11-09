import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';

// how to make --dirname in ES6
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// end of how to make --dirname to work in ES6

// tour model importation
import Tour from '../../model/tourModel.js';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful');
  });

//read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into mongoose database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully imported!');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// delete all data in databse
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('files in the databases deleted successfully');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
