var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method + '-db').QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};
/* GET home page. */
router.get('/nodes', function(req, res, next) {
  console.log('node');
  // res.redirect('/dashboard/');
  res.render('./node/nodes', { title: 'EyeLink for ParStream' });
});

router.get('/status', function(req, res, next) {
  console.log('node');
  // res.redirect('/dashboard/');
  res.render('./node/node_status', { title: 'EyeLink for ParStream' });
});

router.get('/als', function(req, res, next) {
  console.log('node');
  // res.redirect('/dashboard/');
  res.render('./node/registration_als', { title: 'EyeLink for ParStream' });
});

router.get('/gps', function(req, res, next) {
  console.log('node');
  // res.redirect('/dashboard/');
  res.render('./node/registration_gps', { title: 'EyeLink for ParStream' });
});


module.exports = router;
