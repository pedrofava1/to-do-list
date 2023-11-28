import express from 'express';
import { createTask, createUser, deleteTask, listTasks, listUsers } from '../controllers/taskController';

const taskRoutes = express.Router();

taskRoutes.get('/tasks', listTasks);
taskRoutes.get('/users', listUsers);
taskRoutes.post('/create-user', createUser)
taskRoutes.post('/create-task', createTask)
taskRoutes.delete('/delete-task/:id', deleteTask)

export default taskRoutes;
