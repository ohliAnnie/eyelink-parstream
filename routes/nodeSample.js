var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'', settings:'', sample:'open selected'};

/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./sample/serverMap', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap', function(req, res, next) {
  res.render('./sample/serverMap', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap1', function(req, res, next) {
  res.render('./sample/serverMap1', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap2', function(req, res, next) {
  res.render('./sample/serverMap2', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap3', function(req, res, next) {
  res.render('./sample/serverMap3', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/bsc01', function(req, res, next) {
  res.render('./sample/bsc01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/bsc02', function(req, res, next) {
  res.render('./sample/bsc02', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/bsc03', function(req, res, next) {
  res.render('./sample/bsc03', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

  
module.exports = router;
