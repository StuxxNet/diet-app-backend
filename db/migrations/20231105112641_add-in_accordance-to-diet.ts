import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diet', (table) => {
    table.boolean('in_accordance').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diet', (table) => {
    table.dropColumn('in_accordance')
  })
}
