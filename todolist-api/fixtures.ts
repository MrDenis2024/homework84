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

  const firstUser = new User({
    username: 'user',
    password: '123',
  });
  firstUser.generateToken();
  await firstUser.save();

  const secondUser = new User({
    username: 'den',
    password: 'newpassword',
  });
  secondUser.generateToken();
  await secondUser.save();

  const firstTask = new Task({
    user: firstUser._id,
    title: 'Сходить в магазин',
    description: 'Купить продукты',
    status: 'complete'
  });
  await firstTask.save();

  const secondTask = new Task({
    user: firstUser._id,
    title: 'Сделать ДЗ',
    description: 'Выполнить лабу',
  });
  await secondTask.save();

  const thirdTask = new Task({
    user: secondUser._id,
    title: 'Помочь родителям',
    description: 'Сделать заготвки на зиму',
    status: 'in_progress'
  });
  await thirdTask.save();

  await db.close();
};

run().catch(console.error);
