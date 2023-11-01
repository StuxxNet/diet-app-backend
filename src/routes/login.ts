import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"
import { randomUUID } from 'node:crypto'

export async function loginRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const postUserLoginSchema = z.object({
            email: z.string(),
            password: z.string()
        })

        const { email, password } = postUserLoginSchema.parse(request.body)

        const login = await knex("users").select("*").where({ email, password }).first()

        if(login){
            const sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: "/",
                maxAge: 1000 * 60 * 60 // 1 hour
            })

            return reply.status(200).send()
        } else {
            return reply.status(404).send({
                error: "User not found"
            })
        }
    })
}