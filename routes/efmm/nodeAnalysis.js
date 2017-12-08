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

var indexStackingOee = global.config.es_index.stacking_oee;
var indexStackingStatus = global.config.es_index.stacking_status;

var indexNotchingOee = global.config.es_index.notching_oee;
var indexNotchingPatternData = global.config.da_index.notching_oee_pattern_data;
var indexNotchingPatternInfo = global.config.da_index.notching_oee_pattern_info;
var indexNotchingPatternMatch = global.config.da_index.notching_oee_pattern_matching;

var startTime = CONSTS.TIMEZONE.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

/* GET analysis page. */
router.get('/', function(req, res, next) {
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
  res.render('efmm' + '/analysis/anomaly', outdata);
});

router.get('/clustering', function(req, res, next) {
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
  res.render('efmm' + '/analysis/clustering', outdata);
});

router.get('/anomaly', function(req, res, next) {
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
  res.render('efmm' + '/analysis/anomaly', outdata);
});

router.get('/pattern', function(req, res, next) {
  logger.debug(_rawDataByDay);
  res.render('efmm'+'/analysis/pattern', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/patternMatching', function(req, res, next) {
  logger.debug(_rawDataByDay);
  res.render('efmm'+'/analysis/patternMatching', { title: global.config.productname, mainmenu:mainmenu});
});

// get notching raw data
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
// Anomaly query RawData
router.get('/restapi/getOeeDataLive', function(req, res, next) {
  logger.debug('analysis/restapi/getOeeDataLive');

  let flag = req.query.step;
  let cid = req.query.machine;
  var today = Utils.getToday(fmt2, 'Y', 'Y');
  var in_data = {
    // INDEX : indexNotchingOee+'*',
    INDEX : indexNotchingOee+Utils.getDate(today, fmt2, 0, 0, 0, 1, 'Y', 'Y').split('T')[0].replace(/-/g,'.'),
    TYPE : "oee",
    START: Utils.getDate(today, fmt2, 0, 0, 0, -11, 'Y', 'Y'),
    END: Utils.getDate(today, fmt2, 0, 0, 0, -2, 'Y', 'Y'),
    FLAG : flag, CID : cid
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

// Anomaly
router.get('/restapi/getOeeChartData', function(req, res, next) {
  logger.debug('analysis/restapi/getOeeChartData');
  let flag = req.query.step;
  let cid = req.query.machine;

  var now = Utils.getToday(fmt2, 'Y', 'Y');
  var in_data = {
    START: Utils.getDate(now, fmt2, 0, 0, -30, 0, 'Y', 'Y'),
    END: Utils.getDate(now, fmt2, 0, 0, 0, 10, 'Y', 'Y'),
    INDEX : indexNotchingOee+Utils.getDate(now, fmt2, 0, 0, 0, 1, 'Y', 'Y').split('T')[0].replace(/-/g,'.'),
    TYPE : "oee",
    FLAG : flag, CID : cid
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

// Pattern Management pattern list
router.get('/restapi/getAnomalyPatternList', function(req, res, next) {
  logger.debug("req.query:", req.query);
  var sDate = Utils.getDate(req.query.startDate, fmt1, -1, 0, 0, 0);
  var eDate = Utils.getMs2Date(req.query.endDate, fmt1);
  var in_data = {
      INDEX : indexNotchingPatternData, TYPE : "pattern_data",
      START_TIMESTAMP: sDate+startTime,
      END_TIMESTAMP: eDate+startTime,
      MASTER_ID: req.query.masterId};
  var sql = "selectPatternList";
  queryProvider.selectSingleQueryByID2("analysis", sql, in_data, function(err, out_data, params) {
    // logger.debug(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    logger.debug('analysis/restapi/getAnomalyPatternList -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

// Pattern Management load patterns data : update 2017-11-07
router.get('/restapi/getPatterns', function(req, res, next) {
  logger.debug(req.query);
  var in_data = {
    INDEX: indexNotchingPatternInfo,
    TYPE: "pattern_info",
    ID: req.query.id
  };
  queryProvider.selectSingleQueryByID2("analysis", "selectPatterns", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data.length == 0) {
      rtnCode = CONSTS.getErrData('0001');
      res.json({rtnCode: rtnCode});
    } else {
      var patternData = out_data[0]._source.da_result;
      logger.debug('######################', patternData.ampere.cluster_032);
      if (req.query.id == "master"){
        res.json({rtnCode: rtnCode, patternData: patternData});
      } else {
        var in_data = { INDEX: indexPatternInfo, TYPE: "pattern_info", ID: "master"};
        queryProvider.selectSingleQueryByID2("analysis", "selectPatterns", in_data, function(err, out_data, params) {
          var rtnCode = CONSTS.getErrData('0000');
          if (out_data.length == 0) {
            rtnCode = CONSTS.getErrData('0001');
            res.json({rtnCode: rtnCode});
          } else {
            var masterData = out_data[0]._source.da_result;
            logger.debug('######################', masterData.ampere.cluster_121);

            for (var group in patternData) {
              for (var cno in patternData[group]) {
                mCno = patternData[group][cno]['masterCN'];
                if (mCno != 'unknown'){
                  patternData[group][cno]['status'] = masterData[group][mCno]['status'];
                }
              }
            }
            logger.debug('analysis/restapi/getPatterns -> length : %s', out_data.length);
            res.json({rtnCode: rtnCode, patternData: patternData});
          }
        });
      }
    }
  });
});

// Pattern Matching
router.post('/restapi/getMatchingPattern', function(req, res, next) {
  logger.debug("req.body: ", req.body);
  var sDate = Utils.getDateLocal2UTC(req.body.startDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
  var eDate = Utils.getDateLocal2UTC(req.body.endDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
  var in_data = {
    INDEX: indexNotchingPatternMatch,
    TYPE: "pattern_matching",
    START_TIMESTAMP: sDate,
    END_TIMESTAMP: eDate
  };
  queryProvider.selectSingleQueryByID2("analysis", "selectMatchingPattern", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data === null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      out_data.forEach(function(d){
        var utcDt = d._source.da_result.timestamp;
        var localDt = Utils.getDateUTC2Local(utcDt, CONSTS.DATEFORMAT.DATETIME, 'Y');
        d._source.da_result.timestamp = localDt;
      });
    }
    logger.debug('analysis/restapi/getAnomaly_Pattern -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

// router.get('/restapi/getAnomalyPatternCheck/', function(req, res, next) {
//   var now = Utils.getToday(fmt2, 'Y', 'Y');
//   var start = Utils.getDate(now, fmt2, 0, 0, -2, 0, 'Y', 'Y');
//   var in_data = {  INDEX: indexNotchingPatternMatch, TYPE: "pattern_matching",
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