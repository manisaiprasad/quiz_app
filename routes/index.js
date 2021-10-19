var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',checkAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.route('/signup')
  .get(function(req, res) {
    res.render('signup')
  })

router.route('/login')
  .get(function(req, res) {
    res.render('login')
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
