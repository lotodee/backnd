import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateUrlShorteners extends BaseSchema {
  protected tableName = 'url_shorteners'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.text('original_url').notNullable() // Use 'text' for longer URLs
      table.text('shortened_url').notNullable().unique() // Use 'text' for longer shortened URLs
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
