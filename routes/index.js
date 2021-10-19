var express = require('express');
const db = require('./db-configb')

var router = express.Router();
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
