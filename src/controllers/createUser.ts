import { Request, Response} from 'express';
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

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