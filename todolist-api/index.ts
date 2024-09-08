import express from "express";
import mongoose from 'mongoose';
import config from './config';
import usersRouter from './routes/users';
import tasksRouter from './routes/tasks';

const app = express();
const port = 8000;

app.use(express.json());
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);