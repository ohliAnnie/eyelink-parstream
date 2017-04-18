var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'', settings:'', service:'open selected'};

/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./service/serverMap', { title: 'EyeLink for ServiceMonitoring', mainmenu:mainmenu });
});

router.get('/serverMap', function(req, res, next) {
  res.render('./service/serverMap', { title: 'EyeLink for ServiceMonitoring', mainmenu:mainmenu });
});

router.get('/cytoscape01', function(req, res, next) {
  res.render('./service/cytoscape01', { title: 'EyeLink for ServiceMonitoring', mainmenu:mainmenu });
});

router.get('/cytoscape02', function(req, res, next) {
  res.render('./service/cytoscape02', { title: 'EyeLink for ServiceMonitoring', mainmenu:mainmenu });
});

router.get('/cytoscape03', function(req, res, next) {
  res.render('./service/cytoscape03', { title: 'EyeLink for ServiceMonitoring', mainmenu:mainmenu });
});

router.get('/cytoscape04', function(req, res, next) {
  res.render('./service/cytoscape04', { title: 'EyeLink for ServiceMonitoring', mainmenu:mainmenu });
});

router.get('/cytoscape05', function(req, res, next) {
  res.render('./service/cytoscape05', { title: 'EyeLink for ServiceMonitoring', mainmenu:mainmenu });
});
  
module.exports = router;
