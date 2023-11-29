"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const taskRoutes = express_1.default.Router();
taskRoutes.get('/tasks', taskController_1.listTasks);
taskRoutes.get('/users', taskController_1.listUsers);
taskRoutes.post('/signup', taskController_1.createUser);
taskRoutes.post('/create-task', taskController_1.createTask);
taskRoutes.post('/signin', taskController_1.authenticateUser);
taskRoutes.put('/update-task/:id', taskController_1.updateTask);
taskRoutes.delete('/delete-task/:id', taskController_1.deleteTask);
taskRoutes.delete('/delete-user/:id', taskController_1.deleteUser);
exports.default = taskRoutes;
