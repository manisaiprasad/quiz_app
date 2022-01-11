
exports.up = function(knex) {
    knex.schema.alterTable('users', function(table) {
        table.renameColumn('password', 'password_digest');
    });
};

exports.down = function(knex) {
    knex.schema.alterTable('users', function(table) {
        table.renameColumn('password_digest', 'password');
    });
};
