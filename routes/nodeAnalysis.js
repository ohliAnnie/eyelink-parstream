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

router.get('/cluster_detail', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/cluster_detail', { title: 'EyeLink for ParStream', mainmenu:mainmenu});
});
/*router.get('/clustering', function(req, res, next) {
   var in_data = {};
  queryProvider.selectSingleQueryByID("analysis", "selectDaClusterMasterAll", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log(out_data[0]);    
    var master = out_data[0];  
    queryProvider.selectSingleQueryByID("analysis", "selectDaClusterDetailAll", in_data, function(err, out_data, params) {
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data[0] === null) {
        rtnCode = CONSTS.getErrData('0001');
      }
      console.log(out_data[0]);    
      var detail = out_data[0];  
      res.render('./analysis/clustering', { title: 'EyeLink for ParStream', mainmenu:mainmenu, master:master, detail:detail});
    });
  });
});*/

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
    console.log('analysis/restapi/getDaClusterMaster -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

router.get('/restapi/getDaClusterMasterAll', function(req, res, next) {
  console.log(req.query);
  var in_data = {};
  queryProvider.selectSingleQueryByID("analysis", "selectDaClusterMasterAll", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log('analysis/restapi/getDaClusterMasterAll -> length : %s', out_data[0].length);
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
  // console.log('Limit file size: '+limit);
  // console.log('/restapi/insertClusterRawData -> body : %j', req.body);
  console.log('/restapi/insertClusterRawData -> master : %j', req.body.tb_da_clustering_master);
  console.log('/restapi/insertClusterRawData -> detail : %j', req.body.tb_da_clustering_detail);

  req.body.tb_da_clustering_master.forEach(function(d) {
    var in_data = {              
      DATIME : d.da_time, START : d.start_date+' 00:00:00.0',  END : d.end_date+' 23:59:59.0', TIMEINTERVAL : d.time_interval ,
      C0VOL : d.c0_voltage, C1VOL : d.c1_voltage, C2VOL : d.c2_voltage, C3VOL : d.c3_voltage,
      C0AMP : d.c0_ampere, C1AMP : d.c1_ampere, C2AMP : d.c2_ampere, C3AMP : d.c3_ampere,
      C0ACT : d.c0_active_power, C1ACT : d.c1_active_power, C2ACT : d.c2_active_power, C3ACT : d.c3_active_power,
      C0POW : d.c0_power_factor, C1POW : d.c1_power_factor, C2POW : d.c2_power_factor, C3POW : d.c3_power_factor,
     };
    queryProvider.selectSingleQueryByID("analysis", "insertClusteringMaster", in_data, function(err, out_data, params) {       
    }); 
  });

  req.body.tb_da_clustering_detail.forEach(function(d) {    
    var in_data = {              
      DATIME : d.da_time, EVENTTIME : d.event_time, 
      C0VOL : d.c0_voltage, C1VOL : d.c1_voltage, C2VOL : d.c2_voltage, C3VOL : d.c3_voltage,
      C0AMP : d.c0_ampere, C1AMP : d.c1_ampere, C2AMP : d.c2_ampere, C3AMP : d.c3_ampere,
      C0ACT : d.c0_active_power, C1ACT : d.c1_active_power, C2ACT : d.c2_active_power, C3ACT : d.c3_active_power,
      C0POW : d.c0_power_factor, C1POW : d.c1_power_factor, C2POW : d.c2_power_factor, C3POW : d.c3_power_factor,
     };
    queryProvider.selectSingleQueryByID("analysis", "insertClusteringDetail", in_data, function(err, out_data, params) {       
    }); 
  });

  // TO-DO 일단 파일로 저장함. DB로 INSERT 로직 추가 구현 필요함.
  // var clustering_data = req.body;
  // var clustering_data = JSON.parse(req.body);
  var clustering_data = JSON.stringify(req.body, null, 4);
  // console.log(clustering_data);
/*  fs.writeFile('./insertClusterRawData.log', clustering_data, function(err) {
    if(err) throw err;
    console.log('File write completed');
  });*/
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