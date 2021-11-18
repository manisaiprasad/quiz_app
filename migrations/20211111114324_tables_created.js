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
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.integer('quiz_created_by').unsigned().references('id').inTable('users');
        table.string('quiz_level', 255).notNullable();
        table.integer('number_of_questions', 255).notNullable();
        table.string('quiz_category', 255).notNullable();
        table.string('quiz_time', 255);
        table.string('quiz_pass_score', 255).notNullable();
     })
     .createTable('quiz_questions', function (table) {
        table.increments('question_id');
        table.string('question', 255).notNullable();
        table.string('question_type',255);
        table.string('option1', 255).notNullable();
        table.string('option2', 255).notNullable();
        table.string('option3', 255);
        table.string('option4', 255);
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
    .dropTable("quiz_results")
    .dropTable("quiz_questions")
    .dropTable("quiz")
    .dropTable("users");
};   