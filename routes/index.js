var express = require('express');
const db = require('../configs/db-config')
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const intializePassport = require('../configs/passport-config');
const { session } = require('passport');

intializePassport(passport);

function insertUser(db, newUser) {
  return db
    .insert(newUser)
    .into("users")
    .then(rows => {
      return rows[0];
    });
}
function insertQuiz(db, newQuiz){ 
  return db
    .insert(newQuiz)
    .into("quiz")
    .then(rows => {
      return rows[0];
    });
}
function insertQuestion(db, newQuestion) {
  return db
    .insert(newQuestion)
    .into("quiz_questions")
    .then(rows => {
      return rows[0];
    });
}
function getUser(db, user_id) {
  return db
    .select("*")
    .from("users")
    .where("id", user_id)
    .first();
}

/* GET home page. */
router.get('/', checkAuthenticated,  function(req, res, next) {
  db.select('*').from('quiz').then(quiz => {
    res.render('index', { title: 'Quiz', quizs: quiz, username: req.user.user_name});
  })
});

/* signup page. */
router.route('/signup')
  .get( checkNotAuthenticated, function(req, res) {
    res.render('signup')
  })
  .post( checkNotAuthenticated, async(req, res) =>{
    try {
      const { email, password, full_name, user_name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await insertUser(db, { email, password: hashedPassword, full_name, user_name });
      res.redirect('/login');
    } catch (err) {
      console.log(err);
      res.redirect('/signup');
    }
  });

/* login page. */
router.route('/login')
  .get( checkNotAuthenticated,async function(req, res) {
    res.render('login')
  })
  .post( checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
    }));

router.get('/logout', function(req, res) {
  req.logOut()
  res.redirect('/login')
});

/* new Quiz page. */
router.route('/new_quiz')
  .get( checkAuthenticated, function(req, res) {
    res.render('new_quiz')
  })
  .post( checkAuthenticated, async(req, res) =>{
    try {
      const { quiz_name, desc, category, Quiz_Category_others, level, number_of_questions, pass_score } = req.body;
      const created_by = req.user.id;
      const quiz = await insertQuiz(db, { quiz_name, desc, category, level, number_of_questions, pass_score, created_by });
      res.redirect('/new_quiz/'+quiz_name+'/question/1');
    } catch (err) {
      console.log(err);
      res.redirect('/new_quiz');
    }
  });

router.route('/new_quiz/:quiz_name/question/:q_no')
  .get( checkAuthenticated, function(req, res) {
    db.select('*').from('quiz').where('quiz_name', req.params.quiz_name).first().then(quiz => {
      console.log(quiz);
      res.render('new_question', {quiz: quiz, q_no: req.params.q_no})
      // res.render('new_question', {quiz_name: req.params.quiz_name, question_number: req.params.q_no, quizs: quiz});
    })
  })
  .post( checkAuthenticated, async(req, res) =>{
    try {
        if (req.params.q_no <= parseInt(req.body.number_of_questions)) {
          const { question, option1, option2, option3, option4, correct_option, quiz_id } = req.body;
          const answer = correct_option;
          const questions = await insertQuestion(db, { question, answer, option1, option2, option3, option4, quiz_id });
          
          if (req.params.q_no == parseInt(req.body.number_of_questions)) {
            res.redirect('/');
          }

          let new_q_no = parseInt(req.params.q_no) + parseInt(1);
          res.redirect('/new_quiz/'+req.params.quiz_name+'/question/'+new_q_no);      
        }else{
          res.redirect('/');
        }
    } catch (err) {
      console.log(err);
      res.redirect('/new_quiz/'+req.params.quiz_name+'/question/'+parseInt(req.params.q_no));
    }
  });
  
function getQuestions(db, quiz_id, callback) {
  db.select('*')
    .from('quiz_questions')
    .where('quiz_id', quiz_id).then(questions => {
      callback(questions);
    }
  );
}

  // /quiz/"+quiz.id+"/play
router.route('/quiz/:id/play/:q_no')
  .get( checkAuthenticated, function(req, res) {
    const page = req.params.q_no;
    db('quiz').join('quiz_questions','quiz.id','=','quiz_questions.quiz_id').select('*').where('id', req.params.id).paginate({
      perPage: 1,
      currentPage: page
    }).then(quiz => {
      console.log(quiz);
      res.render('play', {quiz: quiz})
    })
  })
  .post( checkAuthenticated, async(req, res) =>{
    try {
      if (req.params.q_no <= parseInt(req.body.number_of_questions)) {
        console.log(req.body);
        const { quiz_id, question_id, answer } = req.body;
        if (req.params.q_no == 1) {
          session.user_answers = [];
        }
        session.user_answers.push({question_id, answer});
        console.log(session.user_answers);

        if(req.params.q_no == parseInt(req.body.number_of_questions)){
          // Calculate score
          let quiz_questions = await getQuestions(db, quiz_id, function(questions){
            console.log(questions);
            console.log('session.user_answers');
            console.log(session.user_answers);
            var score = 0;
            for (let i = 0; i < questions.length; i++) {
              for (let j = 0; j < session.user_answers.length; j++) {
                if (questions[i].question_id == session.user_answers[j].question_id) {
                  console.log("match");
                  console.log(questions[i].answer);
                  console.log(session.user_answers[j].answer);
                  if (questions[i].answer == session.user_answers[j].answer) {
                    score = score + 1;
                    console.log("score: "+score);
                    break;
                  }
                }
              }
            }
            console.log("score"+score);
            // Save score
            db.insert({result:score, user_id: req.user.id, quiz_id}).into('quiz_results').then(result => {
              quiz_result_id = result[0];
              console.log(quiz_result_id);
              // Save answers
              for (let i = 0; i < session.user_answers.length; i++) {
                db.insert({quiz_result_id, question_id: session.user_answers[i].question_id, answer: session.user_answers[i].answer}).into('quiz_answers').then(answers => {
                  console.log(answers);
                })
              }
              return res.redirect('/quiz/'+quiz_id+'/result/'+quiz_result_id);
            })
          });
           
        }
        res.redirect('/quiz/'+quiz_id+'/play/'+(parseInt(req.params.q_no)+parseInt(1)));      
      }
      else{
        res.redirect('/');
      }
    } catch (err) {
      console.log(err);
      res.render('error', {error: err});
    }
  });
router.route('/your_quiz')
  .get( checkAuthenticated, function(req, res) {
    db('quiz').join('quiz_results','quiz.id','=','quiz_results.quiz_id').select('*').where('user_id', req.user.id).then(quiz => {
      console.log(quiz);
      res.render('your_quiz', {quizs: quiz})
    })
  })
  

router.route('/profile')
  .get( checkAuthenticated, function(req, res) {
    res.render('profile',{username: req.user.user_name})
  })
  

router.route('/search')
  .get( checkAuthenticated, function(req, res) {
    res.render('search',{username: req.user.user_name})
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

module.exports = router;