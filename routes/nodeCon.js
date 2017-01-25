var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method + '-db').QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};
/* GET home page. */
router.get('/nodes', function(req, res, next) {
  console.log('node');
     var in_data = {};
  queryProvider.selectSingleQueryByID("reports","selectNodeList", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log('node/restapi/getNodeList -> length : %s', out_data[0].length);
  res.render('./node/nodes', { title: 'EyeLink for ParStream' , nodeData:out_data[0]});
    });
});

router.get('/status', function(req, res, next) {
  console.log('node');
  // res.redirect('/dashboard/');
  res.render('./node/node_status', { title: 'EyeLink for ParStream' });
});

router.get('/als', function(req, res, next) {
  console.log('node');
  // res.redirect('/dashboard/');
  res.render('./node/registration_als', { title: 'EyeLink for ParStream' });
});

router.get('/gps', function(req, res, next) {
  console.log('node');
  // res.redirect('/dashboard/');
  res.render('./node/registration_gps', { title: 'EyeLink for ParStream' });
});

// query Report
router.get('/restapi/getReportRawData', function(req, res, next) {
  console.log('reports/restapi/getReportRawData');
  var in_data = {MERGE:'Y'};
  queryProvider.selectSingleQueryByID("node","selectEventRawData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});


module.exports = router;
