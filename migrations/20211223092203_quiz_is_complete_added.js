
exports.up = function(knex) {
  return knex.schema.alterTable('quiz', function(table) {
    table.boolean('is_complete').defaultTo(false);
  });
};

exports.down = function(knex) {
    return knex.schema.alterTable('quiz', function(table) {
        table.dropColumn('is_complete');
    });
};
