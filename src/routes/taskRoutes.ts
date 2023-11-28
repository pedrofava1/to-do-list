import express from 'express';
import { authenticateUser, createTask, createUser, deleteTask, deleteUser, listTasks, listUsers } from '../controllers/taskController';

const taskRoutes = express.Router();

taskRoutes.get('/tasks', listTasks);
taskRoutes.get('/users', listUsers);
taskRoutes.post('/signup', createUser)
taskRoutes.post('/create-task', createTask)
taskRoutes.post('/signin', authenticateUser)
taskRoutes.delete('/delete-task/:id', deleteTask)
taskRoutes.delete('/delete-user/:id', deleteUser)

export default taskRoutes;
