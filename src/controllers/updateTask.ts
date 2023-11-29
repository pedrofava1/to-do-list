import { Request, Response} from 'express';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const updateTask = async (req:Request, res: Response): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id, 10)
      
      const task = await prisma.task.findUnique({
        where: {
          id: taskId
        }
      })
      if(!task){
          res.status(404).json({
            message: 'Tarefa não encontrada'
          })
          return;
      } 
  
      const isValidStatus = ["TODO", "COMPLETED"].includes(req.body.status)
      if(!isValidStatus) {
        res.status(400).json({
          message: 'Status inválido. Use TODO ou COMPLETED'
        })
        return;
      }
  
      const uptadeTask = await prisma.task.update({
        where: {
          id: taskId
        },
        data: {
          title: req.body.title,
          description: req.body.description,
          status: req.body.status
        }
      })
      
        res.status(200).json({
          message: 'Task atualizada com sucesso',
          uptadeTask
        })
        return;
      }
   
    catch(error) {
      console.error('Erro ao atualizar a tarefa:', error);
      res.status(500).send('Erro interno do servidor');
    }
    finally{
      await prisma.$disconnect();
    }
  }