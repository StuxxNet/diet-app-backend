import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'TEST') {
  config({ path: 'env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  PORT: z.coerce.number().default(3000),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variable: ', _env.error.format())

  throw new Error('Invalid environment variable')
}

export const env = _env.data
