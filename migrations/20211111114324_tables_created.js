exports.up = async (knex) => {
    return knex.schema
    .createTable('users', function (table) {
       table.increments('id');
       table.string('full_name', 25).notNullable();
       table.string('user_name', 25).notNullable();
       table.string('email', 25).notNullable();
       table.string('password', 25).notNullable();
    })
    .createTable('quiz', function (table) {
        table.increments('quiz_id');
        table.string('name', 25).notNullable();
        table.string('desc', 100).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.integer('created_by').unsigned().references('id').inTable('users');
        table.string('level', 15).notNullable();
        table.integer('number_of_questions', 25).notNullable();
        table.string('category', 25).notNullable();
        table.string('pass_score', 25).notNullable();
     })
     .createTable('quiz_questions', function (table) {
        table.increments('question_id');
        table.string('question', 100).notNullable();
        table.string('type',25);
        table.string('option1', 25).notNullable();
        table.string('option2', 25).notNullable();
        table.string('option3', 25);
        table.string('option4', 25);
        table.string('answer', 25).notNullable();
        table.integer('quiz_id').unsigned().references('id').inTable('quiz');
     })
     .createTable('quiz_results', function (table) {
        table.increments('id');
        table.string('result', 255).notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('quiz_id').unsigned().references('id').inTable('quiz');
     });
};

exports.down = async (knex) => {
    return knex.schema
    .dropTable("quiz_results")
    .dropTable("quiz_questions")
    .dropTable("quiz")
    .dropTable("users");
};