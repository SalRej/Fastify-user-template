import { type FastifyRequest, type FastifyReply } from 'fastify'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type IUser from '../interfaces/user'
import { type ITokenHeader } from '../interfaces/user'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createUserHandler = async (
  req: FastifyRequest<{ Body: IUser }>,
  res: FastifyReply
): Promise<void> => {
  const { name, email, password, confirmPassword } = req.body

  const doesUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (confirmPassword !== password) {
    return await res.code(409).send('Passwords do not match')
  }

  if (doesUserExist) {
    return await res.code(409).send('Such a user already exists')
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    const token = jwt.sign(email, process.env.JWT_SECRET ?? '')

    const payload = {
      user: newUser,
      token
    }

    return await res.code(201).send(payload)
  } catch (e) {
    return await res.code(400).send(e)
  }
}

export const getUserHandler = async (
  req: FastifyRequest<{ Headers: ITokenHeader }>,
  res: FastifyReply
): Promise<void> => {
  const { email } = req.headers
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (user) {
    return await res.code(200).send(user)
  } else {
    return await res.code(400).send('Could not retrieve the user')
  }
}

export const loginUserHandler = async (
  req: FastifyRequest<{ Body: IUser }>,
  res: FastifyReply
): Promise<void> => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (user) {
    const result = await bcrypt.compare(password, user.password)

    if (result) {
      const token = jwt.sign(email, process.env.JWT_SECRET ?? '')
      return await res.code(200).send({
        user,
        token
      })
    } else {
      return await res.code(409).send('Wrong passowrd')
    }
  }

  return await res.code(400).send('There is no such email')
}
