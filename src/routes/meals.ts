import { FastifyInstance } from 'fastify'
import { z } from 'zod'

// Async pra usar await com knex pra esperar reposta do banco
// Zod pra validar o schema do body da request
export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", async (request) => {
    return {
      retorno: {
        hello: "world"
      }
    }
  })
}