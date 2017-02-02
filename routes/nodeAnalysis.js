var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var fs = require('fs');
var router = express.Router();
var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method + '-db').QueryProvider;

var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', reports:'', timeseries:'', analysis: 'open selected', users:'', settings:''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/clustering', { title: 'EyeLink for ParStream', mainmenu:mainmenu});
});

router.get('/clustering', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/clustering', { title: 'EyeLink for ParStream', mainmenu:mainmenu});
});

// query RawData
router.get('/restapi/getDaClusterDetail', function(req, res, next) {
  console.log(req.query);
  var in_data = {
      START_TIMESTAMP: req.query.startDate + ' 00:00:00',
      END_TIMESTAMP: req.query.endDate + ' 23:59:59',
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID("analysis", "selectDaClusterDetail", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    // console.log('typeof array : %s', (typeof out_data[0] !== 'undefined'));
    // console.log('typeof array : %s', (out_data[0] !== null));

    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data);
    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data[0]);
    console.log('analysis/restapi/getDaClusterDetail -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

router.get('/restapi/getDaClusterMaster', function(req, res, next) {
  console.log(req.query);
  var in_data = {
      START_TIMESTAMP: req.query.startDate + ' 00:00:00',
      END_TIMESTAMP: req.query.endDate + ' 23:59:59',
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID("analysis", "selectDaClusterMaster", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    // console.log('typeof array : %s', (typeof out_data[0] !== 'undefined'));
    // console.log('typeof array : %s', (out_data[0] !== null));

    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data);
    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data[0]);
    console.log('analysis/restapi/getDaClusterMaster -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});


// query RawData
router.get('/restapi/getClusterNodePower', function(req, res, next) {
  console.log(req.query);
  console.log(req.query.nodeId[0]);
  var in_data = {
      START_TIMESTAMP: req.query.startDate + ' 00:00:00',
      END_TIMESTAMP: req.query.endDate + ' 23:59:59',
      NODE: req.query.nodeId,
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID("analysis", "selectClusterNodePower", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    // console.log('typeof array : %s', (typeof out_data[0] !== 'undefined'));
    // console.log('typeof array : %s', (out_data[0] !== null));

    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data);
    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data[0]);
    console.log('analysis/restapi/getClusterNodePower -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

// query RawData
router.get('/restapi/getClusterRawData', function(req, res, next) {
  console.log(req.query);
  var in_data = {
      START_TIMESTAMP: req.query.startDate + ' 00:00:00',
      END_TIMESTAMP: req.query.endDate + ' 23:59:59',
      NODE: req.query.node,
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID("analysis", "selectClusterRawData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    // console.log('typeof array : %s', (typeof out_data[0] !== 'undefined'));
    // console.log('typeof array : %s', (out_data[0] !== null));

    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data);
    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data[0]);
    console.log('analysis/restapi/getClusterRawData -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

// insert RawData
router.post('/restapi/insertClusterRawData', function(req, res, next) {
  console.log('/restapi/insertClusterRawData -> body : %j', req.body);
  console.log('/restapi/insertClusterRawData -> master : %j', req.body.tb_da_clustering_master);
  console.log('/restapi/insertClusterRawData -> detail : %j', req.body.tb_da_clustering_detail);

  // TO-DO 일단 파일로 저장함. DB로 INSERT 로직 추가 구현 필요함.
  // var clustering_data = req.body;
  // var clustering_data = JSON.parse(req.body);
  var clustering_data = JSON.stringify(req.body, null, 4);
  // console.log(clustering_data);
  fs.writeFile('./insertClusterRawData.log', clustering_data, function(err) {
    if(err) throw err;
    console.log('File write completed');
  });
  // var in_data = {
  //     START_TIMESTAMP: req.query.startDate + ' 00:00:00',
  //     END_TIMESTAMP: req.query.endDate + ' 23:59:59',
  //     NODE: req.query.node,
  //     FLAG : 'N'};
  // queryProvider.selectSingleQueryByID("analysis", "selectClusterRawData", in_data, function(err, out_data, params) {
  //   // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');

    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data);
    // console.log('analysis/restapi/getReportRawData -> out_data : %s', out_data[0]);
    // console.log('analysis/restapi/getClusterRawData -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: ''});
  // });
});


module.exports = router;