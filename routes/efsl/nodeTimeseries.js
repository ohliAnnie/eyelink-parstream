var logger = global.log4js.getLogger('nodeTimeseries');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'open selected', reports:'', analysis:'', management:'', settings:''};

var indexCore = global.config.es_index.es_corecode;

var startTime = CONSTS.STARTTIME.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",

router.get('/timeseries', function(req, res, next) {
  // console.log(_rawDataByDay);
  res.render('./'+global.config.pcode+'/timeseries/timeseries', { title: global.config.productname, mainmenu:mainmenu });
});

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
  queryProvider.selectSingleQueryByID2("timeseries","selectRangeData", in_data, function(err, out_data, params) {
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
            d.vibration = (d.vibration_x + d.vibration_y + d.vibration_z) / 3;
            d.event_name = 'VIBRATION';
            break;
          case "49" :    // 노이즈
            d.index = 3;
            d.event_name = 'NOISE';        
            break;
        }
        data.push(d);
      });     
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

module.exports = router;