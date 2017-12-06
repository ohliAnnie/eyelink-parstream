var logger = global.log4js.getLogger('nodeTimeseries');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
require('date-utils');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'open selected', reports:'', analysis:'', management:'', settings:''};

var indexNotchingOee = global.config.es_index.notching_oee;
var indexStackingOee = global.config.es_index.stacking_oee;

var startTime = CONSTS.STARTTIME.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

router.get('/', function(req, res, next) {
  // console.log(_rawDataByDay);
  var outdata = { title: global.config.productname, mainmenu : mainmenu };

  logger.info('mainmenu : %s, outdata : %s', mainmenu.timeseries, JSON.stringify(outdata));  
  res.render(global.config.pcode + '/timeseries/timeseries', outdata);
});

module.exports = router;