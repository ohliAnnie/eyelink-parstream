var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method + '-db').QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'open selected', timeseries:'', reports:'', analysis:'', management:'', settings:''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  // console.log(_rawDataByDay);
  mainmenu.dashboard = ' open selected';
  mainmenu.timeseries = '';
  res.render('./dashboard/main', { title: 'EyeLink for ParStream', mainmenu:mainmenu});
});

router.get('/timeseries', function(req, res, next) {
  // console.log(_rawDataByDay);
  mainmenu.dashboard = '';
  mainmenu.timeseries = ' open selected';
  res.render('./dashboard/timeseries', { title: 'EyeLink for ParStream', mainmenu:mainmenu });
});


// test db query logic
router.get('/restapi/get_successcount', function(req, res, next) {
  var in_data = {};
  queryProvider.selectSingleQueryByID("dashboard", "selectSuccessCount", in_data, function(err, out_data) {
    console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// test db query logic
router.get('/restapi/get_query_param', function(req, res, next) {
  console.log(req.query);
  var in_data = {};
  queryProvider.selectSingleQueryByID("dashboard", "selectQueryInParams", in_data, function(err, out_data) {
    console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});


// query Dashboard Section 1
router.get('/restapi/getDashboardSection1', function(req, res, next) {
  console.log(req.query);
   var in_data = {
      TODAY_TIMESTAMP: req.query.todate,
      YESTERDAY_TIMESTAMP: req.query.yesterdate,
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID("dashboard", "selectDashboardSection1", in_data, function(err, out_data) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });

});

// query RawData
router.get('/restapi/getDashboardRawData', function(req, res, next) {
  var in_data = {MERGE:'Y'};
  queryProvider.selectSingleQueryByID("dashboard", "selectEventRawData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    // console.log('typeof array : %s', (typeof out_data[0] !== 'undefined'));
    // console.log('typeof array : %s', (out_data[0] !== null));

    // MERGE = 'Y'이면 이전 날짜의 RawData를 합쳐준다.
    if (params.MERGE === 'Y')
      out_data = Utils.mergeLoadedData(out_data);

    // console.log('dashboard/restapi/getReportRawData -> out_data : %s', out_data);
    // console.log('dashboard/restapi/getReportRawData -> out_data : %s', out_data[0]);
    console.log('dashboard/restapi/getDashboardRawData -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

// TO-DO Query 성능 개선 필요.
// query RawData
router.get('/restapi/getTbRawDataByPeriod', function(req, res, next) {
  console.log(req.query);
   var in_data = {
      START_TIMESTAMP: req.query.startDate + ' 00:00:00',
      END_TIMESTAMP: req.query.endDate + ' 23:59:59',
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID("dashboard", "selectEventRawDataOld", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    // console.log('typeof array : %s', (typeof out_data[0] !== 'undefined'));
    // console.log('typeof array : %s', (out_data[0] !== null));

    // MERGE = 'Y'이면 이전 날짜의 RawData를 합쳐준다.
    if (params.MERGE === 'Y')
      out_data = Utils.mergeLoadedData(out_data);

    // console.log('dashboard/restapi/getReportRawData -> out_data : %s', out_data);
    // console.log('dashboard/restapi/getReportRawData -> out_data : %s', out_data[0]);
    console.log('dashboard/restapi/getTbRawDataByPeriod -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});


// Node Map
router.get('/restapi/getNodeGeo', function(req, res, next) {
  var out_data = [
    {zone_id : 'Zone-01', node_id : '0001.0000001', geo : '37.457271, 127.042861'},
    {zone_id : 'Zone-01', node_id : '0001.0000002', geo : '37.567271, 127.032861'},
    {zone_id : 'Zone-02', node_id : '0001.0000003', geo : '37.668271, 127.042861'},
    {zone_id : 'Zone-02', node_id : '0001.0000004', geo : '37.768271, 127.052761'},
  ];
  res.json(out_data);
});


module.exports = router;