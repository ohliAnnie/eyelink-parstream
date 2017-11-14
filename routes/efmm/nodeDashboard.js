var logger = global.log4js.getLogger('nodeDashboard');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
require('date-utils');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'open selected', timeseries:'', reports:'', analysis:'', management:'', settings:''};

/* GET reports page. */
router.get('/', function(req, res, next) {
  // console.log(_rawDataByDay);
  var outdata = {
    title: global.config.productname,
    mainmenu : mainmenu
  }

  logger.info('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  logger.debug('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  logger.error('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  res.render(global.config.pcode + '/dashboard/dashboard', outdata);
});

router.get('/test', function(req, res, next) {
  // console.log(_rawDataByDay);
  mainmenu.dashboard = ' open selected';

  mainmenu.timeseries = '';
  var outdata = {
    title: global.config.productname,
    mainmenu : mainmenu
  }

  logger.info('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  logger.debug('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  logger.error('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  res.render(global.config.pcode + '/dashboard/test', outdata);
});


module.exports = router;
