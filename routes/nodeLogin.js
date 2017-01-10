var express = require('express');
var router = express.Router();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('login');
  // res.redirect('/dashboard/');
  res.render('./login/login', { title: 'EyeLink for ParStream' });
});

module.exports = router;
