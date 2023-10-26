import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'


export async function usersRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        const users = await knex('users').select('')

        return { users }
    })

    app.get('/:id', async (request) => {
        const getUsersParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getUsersParamsSchema.parse(request.params)

        const user = await knex('users').select('*').where('id', id).first()

        console.log(user)

        return { user }
    })

    app.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            born_date: z.string()
        })

        const { name, born_date } = createUserBodySchema.parse(request.body)

        await knex('users').insert({
            id: randomUUID(),
            name: name,
            born_date: new Date(born_date)
        })

        return reply.status(201).send()
    })

    app.put('/:id', async (request, reply) => {
        const putUserParamsSchema = z.object({
            id: z.string().uuid()
        })

        const putUserBodySchema = z.object({
            name: z.string(),
            born_date: z.string()
        })

        const { id } = putUserParamsSchema.parse(request.params)

        const { name, born_date } = putUserBodySchema.parse(request.body)

        console.log(id, name, born_date)

        await knex('users').update({
            name: name,
            born_date: new Date(born_date)
        }).where('id', id)

        reply.status(204).send()
    })

    app.delete('/:id', async (request, reply) => {
        const deleteUserParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = deleteUserParamsSchema.parse(request.params)

        await knex('users').delete('*').where('id', id)

        reply.status(204).send()
    })
}