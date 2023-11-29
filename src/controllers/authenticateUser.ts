import { Request, Response} from 'express';
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()


export const authenticateUser = async(req: Request, res: Response): Promise<void> => {
    try{
      let { email, password } = req.body;

      
      const user = await prisma.user.findFirst({
        where: {
          email
        }
      })

      if(!user){
        res.status(401).json({
          message: 'Email não encontrado'
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