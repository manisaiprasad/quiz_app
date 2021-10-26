var express = require('express');
const db = require('../configs/db-config')
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const intializePassport = require('../configs/passport-config');

intializePassport(passport, email => {
    getUserByEmail(db,email).then(rows => {
      return rows[0];
    });
  }, userid => {
    return getUserById(db, userid);
  });

function getUserById(db, id) {
  db("users")
    .where('id', id ).then(rows => {
      return rows[0];
    }
  );
}

function getUserByEmail(db, user_email) {
  return db("users")
    .where('email',user_email).then(rows => rows[0]);
}

function insertUser(db, newUser) {
  return db
    .insert(newUser)
    .into("users")
    .then(rows => {
      return rows[0];
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: req.user.full_name });
});

/* signup page. */
router.route('/signup')
  .get(function(req, res) {
    res.render('signup')
  })
  .post(async(req, res) =>{
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
  .get(function(req, res) {
    console.log(getUserByEmail(db, 'manisaiprasadam@gmail.com').then(rows => {
      return rows[0];
    }));
    res.render('login')
  })
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
    }));

router.get('/logout', function(req, res) {
  
});

module.exports = router;
