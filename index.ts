import express, { Application, json } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const { PORT, MONGODB = 'mongodb://localhost:27017', MONGODB_DB = 'products-db' } = process.env;

const bootStrap = async () => {
  const app: Application = express();

  app.use(json());

  app.get('/ping', async (_req, res) => {
    res.json({
      message: 'pong'
    });
  });
  await mongoose.connect(MONGODB as string, {
    dbName: MONGODB_DB as string
  });

  const server = app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });

  return server;
};

export const server = bootStrap();
