/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../prehandlers/check-session-id-exists'
import { hashPassword } from '../utils/hash-password'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      born_date: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, born_date, email, password } = createUserBodySchema.parse(
      request.body,
    )
    const hashedPassword = await hashPassword(password, 10)

    const sessionId = randomUUID()

    try {
      await knex('users').insert({
        id: sessionId,
        name,
        born_date: new Date(born_date),
        email,
        password: hashedPassword,
      })

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60, // Set 1h cookie
      })

      return reply.status(201).send()
    } catch (error) {
      error.errno === 19
        ? reply.status(409).send({
            error: 'This e-mail is already registered',
            error_code: error.errno,
            error_type: error.code,
          })
        : reply.status(500).send({
            error: 'Generic error',
            error_code: error.errno,
            error_type: error.code,
          })
    }
  })

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      try {
        const user = await knex('users')
          .select('*')
          .where({ id: sessionId })
          .first()
        return reply.status(200).send(user)
      } catch (error) {
        return reply.status(500).send({
          error: 'Generic error',
          error_code: error.errno,
          error_type: error.code,
        })
      }
    },
  )

  app.put(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const putUserBodySchema = z.object({
        name: z.string(),
        born_date: z.string(),
        email: z.string(),
        password: z.string(),
      })

      const { sessionId } = request.cookies

      const { name, born_date, email, password } = putUserBodySchema.parse(
        request.body,
      )

      try {
        await knex('users')
          .update({
            name,
            born_date: new Date(born_date),
            email,
            password,
          })
          .where('id', sessionId)

        return reply.status(204).send()
      } catch (error) {
        error.errno === 19
          ? reply.status(409).send({
              error: 'This e-mail is already registered',
              error_code: error.errno,
              error_type: error.code,
            })
          : reply.status(500).send({
              error: 'Generic error',
              error_code: error.errno,
              error_type: error.code,
            })
      }
    },
  )

  app.delete(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const sessionid = request.cookies

      try {
        await knex('users').delete('*').where('id', sessionid)

        reply.cookie('sessionId', sessionid, {
          path: '/',
          maxAge: 0, // Set expired cookie
        })

        return reply.status(204).send()
      } catch (error) {
        return reply.status(500).send({
          error: 'Generic error',
          error_code: error.errno,
          error_type: error.code,
        })
      }
    },
  )
}
