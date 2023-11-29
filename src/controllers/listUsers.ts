import { Request, Response} from 'express';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
