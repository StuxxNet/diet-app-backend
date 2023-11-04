import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../prehandlers/check-session-id-exists'
import { checkUserMatchSessionid } from '../prehandlers/check-user-match-session-id'
import { hashPassword } from '../utils/hash-password'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      born_date: z.string(),
      email: z.string(),
      password: z.string(),
    })

    // eslint-disable-next-line camelcase
    const { name, born_date, email, password } = createUserBodySchema.parse(
      request.body,
    )
    const hashedPassword = await hashPassword(password, 10)

    try {
      await knex('users').insert({
        id: randomUUID(),
        name,
        born_date: new Date(born_date),
        email,
        password: hashedPassword,
      })
    } catch (e) {
      e.errno === '19'
        ? reply.status(409).send({
            error: 'User already exists',
          })
        : reply.status(500).send()
    }

    return reply.status(201).send()
  })

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists, checkUserMatchSessionid] },
    async (request, reply) => {
      const getUsersParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getUsersParamsSchema.parse(request.params)

      const user = await knex('users').select('*').where('id', id).first()

      return reply.status(200).send(user)
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists, checkUserMatchSessionid] },
    async (request, reply) => {
      const putUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const putUserBodySchema = z.object({
        name: z.string(),
        born_date: z.string(),
        email: z.string(),
        password: z.string(),
      })

      const { id } = putUserParamsSchema.parse(request.params)

      // eslint-disable-next-line camelcase
      const { name, born_date, email, password } = putUserBodySchema.parse(
        request.body,
      )

      await knex('users')
        .update({
          name,
          born_date: new Date(born_date),
          email,
          password,
        })
        .where('id', id)

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists, checkUserMatchSessionid] },
    async (request, reply) => {
      const deleteUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteUserParamsSchema.parse(request.params)

      await knex('users').delete('*').where('id', id)

      reply.cookie('sessionId', id, {
        path: '/',
        maxAge: 0, // Set expired cookie
      })
      return reply.status(204).send()
    },
  )
}
