exports.up = async (knex) => {
    return knex.schema
    .createTable('users', function (table) {
       table.increments('id');
       table.string('full_name', 255).notNullable();
       table.string('user_name', 255).notNullable();
       table.string('email', 255).notNullable();
       table.string('password', 255).notNullable();
    })
    .createTable('quiz', function (table) {
        table.increments('id');
        table.string('quiz_name', 255).notNullable();
        table.string('quiz_desc', 255).notNullable();
        table.string('quiz_status', 255).notNullable();
        table.string('quiz_created_by', 255).notNullable();
        table.string('quiz_created_date', 255).notNullable();
        table.string('quiz_modified_by', 255).notNullable();
        table.string('quiz_modified_date', 255).notNullable();
     })
     .createTable('quiz_questions', function (table) {
        table.increments('question_id');
        table.string('question', 255).notNullable();
        table.string('options', 255).notNullable();
        table.string('answer', 255).notNullable();
        table.integer('quiz_id').unsigned().references('id').inTable('quiz');
     })
     .createTable('quiz_results', function (table) {
        table.increments('result_id');
        table.string('result', 255).notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('quiz_id').unsigned().references('id').inTable('quiz');
     });
};

exports.down = async (knex) => {
    return knex.schema
    .dropTable("users")
    .dropTable("quiz")
    .dropTable("quiz_questions")
    .dropTable("quiz_results");
};