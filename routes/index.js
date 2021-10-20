var express = require('express');
const db = require('./db-config')
var router = express.Router();
const bcrypt = require('bcrypt');

function insertUser(db, newUser) {
  return db
    .insert(newUser)
    .into("users")
    .then(rows => {
      return rows[0];
    });
}

function getAllEmails(db) {
  return db
    .select("email")
    .from("users")
    .then(rows => rows);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

router.route('/login')
  .get(function(req, res) {
    res.render('login')
  })
  .post(async(req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.select("*").from("users").where({ email });
      if (user.length === 0) {
        res.sendStatus(404);
      } else {
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (validPassword) {
          req.session.user = user[0];
          res.redirect('/');
        } else {
          res.sendStatus(401);
        }
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

router.get('/logout', function(req, res) {
  
});

module.exports = router;
