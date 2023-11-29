import { Request, Response} from 'express';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id, 10);

      if (isNaN(taskId)) {
        res.status(400).json({
          message: 'ID da tarefa inválido. Certifique-se de fornecer um ID numérico válido.',
        });
        return;
      }

      const existingTask = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

      if(!existingTask){
        res.status(404).json({
          message: 'Tarefa não encontrada.',
        });
        return;
      }
  
      const task = await prisma.task.delete({
        where: {
          id: taskId,
        },
      });
  
      res.json({
        message: `Tarefa com ID ${taskId} deletada com sucesso`,
        deletedTask: task,
      });

    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      res.status(500).send('Erro interno do servidor');
    } finally {
      await prisma.$disconnect();
    }
  }