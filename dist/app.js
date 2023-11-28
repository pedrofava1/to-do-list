"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("./models/Task");
const TaskStatus_1 = require("./models/TaskStatus");
const User_1 = require("./models/User");
const userData = {
    id: 1,
    username: "john",
    password: "senha",
    email: "john@mail.com",
    tasks: []
};
const primeiroUsuario = new User_1.User(userData);
const taskData = {
    id: 1,
    title: 'Estudar Typescript',
    description: 'Entender o conceito de classes e instâncias',
    userId: 1,
    user: primeiroUsuario,
    status: TaskStatus_1.TaskStatus.TODO
};
const taskPrimeiroUsuario = new Task_1.Task(taskData);
primeiroUsuario.tasks.push(taskPrimeiroUsuario);
console.log(primeiroUsuario);
