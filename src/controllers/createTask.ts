import { Request, Response} from 'express';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, userId, user } = req.body;
  
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          userId,
          user,
          status: 'TODO',
        },
      });
  
      res.json(newTask);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).send('Erro interno do servidor');
    } finally {
      await prisma.$disconnect();
    }
  };