var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'', settings:'', sample:'open selected'};

/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./sample/serverMap', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/samplePage', function(req, res, next) {
  res.render('./sample/samplePage', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap', function(req, res, next) {
  res.render('./sample/serverMap', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap1', function(req, res, next) {
  res.render('./sample/serverMap1', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap2', function(req, res, next) {
  res.render('./sample/serverMap2', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatter01', function(req, res, next) {
  res.render('./sample/scatter01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatter02', function(req, res, next) {
  res.render('./sample/scatter02', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatter03', function(req, res, next) {
  res.render('./sample/scatter03', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatterTest01', function(req, res, next) {
  res.render('./sample/scatterTest01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/summary', function(req, res, next) {
  res.render('./sample/summary', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/sankey01', function(req, res, next) {
  res.render('./sample/sankey01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/sankey02', function(req, res, next) {
  res.render('./sample/sankey02', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/sankey03', function(req, res, next) {
  res.render('./sample/sankey03', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

// query Report
router.get('/restapi/selectJiraAccess', function(req, res, next) {
  console.log('sample/restapi/selectJiraAccess');
  var in_data = {};
  queryProvider.selectSingleQueryByID2("sample","selectJiraAccess", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
        console.log('test');
        console.log(out_data[0]);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

// query Report
router.get('/restapi/selectJiraAccReq', function(req, res, next) {
  console.log('sample/restapi/selectJiraAccReq');
  var in_data = {};
  queryProvider.selectSingleQueryByID2("sample","selectJiraAccReq", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
        console.log('test');
        console.log(out_data[0]);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

router.get('/restapi/test', function(req, res, next) {
  console.log('sample/restapi/test');
  var in_data = {};
  queryProvider.selectSingleQueryByID("sample","test", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });

});

  
module.exports = router;
