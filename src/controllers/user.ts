import { type FastifyRequest, type FastifyReply } from 'fastify'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type IUser from '../interfaces/user'
import { type ITokenHeader } from '../interfaces/user'
import prisma from '../config/prisma'

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
    return await res.code(409).send({ message: 'Passwords do not match' })
  }

  if (doesUserExist) {
    return await res.code(409).send({ message: 'Such a user already exists' })
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

    const signiture = {
      email,
      id: newUser.id
    }

    const token = jwt.sign(signiture, process.env.JWT_SECRET as string)

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
    return await res.code(400).send({ message: 'Could not retrieve the user' })
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
      const signiture = {
        email,
        id: user.id
      }
      const token = jwt.sign(signiture, process.env.JWT_SECRET ?? '')
      return await res.code(200).send({
        user,
        token
      })
    } else {
      return await res.code(409).send({ message: 'Wrong passowrd' })
    }
  }

  return await res.code(400).send({ message: 'There is no such email' })
}
