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
var indexStackingStatus = global.config.es_index.stacking_status;

var startTime = CONSTS.STARTTIME.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

/* GET analysis page. */
router.get('/', function(req, res, next) {
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
  res.render(global.config.pcode + '/analysis/anomaly', outdata);
});

router.get('/clustering', function(req, res, next) {
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
  res.render(global.config.pcode + '/analysis/clustering', outdata);
});

router.get('/anomaly', function(req, res, next) {
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
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
  var sDate = Utils.getDateLocal2UTC(req.query.sDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
  var eDate = Utils.getDateLocal2UTC(req.query.eDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
  var in_data = { INDEX : indexNotchingOee+'*', TYPE : "oee", START: sDate, END: eDate  };
  queryProvider.selectSingleQueryByID2("analysis", "selectNotchingOeeRaw", in_data, function(err, out_data, params) {
    if (out_data.length == 0) {
      var rtnCode = CONSTS.getErrData('0001');
      res.json({rtnCode: rtnCode, rtnData: out_data});
    } else {
      var rtnCode = CONSTS.getErrData('0000');
      res.json({rtnCode: rtnCode, rtnData: out_data });
    }
    logger.debug('analysis/restapi/getAnomaly_Pattern -> length : %s', out_data.length);
  });
});


// get stacking status
router.get('/restapi/getStackingStatus', function(req, res, next){
  logger.debug("req.query:", req.query);
  var sDate = Utils.getDateLocal2UTC(req.query.sDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
  var eDate = Utils.getDateLocal2UTC(req.query.eDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
  var in_data = {
    INDEX : indexStackingStatus+'*',
    TYPE : "status",
    START: sDate,
    END: eDate,
    CID: req.query.cid,
    STYPE: req.query.sType
  };
  queryProvider.selectSingleQueryByID2("analysis", "selectStackingStatus", in_data, function(err, out_data, params) {
    if (out_data.length == 0) {
      var rtnCode = CONSTS.getErrData('0001');
      res.json({rtnCode: rtnCode, rtnData: out_data});
    } else {
      var rtnCode = CONSTS.getErrData('0000');
      var data = []
      out_data.forEach(function(d){
        d._source["data"].forEach(function(element, index) {
          data.push(element);
        });
      });
      res.json({rtnCode: rtnCode, rtnData: data });
    }
    logger.debug('analysis/restapi/getStackingStatus -> length : %s', out_data.length);
  });
});

/*
For Client Visualization
*/
// query RawData
router.get('/restapi/getOeeDataLive', function(req, res, next) {
  logger.debug('analysis/restapi/getOeeDataLive');

  let flag = req.query.step;
  let cid = req.query.machine;
  var today = Utils.getToday(fmt2, 'Y', 'Y');
  var in_data = {
        start: Utils.getDate(today, fmt2, 0, 0, 0, -1, 'Y', 'Y'),
        end: Utils.getDate(today, fmt2, 0, 0, 0, 1, 'Y', 'Y'),
        index : indexNotchingOee+Utils.getDate(today, fmt2, 0, 0, 0, 1, 'Y', 'Y').split('T')[0].replace(/-/g,'.'),
        type : "oee",
        flag : flag, cid : cid
      };
  logger.debug('in_data : ',in_data);
  queryProvider.selectSingleQueryByID2("analysis", "selectNotchingOeeRaw", in_data, function(err, out_data, params) {
     //logger.debug(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    var data = [];
    out_data.forEach(function(d){
      d._source.data.forEach(function(d2){
        let keys = { "overall_oee" : [], "availability" : [], "quality" : [], "performance" : [] };
        for ( key in keys ) {
          d2[key] = d2[key] * 100;
        }
        data.push(d2);
      });
    });
    logger.debug('analysis/restapi/getOeeDataLive -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

router.get('/restapi/getOeeChartData', function(req, res, next) {
  logger.debug('analysis/restapi/getOeeChartData');
  let flag = req.query.step;
  let cid = req.query.machine;

  var now = Utils.getToday(fmt2, 'Y', 'Y');
  var in_data = {
        start: Utils.getDate(now, fmt2, 0, 0, -30, 0, 'Y', 'Y'),
        end: Utils.getDate(now, fmt2, 0, 0, 0, 10, 'Y', 'Y'),
        index : indexNotchingOee+Utils.getDate(now, fmt2, 0, 0, 0, 1, 'Y', 'Y').split('T')[0].replace(/-/g,'.'),
        type : "oee",
        flag : flag, cid : cid
      };
  queryProvider.selectSingleQueryByID2("analysis", "selectNotchingOeeRaw", in_data, function(err, out_data, params) {
     //logger.debug(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      logger.debug('out_data is NULL');
      rtnCode = CONSTS.getErrData('0001');
    } else if(out_data.length == 0) {
      logger.debug('out_data is EMPTY');
      rtnCode = CONSTS.getErrData('0001');
    } else {
      logger.debug('out_data : ',out_data);
      var rawData = [];
      out_data.forEach(function(d1){
        d1._source.data.forEach(function(d2){
          let keys = { "overall_oee" : [], "availability" : [], "quality" : [], "performance" : [] };
          for ( key in keys ) {
            d2[key] = d2[key] * 100;
          }
          rawData.push(d2);
        });
      });
      logger.debug('analysis/restapi/getOeeChartData -> length : %s', out_data.length);
      // res.json({rtnCode: rtnCode, rtnData: data});
      res.json({rtnCode: rtnCode, raw : rawData});
    }
  });
});
// router.get('/restapi/getAnomalyPatternCheck/', function(req, res, next) {
//   var now = Utils.getToday(fmt2, 'Y', 'Y');
//   var start = Utils.getDate(now, fmt2, 0, 0, -2, 0, 'Y', 'Y');
//   var in_data = {  INDEX: indexPatternMatching, TYPE: "pattern_matching",
//         gte : start,     lte : now }
//   queryProvider.selectSingleQueryByID2("analysis", "selectByAnalysisTimestamp", in_data, function(err, out_data, params) {
//     var rtnCode = CONSTS.getErrData('0000');
//     if (out_data == null) {
//       rtnCode = CONSTS.getErrData('0001');
//     }
//     res.json({rtnCode: rtnCode, rtnData : out_data});
//   });
// });



module.exports = router;
