import { type FastifyReply, type FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { type ITokenHeader } from '../../interfaces/user'

const verifyToken = async (
  req: FastifyRequest <{ Headers: ITokenHeader }>,
  res: FastifyReply,
  done: (error?: Error) => void
): Promise<void> => {
  if (!req.headers.authorization) {
    return await res.code(409).send('No token provided')
  }

  const token = req.headers.authorization.split(' ')[1]

  jwt.verify(token, process.env.JWT_SECRET ?? '', (error, decoded): any => {
    if (error != null) {
      return res.code(409).send('Tokem mismatch')
    }

    if (decoded) {
      req.headers.email = decoded as string
    }
  })

  done()
}

export default verifyToken
