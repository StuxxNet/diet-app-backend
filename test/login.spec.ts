import {it, expect, beforeAll, describe, beforeEach, afterAll} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('UserLogin', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('When everything is configured correctly', () => {
    it('it should be able to login with a created user', async () => {
      const username = await createUser()

      const userLoginResponse = await request(app.server)
        .post('/login')
        .send({
          email: `${username}@gmail.com`,
          password: 'abc1234',
        })

      expect(userLoginResponse.statusCode).toEqual(200)
    })
  })
})

async function createUser(): Promise<string> {
  const username = generateRandomString()
  await request(app.server)
    .post('/users')
    .send({
      name: 'Ramon Borges',
      born_date: '07/04/1994',
      email: `${username}@gmail.com`,
      password: 'abc1234',
    })

  return username
}

function generateRandomString() {
  return Math.random().toString(20).substr(2, 6)
}
