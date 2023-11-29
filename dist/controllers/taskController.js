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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.authenticateUser = exports.deleteUser = exports.deleteTask = exports.createTask = exports.createUser = exports.listUsers = exports.listTasks = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
        const saltRounds = 10;
        let { username, password, email, tasks } = req.body;
        const emailAlreadyExists = yield prisma.user.findFirst({
            where: {
                email
            }
        });
        if (emailAlreadyExists) {
            res.status(400).json({
                message: 'Já existe um usuário com esse email'
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        password = hashedPassword;
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
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id, 10);
        const existingUser = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!existingUser) {
            res.status(400).json({
                message: 'ID do usuário inválido. Certifique-se de fornecer um ID numérico válido.'
            });
            return;
        }
        const user = yield prisma.user.delete({
            where: {
                id: userId,
            },
        });
        res.json({
            message: `Usuário com ID ${userId} deletado com sucesso`,
            deletedUser: user
        });
    }
    catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).send('Erro interno do servidor');
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.deleteUser = deleteUser;
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                email
            }
        });
        if (!user) {
            res.status(404).json({
                message: 'Email não cadsatrado'
            });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({
                message: 'Falha na autenticação'
            });
            return;
        }
        res.json({
            message: 'Usuário autenticado com sucesso',
            user
        });
    }
    catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).send('Erro interno do servidor');
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.authenticateUser = authenticateUser;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = parseInt(req.params.id, 10);
        const task = yield prisma.task.findUnique({
            where: {
                id: taskId
            }
        });
        if (!task) {
            res.status(404).json({
                message: 'Tarefa não encontrada'
            });
        }
        const isValidStatus = ["TODO", "COMPLETED"].includes(req.body.status);
        if (!isValidStatus) {
            res.status(400).json({
                message: 'Status inválido. Use TODO ou COMPLETED'
            });
            return;
        }
        const uptadeUser = yield prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status
            }
        });
        res.status(200).json({
            message: 'Task atualizada com sucesso',
            uptadeUser
        });
    }
    catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).send('Erro interno do servidor');
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.updateTask = updateTask;
