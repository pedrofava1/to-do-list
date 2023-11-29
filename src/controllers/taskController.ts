import { Request, Response} from 'express';
import { PrismaClient, Task } from '@prisma/client';
import bcrypt, { hash } from 'bcrypt'
import { parseJsonConfigFileContent } from 'typescript';

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
      const saltRounds = 10
        let { username, password, email, tasks} = req.body

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

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        password = hashedPassword

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
      let { email, password } = req.body;

      
      const user = await prisma.user.findFirst({
        where: {
          email
        }
      })

      if(!user){
        res.status(404).json({
          message: 'Email não cadsatrado'
        })
        return
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if(!passwordMatch){
        res.status(401).json({
          message: 'Falha na autenticação'
        })
        return
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