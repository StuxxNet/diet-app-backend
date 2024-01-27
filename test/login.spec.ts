import { it, expect, beforeAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('UserLogin', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  describe('When everything is configured correctly', () => {
    it('it should be able to login with a created user', async () => {
      await createUser()

      const userLoginResponse = await request(app.server).post('/login').send({
        email: 'ramonboorges@gmail.com',
        password: 'abc1234',
      })

      expect(userLoginResponse.statusCode).toEqual(200)
    })
  })
})

async function createUser() {
  await request(app.server).post('/users').send({
    name: 'Ramon Borges',
    born_date: '07/04/1994',
    email: 'ramonboorges@gmail.com',
    password: 'abc1234',
  })
}
