import { type FastifyInstance, type FastifyRequest } from 'fastify'
import { createUserSchema, getUserSchema, loginUserSchema } from '../schemas/user'
import { createUserHandler, getUserHandler, loginUserHandler } from '../controllers/user'
import verifyToken from '../controllers/auth/verifyToken'
import { type ITokenHeader } from '../interfaces/user'

export const userPublicRoutes = (
  fastify: FastifyInstance,
  options: any, // The type for the "options" parameter is not specified in the code snippet
  done: () => void
): void => {
  fastify.post('/user', createUserSchema, createUserHandler)
  fastify.post('/login', loginUserSchema, loginUserHandler)
  done()
}

export const userPrivateRoutes = (
  fastify: FastifyInstance,
  options: any, // The type for the "options" parameter is not specified in the code snippet
  done: () => void
): void => {
  fastify.addHook('preHandler', (req: FastifyRequest <{ Headers: ITokenHeader }>, res, done) => {
    verifyToken(req, res, done)
    done()
  })
  fastify.get('/user', getUserSchema, getUserHandler)
  done()
}
