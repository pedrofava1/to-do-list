import express from 'express';
import { listTasks } from '../controllers/listTasks';
import { listUsers } from '../controllers/listUsers';
import { createUser } from '../controllers/createUser';
import { createTask } from '../controllers/createTask';
import { authenticateUser } from '../controllers/authenticateUser';
import { updateTask } from '../controllers/updateTask';
import { deleteTask } from '../controllers/deleteTask';
import { deleteUser } from '../controllers/deleteUser';


const taskRoutes = express.Router();

taskRoutes.get('/tasks', listTasks);
taskRoutes.get('/users', listUsers);
taskRoutes.post('/signup', createUser)
taskRoutes.post('/create-task', createTask)
taskRoutes.post('/login', authenticateUser)
taskRoutes.put('/update-task/:id', updateTask)
taskRoutes.delete('/delete-task/:id', deleteTask)
taskRoutes.delete('/delete-user/:id', deleteUser)

export default taskRoutes;
