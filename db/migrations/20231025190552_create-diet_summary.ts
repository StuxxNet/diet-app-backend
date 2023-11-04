import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diet_summary', (table) => {
    table.uuid('id').notNullable()
    table.uuid('user_id').notNullable()
    table.bigInteger('current_streak').notNullable().defaultTo(1)
    table.bigInteger('max_streak').notNullable().defaultTo(1)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diet_summary')
}
