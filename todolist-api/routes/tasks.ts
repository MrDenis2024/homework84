import express from 'express';
import auth, {RequestWithUser} from '../middleware/auth';
import mongoose from 'mongoose';
import Task from '../models/Task';
import {TaskMutation} from '../types';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const task = new Task({
      user: req.user?._id,
      title: req.body.title,
      description: req.body.description ? req.body.description : null,
      status: req.body.status,
    });
    await task.save();

    return res.send(task);
  } catch (error) {
    if(error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error)
    }
    return next(error);
  }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const tasks = await Task.find({user: req.user});
    return res.send(tasks);
  } catch (error) {
    return next(error);
  }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if(!req.body.title || !req.body.status) {
      return res.status(400).send({error: 'Title and status required'});
    }

    const statuses = ['new', 'in_progress', 'complete'];
    const task = await Task.findById(req.params.id);

    if(task === null) {
      return res.status(404).send({error: 'Task not found'});
    }

    if(!task.user.equals(req.user?._id)) {
      return res.status(403).send({error: 'You cannot change this task'});
    }

    if(!statuses.includes(req.body.status)) {
      return res.status(400).send({error: 'Invalid status'});
    }

    const changeTask: TaskMutation = {
      title: req.body.title,
      description: req.body.description ? req.body.description : null,
      status: req.body.status,
    };

    await Task.updateOne({_id: req.params.id}, {$set: changeTask});

    const updatedTask = await Task.findById(req.params.id);
    return res.send(updatedTask);
  } catch (error) {
    return next(error);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if(task === null) {
      return res.status(404).send({error: 'Task not found'});
    }

    if(!task.user.equals(req.user?._id)) {
      return res.status(403).send({error: 'You cannot delete this task'});
    }

    await Task.deleteOne({_id: req.params.id});

    return res.send({message: 'Task deleted successfully'})
  } catch (error) {
    return next(error);
  }
});

export default tasksRouter;