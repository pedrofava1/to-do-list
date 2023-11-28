"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.createTask = exports.createUser = exports.listUsers = exports.listTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield prisma.task.findMany();
        res.json(tasks);
    }
    catch (error) {
        console.error('Error listing tasks:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.listTasks = listTasks;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            include: {
                tasks: true
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error('Error listing users:', error);
        res.status(500).send('Internal Server Error');
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.listUsers = listUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, tasks } = req.body;
        const newUser = yield prisma.user.create({
            data: {
                username,
                password,
                email,
                tasks
            },
        });
        res.json(newUser);
    }
    catch (error) {
        console.error('Erro ao criar o usuário:', error);
        res.status(500).send('Erro interno do servidor');
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.createUser = createUser;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, userId, user } = req.body;
        const newTask = yield prisma.task.create({
            data: {
                title,
                description,
                userId,
                user,
                status: 'TODO',
            },
        });
        res.json(newTask);
    }
    catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).send('Erro interno do servidor');
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.createTask = createTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) {
            res.status(400).json({
                message: 'ID da tarefa inválido. Certifique-se de fornecer um ID numérico válido.',
            });
            return;
        }
        const existingTask = yield prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });
        if (!existingTask) {
            res.status(404).json({
                message: 'Tarefa não encontrada.',
            });
            return;
        }
        const task = yield prisma.task.delete({
            where: {
                id: taskId,
            },
        });
        res.json({
            message: `Tarefa com ID ${taskId} deletada com sucesso`,
            deletedTask: task,
        });
    }
    catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).send('Erro interno do servidor');
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.deleteTask = deleteTask;
