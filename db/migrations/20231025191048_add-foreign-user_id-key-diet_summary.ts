import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diet_summary', (table) => {
    table.foreign('user_id').references('users.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diet_summary', (table) => {
    table.dropForeign('user_id')
  })
}

