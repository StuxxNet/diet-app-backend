import { it, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('UsersRoute', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  describe('when everything is configured right', () => {
    it('should be able to create a new user', async () => {
      const response = await request(app.server).post('/users').send({
        name: 'Ramon Borges',
        born_date: '07/04/1994',
        email: 'ramonboorges@gmail.com',
        password: 'abc1234',
      })

      expect(response.statusCode).toEqual(201)
    })

    it('should be able to get a created user', async () => {
      const userCreationResponse = await request(app.server)
        .post('/users')
        .send({
          name: 'Ramon Borges',
          born_date: '07/04/1994',
          email: 'ramonboorges@gmail.com',
          password: 'abc1234',
        })
      const cookies = userCreationResponse.headers['set-cookie']

      const response = await request(app.server)
        .get('/users')
        .set('Cookie', cookies)
        .send()

      expect(response.statusCode).toEqual(200)
    })
  })
})
