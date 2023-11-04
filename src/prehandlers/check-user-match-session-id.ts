import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function checkUserMatchSessionid(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const putUserParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = putUserParamsSchema.parse(request.params)
  const { sessionId } = request.cookies

  if (sessionId !== id) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
