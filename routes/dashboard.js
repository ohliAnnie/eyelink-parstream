var CONSTS = require('./consts');
var express = require('express');
var router = express.Router();

var DashboardProvider = require('./dao/parstream/db-dashboard').DashboardProvider;

var dashboardProvider = new DashboardProvider();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  	res.render('./dashboard/main', { title: 'EyeLink for ParStream' });
});


module.exports = router;
