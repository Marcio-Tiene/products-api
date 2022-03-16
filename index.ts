import express, { Application, json } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

import { router } from './src/routes';

config();

const { PORT, MONGODB = 'mongodb://localhost:27017', MONGODB_DB = 'products-db' } = process.env;

const bootStrap = async () => {
  const app: Application = express();

  app.use(json());
  app.use(router);

  await mongoose.connect(MONGODB as string, {
    dbName: MONGODB_DB as string
  });

  const server = app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });

  return server;
};

export const server = bootStrap();
