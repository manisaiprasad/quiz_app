var express = require('express');
const db = require('../configs/db-config')
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const intializePassport = require('../configs/passport-config');

intializePassport(passport);

function insertUser(db, newUser) {
  return db
    .insert(newUser)
    .into("users")
    .then(rows => {
      return rows[0];
    });
}
insertQuiz = (db, newQuiz) => { 
  return db
    .insert(newQuiz)
    .into("quiz")
    .then(rows => {
      return rows[0];
    });
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
      const { quiz_name, quiz_desc, quiz_category, Quiz_Category_others, quiz_level, number_of_questions, quiz_pass_score } = req.body;
      const quiz_created_by = req.user.id;
      const quiz = await insertQuiz(db, { quiz_name, quiz_desc, quiz_category, quiz_level, number_of_questions, quiz_pass_score, quiz_created_by });
      res.redirect('/');
    } catch (err) {
      console.log(err);
      res.redirect('/new_quiz');
    }
  });

router.route('/new_question')
  .get( checkAuthenticated, function(req, res) {
    res.render('new_question')
  })
  .post( checkAuthenticated, async(req, res) =>{
    try {
      const { question_text, question_type, question_category, question_category_others, question_level, question_answer, question_hint, question_difficulty, question_image } = req.body;
      // const user_id = req.user.id;
      const question = await insertQuestion(db, { question_text, question_type, question_category, question_level, question_answer, question_hint, question_difficulty, question_image });
      res.redirect('/');
    } catch (err) {
      console.log(err);
      res.redirect('/new_question');
    }
  }
  );
  
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