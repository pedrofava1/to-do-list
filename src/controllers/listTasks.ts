import { Request, Response} from 'express';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const listTasks = async (req: Request, res: Response): Promise<void> => {
    try {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
} catch (error) {
  console.error('Error listing tasks:', error)
  res.status(500).send('Internal Server Error')
}}
