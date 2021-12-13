exports.up = async (knex) => {
    return knex.schema
    .createTable('users', function (table) {
       table.increments('id');
       table.string('full_name', 25).notNullable();
       table.string('user_name', 25).notNullable();
       table.string('email', 50).notNullable();
       table.string('password', 255).notNullable();
    })
    .createTable('quiz', function (table) {
        table.increments('id');
        table.string('quiz_name', 25).notNullable();
        table.string('desc', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.integer('created_by').unsigned().references('id').inTable('users');
        table.string('level', 15).notNullable();
        table.integer('number_of_questions', 25).notNullable();
        table.string('category', 25).notNullable();
        table.string('pass_score', 25).notNullable();
     })
     .createTable('quiz_questions', function (table) {
        table.increments('question_id');
        table.string('question', 255).notNullable();
        table.string('type',255);
        table.string('option1', 255).notNullable();
        table.string('option2', 255).notNullable();
        table.string('option3', 255);
        table.string('option4', 255);
        table.string('answer', 255).notNullable();
        table.integer('quiz_id').unsigned().references('id').inTable('quiz');
     })
     .createTable('quiz_results', function (table) {
        table.increments('id');
        table.string('result', 255).notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('quiz_id').unsigned().references('id').inTable('quiz');
     })
     .createTable('quiz_answers', function (table) {
         table.increments('id');
         table.string('answer', 255).notNullable();
         table.integer('question_id').unsigned().references('question_id').inTable('quiz_questions');
         table.integer('quiz_result_id').unsigned().references('id').inTable('quiz_results');
       });
};

exports.down = async (knex) => {
    return knex.schema
    .dropTable('quiz_answers')
    .dropTable("quiz_results")
    .dropTable("quiz_questions")
    .dropTable("quiz")
    .dropTable("users");
};