var CONSTS = require('./consts');
var express = require('express');
var router = express.Router();
var DashboardProvider = require('./dao/parstream/db-dashboard').DashboardProvider;

var dashboardProvider = new DashboardProvider();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET reports page. */
router.get('/', function(req, res, next) {
    res.render('./dashboard/main', { title: 'EyeLink for ParStream' });
});

// test db query logic
router.get('/restapi/get_successcount', function(req, res, next) {
  var in_data = ["user_id"];
  dashboardProvider.selectSingleQueryByID("selectSuccessCount", in_data, function(err, out_data) {
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
  var in_data = ["user_id"];
  dashboardProvider.selectSingleQueryByID("selectDashboardSection1", in_data, function(err, out_data) {
    console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });

});

// query RawData
router.get('/restapi/getReportRawData', function(req, res, next) {
  var in_data = ["user_id"];
  dashboardProvider.selectSingleQueryByID("selectEventRawData", in_data, function(err, out_data) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });

});


// query RawData for test
router.get('/restapi/fruits', function(req, res, next) {
  var in_data = ["user_id"];

  var out_data = [
    {"name": "apple", "cnt": 10},
    {"name": "orange", "cnt": 15},
    {"name": "banana", "cnt": 12},
    {"name": "grapefruit", "cnt": 2},
    {"name": "grapefruit", "cnt": 4},
    {"name": "pomegranate", "cnt": 1},
    {"name": "lime", "cnt": 12},
    {"name": "grape", "cnt": 50}
  ];

    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json(out_data);

});



module.exports = router;