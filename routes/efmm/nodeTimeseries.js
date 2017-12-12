var logger = global.log4js.getLogger('nodeTimeseries');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
require('date-utils');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'open selected', reports:'', analysis:'', management:'', settings:''};

var indexNotchingOee = global.config.es_index.notching_oee;
var indexStackingOee = global.config.es_index.stacking_oee;

var startTime = CONSTS.TIMEZONE.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

router.get('/', function(req, res, next) {
  // console.log(_rawDataByDay);
  var outdata = { title: global.config.productname, mainmenu : mainmenu };
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
      outdata.list = list;
      if(list.length != 0){
        outdata.match = { chart01 : list[0%list.length], chart02 : list[1%list.length], chart03 : list[2%list.length], chart04 : list[3%list.length] };
      }      
      console.log(outdata.match)
    }
    logger.info('mainmenu : %s, outdata : %s', mainmenu.timeseries, JSON.stringify(outdata));     
    res.render(global.config.pcode + '/timeseries/timeseries', outdata);
  });
});

router.get('/restapi/getTimeseries', function(req, res, next) {
  console.log('timeseries/restapi/getTimeseries');
  var gte = Utils.getMs2Date(req.query.start, fmt2, 'Y', 'Y');
  var lte = Utils.getDate(gte, fmt2, 0, 0, parseInt(req.query.gap), 0, 'Y', 'Y');
  console.log(gte, lte)
  var today = Utils.getMs2Date(req.query.start, fmt4, 'Y', 'Y');    
  var in_data = { index : indexNotchingOee+today, type : "oee", gte : gte, lte : lte};    
  queryProvider.selectSingleQueryByID2("timeseries","selectTimeseriesData", in_data, function(err, out_data, params) {                
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {                          
      var notching = {};
      for(i=0; i<out_data.length; i++){
        var d = out_data[i]._source.data[0];
        d.dtSensed = new Date(d.dtSensed).getTime();
        if(notching[out_data[i]._source.cid] == null){
          notching[out_data[i]._source.cid] = [];
        }
        notching[out_data[i]._source.cid][notching[out_data[i]._source.cid].length] = d;
      }      
    }
    in_data.index = indexStackingOee+today;
    queryProvider.selectSingleQueryByID2("timeseries","selectTimeseriesData", in_data, function(err, out_data, params) {
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data == null) {
        rtnCode = CONSTS.getErrData('0001');
      } else {                              
        var stacking = {};
        for(i=0; i<out_data.length; i++){
          var d = out_data[i]._source.data[0];
          d.dtSensed = new Date(d.dtSensed).getTime();
          if(stacking[out_data[i]._source.cid] == null){
            stacking[out_data[i]._source.cid] = [];          
          }
          stacking[out_data[i]._source.cid][stacking[out_data[i]._source.cid].length] = d;
        }              
      }
      var data = { notching : notching, stacking : stacking };             
      res.json({rtnCode: rtnCode, rtnData: data});
    });        
  });
});

router.get('/restapi/getGapTimeseries', function(req, res, next) {
  console.log('timeseries/restapi/getGapTimeseries');  
  var gte = Utils.getMs2Date(req.query.start, fmt2, 'Y', 'Y');
  var lte = Utils.getDate(gte, fmt2, 0, 0, parseInt(req.query.gap), 0, 'Y', 'Y');  
  var from = gte, to = gte;
  if(req.query.gap === '30'||req.query.gap === '60') {
   var gap = 60*1000; 
  } else if(req.query.gap === '360'||req.query.gap === '720'||req.query.gap === '1440') {
    var gap = 60*60*1000; 
  } else {
    var gap = 6*60*60*1000; 
  }
  var list = [], qcnt = 0;
  for(i = new Date(gte).getTime()+gap; i<=new Date(lte).getTime(); i=i+gap){     
    to = Utils.getMs2Date(i, fmt2, 'Y', 'Y');
    list[qcnt++] = { from : from, to : to };
    from = to;
  }
  var range = { field : "dtTransmitted", ranges : list };
  var today = Utils.getMs2Date(req.query.start, fmt4, 'Y', 'Y');    
  var yday = Utils.getDate(gte, fmt4, 0, 0, parseInt(req.query.gap), 0, 'Y', 'Y');
  var indexNotch = indexList(gte, lte, indexNotchingOee);
  var indexStack = indexList(gte, lte, indexStackingOee);
  var in_data = { index : indexNotch, type : "oee", gte : gte, lte : lte, range : JSON.stringify(range) };    
  queryProvider.selectSingleQueryByID3("timeseries","selectTimeRange", in_data, function(err, out_data, params) {    
    var notch = out_data.cid.buckets;      
    var que = [];
    for(i=0; i<notch.length; i++){
      var key = [], cnt = 0; 
      for(j=0; j<notch[i].range.buckets.length; j++){        
        if(notch[i].range.buckets[j].date_max.value_as_string != null){
          key[cnt++] = notch[i].range.buckets[j].date_max.value_as_string;
        }
      }
      que[i] = { bool : { 
        must : { term : { cid : notch[i].key } },
        filter : { terms : { dtTransmitted : key } } } }; 
    }
    var nque = { should : que };    
    in_data.index = indexStack;
    queryProvider.selectSingleQueryByID3("timeseries","selectTimeRange", in_data, function(err, out_data, params) {
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data == null) {
        rtnCode = CONSTS.getErrData('0001');
      } else {                              
        var stack = out_data.cid.buckets;
        var que = [];
        for(i=0; i<stack.length; i++){
          var key = [], cnt = 0;
          for(j=0; j<stack[i].range.buckets.length; j++){                  
            if(stack[i].range.buckets[j].date_max.value_as_string != null){              
              key[cnt++] = stack[i].range.buckets[j].date_max.value_as_string;
            }
          }           
          que[i] = { bool : { 
            must : { term : { cid : stack[i].key } },
            filter : { terms : { dtTransmitted : key } } } };         
        }        
        var sque = { should : que };       
      }      
      in_data = { index : indexNotch, type : "oee", term : JSON.stringify(sque) };
      queryProvider.selectSingleQueryByID2("timeseries","selectDetailData", in_data, function(err, out_data, params) {           
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {                         
          var notching = {};
          for(i=0; i<out_data.length; i++){
            var d = out_data[i]._source.data[0];
            d.dtSensed = new Date(d.dtSensed).getTime();
            d.overall_oee *= 100;
            d.availability *= 100;
            d.performance *= 100;
            d.quality *= 100;
            if(notching[out_data[i]._source.cid] == null){
              notching[out_data[i]._source.cid] = [];
            }
            notching[out_data[i]._source.cid][notching[out_data[i]._source.cid].length] = d;
          }      
        }
        in_data = { index : indexStack, type : "oee", term : JSON.stringify(sque) };
        queryProvider.selectSingleQueryByID2("timeseries","selectDetailData", in_data, function(err, out_data, params) {
          var rtnCode = CONSTS.getErrData('0000');
          if (out_data == null) {
            rtnCode = CONSTS.getErrData('0001');
          } else {                      
            var stacking = {};            
            for(i=0; i<out_data.length; i++){
              var d = out_data[i]._source.data[0];
              d.dtSensed = new Date(d.dtSensed).getTime();
              d.overall_oee *= 100;
              d.availability *= 100;
              d.performance *= 100;
              d.quality *= 100;
              if(stacking[out_data[i]._source.cid] == null){
                stacking[out_data[i]._source.cid] = [];          
              }
              stacking[out_data[i]._source.cid][stacking[out_data[i]._source.cid].length] = d;
            }
          }
          var data = { notching : notching, stacking : stacking };                    
          res.json({rtnCode: rtnCode, rtnData: data});
        });                
      });      
    });        
  });
});

function indexList(start, end, index) {  
  var list = [], lcnt = 0;  
  start = new Date(start).getTime()
  end = new Date(end).getTime()
  for(i=start; i<= end; i+=24*60*60*1000){   
    list[lcnt++] = index+Utils.getMs2Date(i, fmt4, 'Y', 'Y');
  }
  return list;
}


module.exports = router;