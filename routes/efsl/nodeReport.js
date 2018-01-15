var logger = global.log4js.getLogger('nodeReport');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'open selected', analysis:'', management:'', settings:''};

var indexCore = global.config.es_index.es_corecode;

var startTime = CONSTS.TIMEZONE.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

/* GET reports page. */
router.get('/all', function(req, res, next) {
  res.render('./'+global.config.pcode+'/reports/report_all', { title: global.config.productname, mainmenu:mainmenu });
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
  logger.info('reports/restapi/getRangeData');    
  var gte = Utils.getDate(req.query.sdate, fmt1, -1, 0, 0, 0, 'Y', 'Y')+startTime;
  var lte = Utils.getMs2Date(req.query.edate, fmt1, 'N', 'Y')+startTime; 
  var index = Utils.getIndexList(gte, lte, indexCore);  
  var in_data = { index : index, type : "corecode",                   
                  sort : "event_time" , gte : gte, lte : lte };    
  queryProvider.selectSingleQueryByID2("reports","selectRangeData", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var data = [];      
      for(i=0; i<out_data.length; i++) {        
        var d = out_data[i]._source;       
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
            d.vibration = (d.vibration_x + d.vibration_y + d.vibration_z) / 3;
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
        d.geo = (d.node_id === '0001.00000001') ? '37.457271, 127.042861':'37.468271, 127.032861';
        data.push(d);
      };     
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

// query Report
router.get('/restapi/getRangePowerData', function(req, res, next) {
  logger.info('reports/restapi/getRangePowerData');      
  var gte = Utils.getDate(req.query.sdate, fmt1, -1, 0, 0, 0, 'Y', 'Y')+startTime;
  var lte = Utils.getMs2Date(req.query.edate, fmt1, 'N', 'Y')+startTime;    
  var index = Utils.getIndexList(gte, lte, indexCore);  
  var in_data = { index : index, type : "corecode",
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
        d.geo = (d.node_id === '0001.00000001') ? '37.457271, 127.042861':'37.468271, 127.032861';
        var id = d.node_id.split('.')
        d.zone_id = 'ZONE-'+id[0];
        data.push(d);
      });            
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

module.exports = router;
