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

router.get('/serverMap2', function(req, res, next) {
  res.render('./sample/serverMap2', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap3', function(req, res, next) {
  res.render('./sample/serverMap3', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/cytoscape01', function(req, res, next) {
  res.render('./sample/cytoscape01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/cytoscape02', function(req, res, next) {
  res.render('./sample/cytoscape02', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/cytoscape03', function(req, res, next) {
  res.render('./sample/cytoscape03', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/cytoscape04', function(req, res, next) {
  res.render('./sample/cytoscape04', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/cytoscape05', function(req, res, next) {
  res.render('./sample/cytoscape05', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});
  
router.get('/cytoscape06', function(req, res, next) {
  res.render('./sample/cytoscape06', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/cytoscape07', function(req, res, next) {
  res.render('./sample/cytoscape07', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});
  
module.exports = router;
