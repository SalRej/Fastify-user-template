import './config/dotenv' // Load env config first to have access to env variables
import fastifySwagger from '@fastify/swagger'
import fastifyUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import { userPrivateRoutes, userPublicRoutes } from './routes/user'
import cors from '@fastify/cors'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const startServer = (): void => {
  const server = fastify()

  server.register(fastifySwagger, {})
  server.register(fastifyUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  })

  server.register(cors, {})
  server.register(userPublicRoutes)
  server.register(userPrivateRoutes)

  const port = Number(process.env.PORT ?? 5000)
  server.listen({ port }, (err, adress) => {
    if (err) {
      console.error('Error starting the server:', err)
    } else {
      console.log(`Server is listening on port ${adress}`)
    }
  })
}

async function main (): Promise<void> {
  startServer()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
