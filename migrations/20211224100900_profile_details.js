
exports.up = function(knex) {
    return knex.schema.createTable('profile_details', function(table) {
        table.increments('id');
        table.string('bio', 25).notNullable();
        table.string('profession', 25).notNullable();
        table.string('link', 50).notNullable();
        table.string('image_path', 255).notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users');
    });
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('profile_details');

};
