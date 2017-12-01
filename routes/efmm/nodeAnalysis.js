var logger = global.log4js.getLogger('nodeAnalysis');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var fs = require('fs');
var net = require('net');
var router = express.Router();
var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;

var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis: 'open selected', management:'', settings:''};

var indexNotchingOee = global.config.es_index.notching_oee;
var indexStackingOee = global.config.es_index.stacking_oee;

var startTime = CONSTS.STARTTIME.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

/* GET analysis page. */
router.get('/', function(req, res, next) {
  // console.log(_rawDataByDay);
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
  logger.info('mainmenu : %s, outdata : %s', mainmenu.analysis, JSON.stringify(outdata));  
  res.render(global.config.pcode + '/analysis/clustering', outdata);
});

router.get('/clustering', function(req, res, next) {
   console.log('/analysis/clustering');  
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
  logger.info('mainmenu : %s, outdata : %s' , mainmenu.analysis, JSON.stringify(outdata));  
  res.render(global.config.pcode + '/analysis/clustering', outdata);
});

router.get('/anomaly', function(req, res, next) {
   console.log('/analysis/anomaly');  
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
  logger.info('mainmenu : %s, outdata : %s' , mainmenu.analysis, JSON.stringify(outdata));  
  res.render(global.config.pcode + '/analysis/anomaly', outdata);
});

// api test
router.get('/restapi/test', function(req, res, next){
  logger.debug("req.query:", req.query);
  var rtnCode = CONSTS.getErrData('0000');
  res.json({rtnCode: rtnCode, rtnData: "test ok"});
  logger.debug('analysis/restapi/test -> ok');
});

// get stacking data
router.get('/restapi/getNotchingOeeRaw', function(req, res, next){
  logger.debug("req.query:", req.query);
  var sDate = Utils.getDateLocal2UTC(req.query.startDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
  var eDate = Utils.getDateLocal2UTC(req.query.endDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
  var in_data = { INDEX : indexNotchingOee+'*', TYPE : "oee", START: sDate, END: eDate  };
  queryProvider.selectSingleQueryByID2("analysis", "selectNotchingOeeRaw", in_data, function(err, out_data, params) {
    if (out_data === null) {
      var rtnCode = CONSTS.getErrData('0001');
      res.json({rtnCode: rtnCode, rtnData: out_data});
    } else {
      var rtnCode = CONSTS.getErrData('0000');
      res.json({rtnCode: rtnCode, rtnData: out_data });
    }
    logger.debug('analysis/restapi/getAnomaly_Pattern -> length : %s', out_data.length);
  });
});



module.exports = router;