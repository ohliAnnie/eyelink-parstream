var logger = global.log4js.getLogger('nodeDashboard');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
require('date-utils');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'open selected', timeseries:'', reports:'', analysis:'', management:'', settings:''};

var indexCore = global.config.es_index.es_corecode;

var startTime = CONSTS.TIMEZONE.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

/* GET reports page. */
router.get('/', function(req, res, next) {  
  res.render('./'+global.config.pcode+'/dashboard/dashboard', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/restapi/getDashboardRawData', function(req, res, next) {
  console.log('reports/restapi/getDashboardRawData');    
  var lte = Utils.getToday(fmt1, 'Y', 'Y');  
  var gte = Utils.getDate(lte, fmt1, -7, 0, 0, 0, 'Y', 'Y');  
  var in_data = { index : indexCore+"*", type : "corecode",                   
                  sort : "event_time" , gte : gte+startTime, lte : lte+startTime };    
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardRawData", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var data = [];
      out_data.forEach(function(d) {
        d = d._source;       
        d.event_time = Utils.getDateUTC2Local(d.event_time, fmt2);      
        d.geo = (d.node_id === '0001.00000001') ? '37.457271, 127.042861':'37.468271, 127.032861';
        d.vibration = (d.vibration_x+d.vibration_y+d.vibration_z)/3;
        d.zone_id = 'ZONE-04';  
        data.push(d);
      });     
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

router.get('/restapi/countDayEvent', function(req, res, next) {
  logger.debug('dashboard/restapi/countEvent');        
  var end = Utils.getMs2Date(parseInt(req.query.date),fmt1,'Y')+startTime;  
  var start = Utils.getDate(end, fmt1, -1, 0, 0, 0, 'Y')+startTime;    
  var in_data = { index : indexCore+'*', type : "corecode", START : start, END : end  };    
  queryProvider.selectSingleQueryCount("dashboard","countEvent", in_data, function(err, out_data, params) {    
    var today = out_data;
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {      
      end = start;
      start = Utils.getDate(end, fmt1, -1, 0, 0, 0, 'Y')+startTime;        
      var in_data = { index : indexCore+'*', type : "corecode", START : start, END : end  };        
      queryProvider.selectSingleQueryCount("dashboard","countEvent", in_data, function(err, out_data, params) {      
        var yday = out_data;        
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        }    
        res.json({rtnCode: rtnCode, today : today, yday : yday });
      });
    }    
    res.json({rtnCode: rtnCode, today : today, yday : yday });
  });
});

router.get('/restapi/countMonEvent', function(req, res, next) {
  logger.debug('dashboard/restapi/countEvent');      
  var end = Utils.getMs2Date(parseInt(req.query.date),fmt1,'Y')+startTime;  
  var start = Utils.getDate(end, fmt1, -(new Date(parseInt(req.query.date)).getDate()), 0, 0, 0, 'Y')+startTime;    

  var in_data = { index : indexCore+'*', type : "corecode", START : start, END : end  };  
  queryProvider.selectSingleQueryCount("dashboard","countEvent", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    var tmon = out_data;
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {      
      console.log(start, end)
      end = start;            
      start = Utils.getDate(end, fmt1, -new Date(new Date(end).getTime()-1).getDate(), 0, 0, 0, 'Y')+startTime;
      console.log(start, end)
      var in_data = { index : indexCore+'*', type : "corecode", START : start, END : end  };  
      queryProvider.selectSingleQueryCount("dashboard","countEvent", in_data, function(err, out_data, params) {
        var ymon = out_data;
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        }    
        res.json({rtnCode: rtnCode,tmon : tmon, ymon : ymon });
      });
    }
    res.json({rtnCode: rtnCode, tmon : tmon, ymon : ymon });
  });
});

router.get('/restapi/countFaultEvent', function(req, res, next) {
  logger.debug('dashboard/restapi/countFaultEvent');  
  var end = Utils.getMs2Date(parseInt(req.query.date),fmt1,'Y')+startTime;  
  var start = Utils.getDate(end, fmt1, -1, 0, 0, 0)+startTime;        
  var in_data = { index : indexCore+'*', type : "corecode", start : start, end : end  };  
  queryProvider.selectSingleQueryCount("dashboard","countFaultEvent", in_data, function(err, out_data, params) {
    var today = out_data;
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      end = start;
      start = Utils.getDate(end, fmt1, -1, 0, 0, 0, 'Y')+startTime;
      var in_data = { index : indexCore+'*', type : "corecode", start : start, end : end  };  
      queryProvider.selectSingleQueryCount("dashboard","countFaultEvent", in_data, function(err, out_data, params) {
        var yday = out_data;        
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        }
        res.json({rtnCode: rtnCode, today : today, yday : yday });
      });
    }
    res.json({rtnCode: rtnCode, today : today, yday : yday });
  });
});

router.post('/restapi/sumActivePower', function(req, res, next) {
  logger.debug('dashboard/restapi/sumActivePower');        
  var end = Utils.getToday(fmt1, 'Y', 'Y')+startTime;    
  var start = Utils.getDate(end, fmt1, -1, 0, 0, 0, 'Y')+startTime;        
  var in_data = { index : indexCore+'*', type : "corecode", start : start , end : end };      
  queryProvider.selectSingleQueryByID3("dashboard","sumActivePower", in_data, function(err, out_data, params) {    
    var today = out_data;    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      end = start;
      start = Utils.getDate(end, fmt1, -1, 0, 0, 0, 'Y')+startTime;
      var in_data = { index : indexCore+'*', type : "corecode", start : start, end : end };        
      queryProvider.selectSingleQueryByID3("dashboard","sumActivePower", in_data, function(err, out_data, params) {
        var yday = out_data;                
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        }
        res.json({rtnCode: rtnCode, today : today.active_power.value, yday : yday.active_power.value });
      });
    }
    res.json({rtnCode: rtnCode, today : today, yday : yday });
  });
});

module.exports = router;