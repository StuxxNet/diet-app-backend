// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface User {
    id: string
    name: string
    born_date: string
    email: string
    password: string
  }

  interface Diet {
    id: string
    name: string
    date: string
    description: string
    in_accordance: boolean
    user_id: string
  }

  interface DietSummary {
    id: string
    user_id: string
    current_streak: number
    max_streak: number
  }

  export interface Tables {
    users: User
    diets: Diet
    diet_summary: DietSummary
  }
}
