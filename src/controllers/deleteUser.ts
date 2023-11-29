import { Request, Response} from 'express';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


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
