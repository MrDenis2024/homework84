import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Task from './models/Task';

const run = async () => {
  await mongoose.connect(config.database);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('tasks');
  } catch (error) {
    console.log('Skipping drop...');
  }

  const user = new User({
    username: 'user',
    password: '123',
  });
  user.generateToken();
  await user.save();

  const firstTask = new Task({
    user: user._id,
    title: 'Сходить в магазиг',
    description: 'Купить продукты',
    status: 'complete'
  });
  await firstTask.save();

  const secondTask = new Task({
    user: user._id,
    title: 'Сделать ДЗ',
    description: 'Выполнить лабу',
  });
  await secondTask.save();

  await db.close();
};

run().catch(console.error);
