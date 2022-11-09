import dotenv from 'dotenv';
import mongoose from 'mongoose';

// how to handle uncaugth expression globally
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('uncaught expressionion, shutting down the server');
    process.exit(1);
});


dotenv.config({ path: './config.env' });

import app from './app.js';

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`natours server is listenning on ${port}`);
});

// how to hanlde unhandled rejection error globally e.g error in database connection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection, shutting down the server');
  server.close(() => {
    process.exit(1);
  });
});

