var logger = global.log4js.getLogger('nodeReport');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'open selected', analysis:'', management:'', settings:''};

var indexCore = global.config.es_index.es_corecode;

var startTime = CONSTS.STARTTIME.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

/* GET reports page. */
router.get('/all', function(req, res, next) {
  res.render('./'+global.config.pcode+'/reports/report_all', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/main', function(req, res, next) {
  res.render('./'+global.config.pcode+'/reports/main', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/d3', function(req, res, next) {
  res.render('./'+global.config.pcode+'/reports/report_d3', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/power', function(req, res, next) {
  res.render('./'+global.config.pcode+'/reports/power', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/fault', function(req, res, next) {
  res.render('./'+global.config.pcode+'/reports/fault', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/d3', function(req, res, next) {
  res.render('./'+global.config.pcode+'/reports/d3', { title: 'Report_d3', mainmenu:mainmenu });
});

router.get('/live', function(req, res, next) {
  res.render('./'+global.config.pcode+'/reports/report_live', { title: global.config.productname, mainmenu:mainmenu });
});

// query Report
router.get('/restapi/getRangeData', function(req, res, next) {
  console.log('reports/restapi/getRangeData');    
  var gte = Utils.getDate(req.query.sdate, fmt1, -1, 0, 0, 0, 'Y', 'Y')+startTime;
  var lte = Utils.getMs2Date(req.query.edate, fmt1, 'N', 'Y')+startTime;    
/*  var index = [], cnt = 0;  
  for(i = new Date(gte).getTime(); i<=new Date(lte).getTime(); i=i+24*60*60*1000){    
    index[cnt++]  = indexCore+Utils.getMs2Date(i, fmt4);
  }  */
  var in_data = { index : indexCore+"*", type : "corecode",                   
                  sort : "event_time" , gte : gte, lte : lte };    
  queryProvider.selectSingleQueryByID2("reports","selectRangeData", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var data = [];
      out_data.forEach(function(d) {        
        d = d._source;       
        d.event_time = Utils.getDateUTC2Local(d.event_time, fmt2);      
        switch(d.event_type){
          case "1" :   // 피워
            d.index = 0;
            d.event_name = 'POWER';        
            break;
          case "17" :   // 조도
            d.index = 1;
            d.event_name = 'ALS';
            break;
          case "33" :     // 진동
            d.index = 2;
            d.event_name = 'VIBRATION';
            break;
          case "49" :    // 노이즈
            d.index = 3;
            d.event_name = 'NOISE';        
            break;
          case "65" :    // GPS
            d.index = 4;
            d.event_name = 'GPS';        
            break;
          case "81" :     // 센서상태
            d.index = 5;    
            d.event_name = 'STREET LIGHT';           
            break;
          case "97" : 
            d.index = 6;
            d.event_name = "DL";        
            break;
          case "153" :    // 재부팅
            d.index = 7;
            d.event_name = 'REBOOT';
            break;       
        }
        d.zone_id = 'ZONE-04';  
        data.push(d);
      });     
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});


// query Report
router.get('/restapi/getRangePowerData', function(req, res, next) {
  console.log('reports/restapi/getRangePowerData');      
  var gte = Utils.getDate(req.query.sdate, fmt1, -1, 0, 0, 0, 'Y', 'Y')+startTime;
  var lte = Utils.getMs2Date(req.query.edate, fmt1, 'N', 'Y')+startTime;    
/*  var index = [], cnt = 0;  
  for(i = new Date(gte).getTime(); i<=new Date(lte).getTime(); i=i+24*60*60*1000){    
    index[cnt++]  = indexCore+Utils.getMs2Date(i, fmt4);
  }  */
  /*var eType ={ 'POWER' : "1", 'ALS' : "17", 'VIBRATION' : "33", 'NOISE' : "49", 
               'GPS' : "65", 'STREET LIGHT' : "81", "DL" : "97", 'REBOOT' : "153" };*/
  var in_data = { index : indexCore+"*", type : "corecode",
                sort : "event_time" , gte : gte, lte : lte };      
  queryProvider.selectSingleQueryByID2("reports","selectRangePowerData", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var data = [];     
      out_data.forEach(function(d){
        d = d._source;       
        d.event_time = Utils.getDateUTC2Local(d.event_time, fmt2);  
        d.zone_id = 'ZONE-04'
        data.push(d);
      });      
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});


// query Report
router.get('/restapi/testData', function(req, res, next) {
  console.log('reports/restapi/testData');
  var in_data = {MERGE:'Y'};
  queryProvider.selectSingleQueryByID2("reports","testData", in_data, function(err, out_data, params) {
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
  queryProvider.selectSingleQueryByID2("reports","selectEventRawDataOld", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    console.log('reports/restapi/getTbRawDataByPeriod -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

// query RawData Power
router.get('/restapi/getTbRawDataByPeriodPower', function(req, res, next) {
  console.log(req.query);
   var in_data = {
      START_TIMESTAMP: req.query.startDate + ' 00:00:00',
      END_TIMESTAMP: req.query.endDate + ' 23:59:59',
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID2("reports","selectEventRawDataPower", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    console.log('reports/restapi/getTbRawDataByPeriodPower -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

// query RawData Power All
router.get('/restapi/getTbRawDataByAllPower', function(req, res, next) {
  console.log(req.query);
   var in_data = {
      START_TIMESTAMP: req.query.startDate + ' 00:00:00',
      END_TIMESTAMP: req.query.endDate + ' 23:59:59',
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID2("reports","selectEventRawDataPowerAll", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
    }

    console.log('reports/restapi/getTbRawDataByAllPower -> length : %s', out_data[0].length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });
});

module.exports = router;
