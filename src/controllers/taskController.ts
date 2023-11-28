import { Request, Response} from 'express';
import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient()

export const listTasks = async (req: Request, res: Response): Promise<void> => {
    try {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
} catch (error) {
  console.error('Error listing tasks:', error)
  res.status(500).send('Internal Server Error')
}}

export const listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
    const users = await prisma.user.findMany({
        include: {
            tasks: true
        }
    })
    res.json(users)
} catch (error) {
  console.error('Error listing users:', error)
  res.status(500).send('Internal Server Error')
} finally {
    await prisma.$disconnect()
}}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const { username, password, email, tasks} = req.body

        const emailAlreadyExists = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(emailAlreadyExists){
            res.status(400).json({
                message: 'Já existe um usuário com esse email'
            })
            return
        }

        const newUser = await prisma.user.create({
            data: {
              username,
              password,
              email,
              tasks
            },
          });
          res.json(newUser)
    } catch(error){
        console.error('Erro ao criar o usuário:', error)
        res.status(500).send('Erro interno do servidor')
    } finally {
        await prisma.$disconnect()
    }
}

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

  export const deleteUser = async(req : Request, res: Response): Promise<void> => {
    try{
      const userId = parseInt(req.params.id, 10);

      const existingUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if(!existingUser){
        res.status(400).json({
          message: 'ID do usuário inválido. Certifique-se de fornecer um ID numérico válido.'
        })
        return;
      }
      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      res.json({
        message: `Usuário com ID ${userId} deletado com sucesso`,
        deletedUser: user
      })

    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).send('Erro interno do servidor');
    }
    finally{
      await prisma.$disconnect();
    }
  }

  export const authenticateUser = async(req: Request, res: Response): Promise<void> => {
    try{
      const { email, password } = req.body;

      const user = await prisma.user.findFirst({
        where: {
          email,
          password
        }
      })

      if(!user){
        res.status(400).json({
          message: 'Email ou senha incorretos'
        })
        return;
      }

      res.json({
        message: 'Usuário autenticado com sucesso',
        user
      })

    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
    finally{
      await prisma.$disconnect();
    }
  }