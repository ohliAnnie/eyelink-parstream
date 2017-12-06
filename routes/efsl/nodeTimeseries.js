var logger = global.log4js.getLogger('nodeTimeseries');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'open selected', reports:'', analysis:'', management:'', settings:''};

var indexCore = global.config.es_index.es_corecode;

var startTime = CONSTS.TIMEZONE.KOREA;
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
      var ampere = 0, active_power = 0, amount_of_active_power = 0;
      var als_level = 0, dimming_level = 0, noise_decibel = 0, noise_frequency = 0;
      var vibration_x = 0, vibration_y = 0, vibration_z = 0, vibration = 0;
      out_data.forEach(function(d) {        
        d = d._source;       
        d.event_time = Utils.getDateUTC2Local(d.event_time, fmt2);         
        if(d.event_type == "1"){
          ampere = d.ampere; 
          active_power = d.active_power; 
          amount_of_active_power = d.amount_of_active_power; }
          d.index = 0;
          d.event_name = 'POWER'; 
        if(d.event_type == "17"){
          als_level = d.als_level; 
          dimming_level = d.dimming_level;
          d.index = 1;
          d.event_name = 'ALS'; }
        if(d.event_type == "49"){ 
          noise_frequency = d.noise_frequency;
          noise_decibel = d.noise_frequency 
          d.index = 3;
          d.event_name = 'NOISE'; }
        if(d.event_type == "33"){
          vibration_x = d.vibration_x; 
          vibration_y = d.vibration_y; 
          vibration_z = d.vibration_z; 
          d.index = 2;         
          d.event_name = 'VIBRATION';
          vibration = (d.vibration_x + d.vibration_y + d.vibration_z) / 3; }
        d.event_time = new Date(d.event_time);
        d.ampere = ampere;
        d.active_power = active_power;
        d.amount_of_active_power = amount_of_active_power;
        d.als_level = als_level;
        d.dimming_level = dimming_level;
        d.noise_decibel = noise_decibel;
        d.noise_frequency = noise_frequency;
        d.vibration_x = vibration_x;
        d.vibration_y = vibration_y;
        d.vibration_z = vibration_z;
        d.vibration = vibration;      
        data.push(d);
      });     
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

module.exports = router;