import { FastifyInstance } from 'fastify'
import { string, z } from 'zod'
import { checkSessionIdExists } from '../prehandlers/check-session-id-exists'
import { randomUUID } from 'crypto'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const postDietSchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        in_accordance: z.boolean(),
      })

      // eslint-disable-next-line camelcase
      const { name, description, date, in_accordance } = postDietSchema.parse(
        request.body,
      )

      const { sessionId } = request.cookies
      const mealId = randomUUID()

      await knex('diet').insert({
        id: mealId,
        name,
        date: new Date(date),
        description,
        // eslint-disable-next-line camelcase
        in_accordance,
        user_id: sessionId,
      })

      return reply.status(201).send({
        id: mealId,
      })
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealByIdSchema = z.object({
        id: z.string(),
      })

      const { sessionId } = request.cookies
      const { id } = getMealByIdSchema.parse(request.params)

      const meal = await knex('diet')
        .select('*')
        .where({ id, user_id: sessionId })
        .first()

      return meal
        ? reply.status(200).send(meal)
        : reply.status(404).send({ error: 'Not found' })
    },
  )

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('diet').select('*').where('user_id', sessionId)

      return meals
        ? reply.status(200).send(meals)
        : reply.status(404).send({ error: 'Not found' })
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const putMealByIdSchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        in_accordance: z.boolean(),
      })

      const { sessionId } = request.cookies

      // eslint-disable-next-line camelcase
      const { name, description, date, in_accordance } =
        putMealByIdSchema.parse(request.body)

      await knex('diet')
        .update({
          name,
          description,
          date: new Date(date),
          // eslint-disable-next-line camelcase
          in_accordance,
        })
        .where('user_id', sessionId)

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealByIdSchema = z.object({
        id: string(),
      })

      const { sessionId } = request.cookies
      const { id } = deleteMealByIdSchema.parse(request.params)

      await knex('diet').delete('*').where({ id, user_id: sessionId })

      return reply.status(204).send()
    },
  )
}
