var express = require('express');
var router = express.Router();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/dashboard/');
});

module.exports = router;
