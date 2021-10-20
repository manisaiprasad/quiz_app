var express = require('express');
const db = require('./db-config')
var router = express.Router();


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
  .post(function(req, res) {

    res.send(req.body)
  })

router.route('/login')
  .post(function(req, res) {
    console.log(req)
    res.send(req.body)

  })
  .get(function(req, res) {
    res.render('login')
  })

module.exports = router;
