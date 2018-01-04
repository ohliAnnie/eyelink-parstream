var logger = global.log4js.getLogger('nodeReport');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'open selected', analysis:'', management:'', settings:''};

var indexNotchingOee = global.config.es_index.notching_oee;
var indexStackingOee = global.config.es_index.stacking_oee;

var startTime = CONSTS.TIMEZONE.EFMM_START;
var endTime = CONSTS.TIMEZONE.EFMM_END;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

router.get('/', function(req, res, next) {    
  var index = [indexNotchingOee+"*", indexStackingOee+"*"];
  var in_data = { index : index, type : "oee"};  
  queryProvider.selectSingleQueryByID3("timeseries","selectMachineList", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {      
      var data = out_data.flag.buckets;
      var list = [], cnt = 0;
      for(i=0; i<data.length; i++) {
        var flag = data[i].key;
        var cid = data[i].cid.buckets;        
        for(j=0; j<cid.length; j++) {
          list[cnt++] = flag+'_'+cid[j].key;
        }        
      }            
    }
    res.render('./'+global.config.pcode+'/reports/report', { title: global.config.productname, mainmenu:mainmenu, list : list });
  });
});

router.get('/bar', function(req, res, next) {    
  var index = [indexNotchingOee+"*", indexStackingOee+"*"];
  var in_data = { index : index, type : "oee"};  
  queryProvider.selectSingleQueryByID3("timeseries","selectMachineList", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {      
      var data = out_data.flag.buckets;
      var list = [], cnt = 0;
      for(i=0; i<data.length; i++) {
        var flag = data[i].key;
        var cid = data[i].cid.buckets;        
        for(j=0; j<cid.length; j++) {
          list[cnt++] = flag+'_'+cid[j].key;
        }        
      }            
    }
    res.render('./'+global.config.pcode+'/reports/report_bar', { title: global.config.productname, mainmenu:mainmenu, list : list });
  });
});

router.get('/restapi/getRangeGapData', function(req, res, next) {
  console.log('reports/restapi/getRangeGapData');    
  var lte = Utils.getMs2Date(req.query.date, fmt1, 'Y', 'Y')+endTime;
  var gte = Utils.getDate(lte, fmt1, -7, 0, 0, 0, 'Y', 'Y')+startTime;  
  console.log(gte, lte)
  var index = (req.query.flag == 'notching')?indexNotchingOee:indexStackingOee;
  var indexList = Utils.getIndexList(gte, lte, index);  
  var from = gte, to = gte;
  var gap = 1*60*60*1000, list = [], qcnt = 0;
  for(i = new Date(gte).getTime()+gap; i<=new Date(lte).getTime()+gap; i=i+gap){        
    to = Utils.getMs2Date(i, fmt2, 'Y', 'Y');    
    list[qcnt++] = { from : from, to : to };
    from = to;
  }
  var range = { field : "dtTransmitted", ranges : list };
  var que = [];
  var in_data = { index : indexList, type : "oee", gte : gte, lte : lte, range : JSON.stringify(range), cid : req.query.cid };
  queryProvider.selectSingleQueryByID3("reports","selectTimeRange", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {         
      var outdata = out_data.cid.buckets;
      var que = [];
      for(i=0; i<outdata.length; i++){
        var key = [], cnt = 0; 
        for(j=0; j<outdata[i].range.buckets.length; j++){        
          if(outdata[i].range.buckets[j].date_max.value_as_string != null){
            key[cnt++] = outdata[i].range.buckets[j].date_max.value_as_string;
          }
        }
        que[i] = { bool : { 
          must : { term : { cid : outdata[i].key } },
          filter : { terms : { dtTransmitted : key } } } }; 
      }
      var term = { should : que };          
      var in_data = { index : indexList, type : "oee", term : JSON.stringify(term) };
      queryProvider.selectSingleQueryByID2("reports","selectDetailData", in_data, function(err, out_data, params) {        
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {                      
          var data = [], min = 65;
          for(i=0; i<out_data.length; i++){
            var d = out_data[i]._source.data[0];
            d.dtSensed = new Date(d.dtSensed).getTime();
            d.overall_oee *= 100;
            d.availability *= 100;
            d.performance *= 100;
            d.quality *= 100;
            if(min > d.overall_oee){
              min = d.overall_oee;
            }
            d.cid = out_data[i]._source.cid;
            data.push(d);
          }
        }        
        res.json({rtnCode: rtnCode, rtnData: data, min : min });
      });                      
    }
  });
});

router.get('/restapi/getToggleData', function(req, res, next) {
  console.log('reports/restapi/getToggleData');    
  var index = [(req.query.flag == 'notching')?indexNotchingOee:indexStackingOee];
  index[0] += Utils.getMs2Date(parseInt(req.query.date),fmt4, 'Y', 'Y');
  var gte = Utils.getMs2Date(parseInt(req.query.date),fmt1, 'Y', 'Y')+startTime;
  var lte = Utils.getMs2Date(parseInt(req.query.date),fmt1, 'Y', 'Y')+endTime
  var from = gte, to = gte;
  var gap = 10*60*1000, list = [], qcnt = 0;
  for(i = new Date(gte).getTime()+gap; i<=new Date(lte).getTime()+gap; i=i+gap){        
    to = Utils.getMs2Date(i, fmt2, 'Y', 'Y');    
    list[qcnt++] = { from : from, to : to };
    from = to;
  }
  var range = { field : "dtTransmitted", ranges : list };
  var que = [];
  var in_data = { index : index, type : "oee", gte : gte, lte : lte, range : JSON.stringify(range), cid : req.query.cid };
  queryProvider.selectSingleQueryByID3("reports","selectTimeRange", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {         
      var outdata = out_data.cid.buckets;
      var que = [];
      for(i=0; i<outdata.length; i++){
        var key = [], cnt = 0; 
        for(j=0; j<outdata[i].range.buckets.length; j++){        
          if(outdata[i].range.buckets[j].date_max.value_as_string != null){
            key[cnt++] = outdata[i].range.buckets[j].date_max.value_as_string;
          }
        }
        que[i] = { bool : { 
          must : { term : { cid : outdata[i].key } },
          filter : { terms : { dtTransmitted : key } } } }; 
      }
      var term = { should : que };          
      var in_data = { index : index, type : "oee", term : JSON.stringify(term) };
      queryProvider.selectSingleQueryByID2("reports","selectDetailData", in_data, function(err, out_data, params) {        
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {                      
          var data = [], min = 70, max = 100;
          for(i=0; i<out_data.length; i++){
            var d = out_data[i]._source.data[0];
            d.dtSensed = new Date(d.dtSensed).getTime();
            d.overall_oee *= 100;
            d.availability *= 100;
            d.performance *= 100;
            d.quality *= 100;
            if(min > d.overall_oee){
              min = d.overall_oee;
            }
            if(max < d.total_expected_unit){
              max = d.total_expected_unit;
            }
            d.cid = out_data[i]._source.cid;
            data.push(d);
          }
        }        
        res.json({rtnCode: rtnCode, rtnData: data, min : min, max : max });
      });                      
    }
  });
});

router.get('/restapi/getData', function(req, res, next) {
  console.log('reports/restapi/getData');    
  var index = (req.query.flag == 'notching')?indexNotchingOee:indexStackingOee;  
  var in_data = { index : index+Utils.getMs2Date(req.query.date,fmt4, 'Y', 'Y'), type : "oee", 
                  cid : req.query.cid };  
  queryProvider.selectSingleQueryByID2("reports","selectData", in_data, function(err, out_data, params) {        
    var rtnCode = CONSTS.getErrData('0000');    
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      var d = out_data[0]._source.data[0];      
      var not = d.operating_time*(d.total_pieces/d.operating_time)/d.ideal_run_rate;
      var factor = [
        {"key1":"Plant Operatin time", "pop1":d.total_shift_length, "key2":"", "pop2":0},
        {"key1":"Plant Production time", "pop1":d.planned_production_time, "key2" : "Planned Shut Down", "pop2":d.total_short_break+d.total_meal_break},
        {"key1":"Operating time", "pop1":d.operating_time, "key2" : "Down Time", "pop2":d.total_down_time},
        {"key1":"Net Operating time", "pop1":Math.round(not), "key2" : "Speed Loss", "pop2":Math.round(d.operating_time*(1-((d.total_pieces/d.operating_time)/d.ideal_run_rate)))},
        {"key1":"Fully Production time", "pop1": Math.round(not*d.total_accept_pieces/d.total_pieces), "key2" : "Quality Loss", "pop2": Math.round(not*d.total_reject_pieces/d.total_pieces)}, 
      ];
      var loss = (1-d.overall_oee)/(d.performance+d.quality+d.availability);
      var oee = [{ "name" : "OEE", "value" : d.overall_oee*100 },
                 { "name" : "Availability Loss", "value" : loss*d.availability*100 },
                 { "name" : "Performance Loss", "value" : loss*d.performance*100 },
                 { "name" : "Quality Loss", "value" : loss*d.quality*100 }];      
      var data = { factor : factor, oee : oee };      
    }
    res.json({rtnCode: rtnCode, rtnData: data });
  });  
});

module.exports = router;

