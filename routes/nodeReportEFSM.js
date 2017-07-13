var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'open selected', analysis:'', management:'', settings:''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./reports/report_allEFSM', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/main', function(req, res, next) {
  res.render('./reports/main', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/Res&Req', function(req, res, next) {
  res.render('./reports/Res&Req', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/process', function(req, res, next) {
  res.render('./reports/process', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/cpu_memory', function(req, res, next) {
  res.render('./reports/cpu_memory', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/error', function(req, res, next) {
  res.render('./reports/error', { title: global.config.productnam, mainmenu:mainmenu });
});

router.get('/all', function(req, res, next) {
  res.render('./reports/report_allEFSM', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/test', function(req, res, next) {
  res.render('./reports/test', { title: global.config.productname, mainmenu:mainmenu });
});


// query Report
router.get('/restapi/getJiraAcc', function(req, res, next) {
  console.log('reports/restapi/getJiraAcc');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectJiraAcc", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getCpuMemoryFilesystemAll', function(req, res, next) {
  console.log('reports/restapi/getCpuMemoryFilesystemAll');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectCpuMemoryFilesystemAll", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getProcessList', function(req, res, next) {
  console.log('reports/restapi/getProcessList');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectProcessList", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getProcessListByName', function(req, res, next) {
  console.log('reports/restapi/getProcessListByName');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte,
    name : req.query.name
  };
  queryProvider.selectSingleQueryByID2("reports","selectProcessListByName", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getProcess', function(req, res, next) {
  console.log('reports/restapi/getProcess');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectProcess", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getProcessByName', function(req, res, next) {
  console.log('reports/restapi/getProcessByName');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte,
    name : req.query.name
  };
  queryProvider.selectSingleQueryByID2("reports","selectProcessByName", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});


// query Report
router.get('/restapi/getAccessError', function(req, res, next) {
  console.log('reports/restapi/getAccessError');
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("reports","selectAccessError", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }           
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});


// query Report
router.get('/restapi/getDay1sCount', function(req, res, next) {
  console.log('reports/restapi/getDay1sCount');
  var in_data = {    index : req.query.index      };
  queryProvider.selectSingleQueryCount ("reports","selectDay1sCount", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }           
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getDay3sCount', function(req, res, next) {
  console.log('reports/restapi/getDay3sCount');
  var in_data = {    index : req.query.index      };
  queryProvider.selectSingleQueryCount ("reports","selectDayErrorCount", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }           
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getDay5sCount', function(req, res, next) {
  console.log('reports/restapi/getDay5sCount');
  var in_data = {    index : req.query.index      };
  queryProvider.selectSingleQueryCount ("reports","selectDay5sCount", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }           
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getDaySlowCount', function(req, res, next) {
  console.log('reports/restapi/getDaySlowCount');
  var in_data = {    index : req.query.index      };
  queryProvider.selectSingleQueryCount ("reports","selectDaySlowCount", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }           
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/getDayErrorCount', function(req, res, next) {
  console.log('reports/restapi/getDayErrorCount');
  var in_data = {    index : req.query.index      };
  queryProvider.selectSingleQueryCount ("reports","selectDayErrorCount", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }           
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

module.exports = router;
