import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"
import { compareHash, hashPassword } from "../utils/hash-password"

export async function loginRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const postUserLoginSchema = z.object({
            email: z.string(),
            password: z.string()
        })

        const { email, password } = postUserLoginSchema.parse(request.body)
        const user = await knex("users").select("*").where({ email }).first()

        const passwordIsOk = await compareHash(password, user.password)

        if(passwordIsOk){
            reply.cookie('sessionId', user.id, {
                path: "/",
                maxAge: 1000 * 60 * 60 // 1 hour
            })

            const { id } = user

            return reply.status(200).send({
                id,
            })
        } else {
            return reply.status(404).send({
                error: "User not found"
            })
        }
    })
}