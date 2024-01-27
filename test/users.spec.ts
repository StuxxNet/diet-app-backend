import { it, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('UsersRoute', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('when everything is configured right', () => {
    it('should be able to create a new user', async () => {
      const { statusCode } = await createUser()
      expect(statusCode).toEqual(201)
    })

    it('should be able to get a created user', async () => {
      const { cookies } = await createUser()
      const response = await request(app.server)
        .get('/users')
        .set('Cookie', cookies)
        .send()

      expect(response.statusCode).toEqual(200)
    })

    it('should be able to edit a user', async () => {
      const { cookies } = await createUser()
      const response = await request(app.server)
        .put('/users')
        .set('Cookie', cookies)
        .send({
          name: 'Ramon Silveira Borges',
          born_date: '07/04/1994',
          email: 'ramonboorges@gmail.com',
          password: 'abc1234',
        })

      expect(response.statusCode).toEqual(204)
    })

    it('should be able to delete a user', async () => {
      const { cookies } = await createUser()
      const response = await request(app.server)
        .delete('/users')
        .set('Cookie', cookies)
        .send()

      expect(response.statusCode).toEqual(204)
    })
  })
})

async function createUser(): Promise<{ statusCode: number; cookies: string }> {
  const username = generateRandomString()
  const userCreationResponse = await request(app.server)
    .post('/users')
    .send({
      name: 'Ramon Borges',
      born_date: '07/04/1994',
      email: `${username}@gmail.com`,
      password: 'abc1234',
    })
  const cookies = userCreationResponse.headers['set-cookie']

  return {
    statusCode: userCreationResponse.statusCode,
    cookies,
  }
}

function generateRandomString() {
  return Math.random().toString(20).substr(2, 6)
}
