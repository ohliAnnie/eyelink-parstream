var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();
var ReportsProvider = require('./dao/parstream/db-reports').ReportsProvider;

var reportsProvider = new ReportsProvider();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./reports/main', { title: 'EyeLink for ParStream' });
});


router.get('/d3', function(req, res, next) {
  res.render('./reports/d3', { title: 'EyeLInk D3 Reports' });
});

router.get('/test', function(req, res, next) {
  res.render('./reports/test', { title: 'Test' });
});

router.get('/all', function(req, res, next) {
  res.render('./reports/report_all', { title: 'Report_All' });
});

router.get('/power', function(req, res, next) {
  res.render('./reports/report_power', { title: 'Report_Power' });
});

// query Report
router.get('/restapi/getReportRawData', function(req, res, next) {
  console.log('reports/restapi/getReportRawData');
  var in_data = {MERGE:'Y'};
  reportsProvider.selectSingleQueryByID("selectEventRawData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    // MERGE = 'Y'이면 이전 날짜의 RawData를 합쳐준다.
    if (params.MERGE === 'Y')
      out_data = Utils.mergeLoadedData(out_data);

    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});
  
// query Report
router.get('/restapi/testData', function(req, res, next) {
  console.log('reports/restapi/testData');
  var in_data = {MERGE:'Y'};
  reportsProvider.selectSingleQueryByID("testData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
  
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });

});

// query RawData
router.get('/restapi/getTbRawDataByPeriod', function(req, res, next) {
  console.log(req.query);
   var in_data = {
      START_TIMESTAMP: req.query.startDate + ' 00:00:00',
      END_TIMESTAMP: req.query.endDate + ' 23:59:59',
      FLAG : 'N'};
  reportsProvider.selectSingleQueryByID("selectEventRawDataOld", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    // MERGE = 'Y'이면 이전 날짜의 RawData를 합쳐준다.
    if (params.MERGE === 'Y')
      out_data = Utils.mergeLoadedData(out_data);

    console.log('reports/restapi/getTbRawDataByPeriod -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});


module.exports = router;
