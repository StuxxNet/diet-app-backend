import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'
import { loginRoutes } from './routes/login'

export const app = fastify()

app.register(cookie)

app.register(loginRoutes, {
  prefix: 'login',
})
app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
