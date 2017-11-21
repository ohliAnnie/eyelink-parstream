var logger = global.log4js.getLogger('nodeTimeseries');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'open selected', reports:'', analysis:'', management:'', settings:''};

var indexAcc = global.config.es_index.es_jira;
var indexAppinfo = global.config.es_index.es_appinfo;
var indexElagent = global.config.es_index.es_elagent;
var indexMetric = global.config.es_index.es_metric;

var startTime = CONSTS.STARTTIME.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

router.get('/timeseriesLOG', function(req, res, next) {    
  var server = req.query.server, type = '';
  if(req.query.date == null){
    var date = '';
  } else {
    var date = req.query.date;
  }
  var in_data = {    index:  indexAppinfo, type: "applicationInfo", date : date };  
  queryProvider.selectSingleQueryByID2("timeseries","selectByIndex", in_data, function(err, out_data, params) {     
    var rtnCode = CONSTS.getErrData('0000');
    var check = {}, list = [], cnt = 0;        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      out_data.forEach(function(d){
        if(check[d._source.applicationId]==null){
          check[d._source.applicationId] = { no : cnt++};
          list.push({ id : d._source.collection, name : d._source.applicationId, type : d._source.collection });
          if(server == d._source.applicationId){
            type = d._source.collection;
          }          
        } 
      });       
    }    
    if(server == undefined || server == ""){
      server = list[0].name;
      type = list[0].type;
    }     
    res.render('./'+global.config.pcode+'/timeseries/timeseries_log', { title: global.config.productname, mainmenu:mainmenu, agent: list, server : server, type : req.query.server, date : in_data.date }); 
  });
});


router.get('/timeseriesAGENT', function(req, res, next) {      
  var server = req.query.server, type = '';
  if(req.query.date == null){
    var date = '';
  } else {
    var date = req.query.date;
  }
  var in_data = {    index:  indexAppinfo, type: "applicationInfo", date : date };  
  queryProvider.selectSingleQueryByID2("timeseries","selectByIndex", in_data, function(err, out_data, params) {     
    var rtnCode = CONSTS.getErrData('0000');
    var check = {}, list = [], cnt = 0;        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      out_data.forEach(function(d){
        if(check[d._source.applicationId]==null){
          check[d._source.applicationId] = { no : cnt++};
          list.push({ id : d._source.collection, name : d._source.applicationId, type : d._source.collection });
          if(server == d._source.applicationId){
            type = d._source.collection;
          }          
        } 
      });       
    }    
    if(server == undefined || server == ""){
      server = list[0].name;
      type = list[0].type
    }    
    res.render('./'+global.config.pcode+'/timeseries/timeseries_agent', { title: global.config.productname, mainmenu:mainmenu, agent: list, server : server, type : type, date : in_data.date }); 
  });
});

router.get('/restapi/getAccTimeseries', function(req, res, next) {
  logger.debug('timeseries/restapi/getAccTimeseries');  
  var end = Utils.getMs2Date(req.query.date,fmt1,'Y');  
  var start = Utils.getDate(end, fmt1, -1, 0, 0, 0);  
  var in_data = { index : [indexAcc+Utils.getDate(start, fmt4), indexAcc+Utils.getDate(end, fmt4)], type : "access",
                  gte : start+startTime, lte : end+startTime, interval : req.query.interval };
  queryProvider.selectSingleQueryByID3("timeseries","getAccTimeseries", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');  
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    } else {      
      var data = [];
      out_data = out_data.group_by_timestamp.buckets;
      out_data.forEach(function(b) {
        var d = b.group_by_code.buckets;        
        data.push({ timestamp : b.key, res_time : d.ok.group_by_time.buckets.res_time.doc_count, slow : d.ok.group_by_time.buckets.slow.doc_count, error : d.error.doc_count });         
      });
    }   
    res.json({rtnCode: rtnCode, rtnData: data });
  });
});

router.get('/restapi/getProcessTimeseries', function(req, res, next) {
  logger.debug('timeseries/restapi/getProcessTimeseries');    
  var end = Utils.getMs2Date(req.query.date,fmt1,'Y');  
  var start = Utils.getDate(end, fmt1, -1, 0, 0, 0); 
  var in_data = { index : [indexMetric+Utils.getDate(start, fmt4), indexMetric+Utils.getDate(end, fmt4)], 
                  type : "metricsets", gte : start+startTime, lte : end+startTime }  
  queryProvider.selectSingleQueryByID2("timeseries","getProcessTimeseries", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];       
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    } else {
      var data = [];
      out_data.forEach(function(d) {      
        data.push({ timestamp : new Date(d._source.timestamp).getTime(), cpu_total : d._source.system.process.cpu.total.pct, memory_rss : d._source.system.process.memory.rss.pct } );
      });  
    }
    res.json({rtnCode: rtnCode, rtnData: data });
  });
});

router.get('/restapi/getTopTimeseries', function(req, res, next) {
  logger.debug('timeseries/restapi/getTopTimeseries');    
  var end = Utils.getMs2Date(req.query.date,fmt1,'Y');  
  var start = Utils.getDate(end, fmt1, -1, 0, 0, 0); 
  var in_data = { index : [indexMetric+Utils.getDate(start, fmt4), indexMetric+Utils.getDate(end, fmt4)], 
                  type : "metricsets", gte : start+startTime, lte : end+startTime } 
  queryProvider.selectSingleQueryByID2("timeseries","getTopTimeseries", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];   
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    } else {
      var data = [];      
      var top = [0,0,0,0,0,0,0,0,0,0]
      var time = new Date().getTime();
      var cnt = 0;
      out_data.forEach(function(d) {          
        d._source.timestamp = new Date(d._source.timestamp).getTime();    
        if(time != d._source.timestamp){      
          if(time < d._source.timestamp) {
            data.push({ timestamp : time, top1 : top[0], top2 : top[1], top3 : top[2], top4 : top[3], top5 : top[4], top6 : top[5], top7 : top[6], top8 : top[7], top9 : top[8], top10 : top[9] });
          }
          time = d._source.timestamp;
          cnt = 0;
          top = [0,0,0,0,0,0,0,0,0,0];          
        } else {
          top[cnt++] = d._source.system.process.cpu.total.pct;
        }
      });
    }
    res.json({rtnCode: rtnCode, rtnData: data });
  });
});

router.get('/restapi/getTotalTimeseries', function(req, res, next) {
  logger.debug('timeseries/restapi/getTotalTimeseries');    
  var end = Utils.getMs2Date(req.query.date,fmt1,'Y');  
  var start = Utils.getDate(end, fmt1, -1, 0, 0, 0); 
  var in_data = { index : [indexMetric+Utils.getDate(start, fmt4), indexMetric+Utils.getDate(end, fmt4)], 
                  type : "metricsets", gte : start+startTime, lte : end+startTime }
  queryProvider.selectSingleQueryByID2("timeseries","getTotalTimeseries", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];   
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    } else {
      var data = [];
      var m_used = 0, m_actual_used = 0, m_swap_used = 0, c_user = 0, c_system = 0, c_idle = 0;
      out_data.forEach(function(d) {      
        if(d._source.metricset.name == "memory") {      
          m_used = d._source.system.memory.used.pct;
          m_actual_used = d._source.system.memory.actual.used.pct;
          m_swap_used = d._source.system.memory.swap.used.pct;
          data.push({ timestamp : new Date(d._source.timestamp).getTime(), memory_used : m_used, memory_actual_used : m_actual_used, memory_swap_used : m_swap_used, cpu_user : c_user, cpu_system : c_system, cpu_idle : c_idle } );
        } else if(d._source.metricset.name == "cpu") {
          c_user = d._source.system.cpu.user.pct;
          c_system = d._source.system.cpu.system.pct;
          c_idle = d._source.system.cpu.idle.pct;
          data.push({ timestamp : new Date(d._source.timestamp).getTime(), cpu_user : d._source.system.cpu.user.pct, cpu_system : d._source.system.cpu.system.pct, cpu_idle : d._source.system.cpu.idle.pct } );
        }
      });
    }
    res.json({rtnCode: rtnCode, rtnData: data });
  });
});

router.get('/restapi/getHeapData', function(req, res, next) {  
  logger.debug('timeseries/restapi/getHeapData');   
  if(req.query.type == 'range') {
    var gte = Utils.getDate(req.query.end, fmt2, 0, 0, -parseInt(req.query.gap), 0, 'N', 'Y');
    var lte = Utils.getDate(req.query.end, fmt2, 0, 0, parseInt(req.query.gap), 0, 'N', 'Y');
  } else if(req.query.type == 'normal') {  
    var lte = Utils.getMs2Date(req.query.date, fmt1, 'N')+startTime;      
    var gte = Utils.getDate(lte, fmt2, -1, 0, 0, 0, 'N', 'Y');
  }
  var in_data = { index : indexElagent+'*', type : "AgentStatJvmGc", gte : gte, lte : lte };
  queryProvider.selectSingleQueryByID2("timeseries","selectByTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    } else {
      var heap = [], perm = [];
      out_data.forEach(function(d) {    
        d = d._source;
        heap.push({ "timestamp" : new Date(Utils.getDateUTC2Local(d.timestamp,fmt2)).getTime(), "max" : d.heapMax, "used" : d.heapUsed });      
        perm.push({ "timestamp" : new Date(Utils.getDateUTC2Local(d.timestamp,fmt2)).getTime(), "max" : d.nonHeapMax, "used" : d.nonHeapUsed });      
      });
    }       
    res.json({ rtnCode: rtnCode, heap : heap, perm : perm });
  });
});

router.get('/restapi/getJvmSysData', function(req, res, next) {
  logger.debug('timeseries/restapi/getHeapData');    
  if(req.query.type == 'range') {    
    var gte = Utils.getDate(req.query.end, fmt2, 0, 0, -parseInt(req.query.gap), 0, 'N', 'Y');
    var lte = Utils.getDate(req.query.end, fmt2, 0, 0, parseInt(req.query.gap), 0, 'N', 'Y');
  } else if(req.query.type == 'normal') {  
    var lte = Utils.getMs2Date(req.query.date, fmt1, 'N')+startTime;      
    var gte = Utils.getDate(lte, fmt2, -1, 0, 0, 0, 'N', 'Y');
  }
  var in_data = { index : indexElagent+'*', type : "AgentStatCpuLoad",gte : gte, lte : lte };  
  queryProvider.selectSingleQueryByID2("timeseries","selectByTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    } else {
      var data = []
      out_data.forEach(function(d) {        
        d = d._source;        
        data.push({ "timestamp" : new Date(Utils.getDateUTC2Local(d.timestamp,fmt2)).getTime(), "jvm" : d.jvmCpuLoad*100, "system" : d.systemCpuLoad*100 });
      });
    }
    res.json({rtnCode: rtnCode, rtnData: data });
  });
});


router.get('/restapi/getStatTransaction', function(req, res, next) {
  logger.debug('timeseries/restapi/getStatTransaction');    
  if(req.query.type == 'range') {
    var gte = Utils.getDate(req.query.end, fmt2, 0, 0, -parseInt(req.query.gap), 0, 'N', 'Y');
    var lte = Utils.getDate(req.query.end, fmt2, 0, 0, parseInt(req.query.gap), 0, 'N', 'Y');
  } else if(req.query.type == 'normal') {  
    var lte = Utils.getMs2Date(req.query.date, fmt1, 'N')+startTime;      
    var gte = Utils.getDate(lte, fmt2, -1, 0, 0, 0, 'N', 'Y');
  }
  var in_data = { index : indexElagent+'*', type : "AgentStatTransaction", gte : gte, lte : lte };
  queryProvider.selectSingleQueryByID2("timeseries","selectByTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    } else {
      var data = [];        
      out_data.forEach(function(d) {
        d = d._source;    
        data.push({ "timestamp" :  new Date(Utils.getDateUTC2Local(d.timestamp,fmt2)).getTime(), "S.C" : d.sampledContinuationCount, "S.N" : d.sampledNewCount, "U.C" : d.unsampledContinuationCount, "U.N" : d.unsampledNewCount, "Total" : d.sampledContinuationCount+d.sampledNewCount+d.unsampledContinuationCount+d.unsampledNewCount });
      }); 
    }       
    res.json({rtnCode: rtnCode, rtnData: data });
  });
});

router.get('/restapi/getActiveTrace', function(req, res, next) {
  logger.debug('timeseries/restapi/getActiveTrace');    
  if(req.query.type == 'range') {
    var gte = Utils.getDate(req.query.end, fmt2, 0, 0, -parseInt(req.query.gap), 0, 'N', 'Y');
    var lte = Utils.getDate(req.query.end, fmt2, 0, 0, parseInt(req.query.gap), 0, 'N', 'Y');
  } else if(req.query.type == 'normal') {  
    var lte = Utils.getMs2Date(req.query.date, fmt1, 'N')+startTime;      
    var gte = Utils.getDate(lte, fmt2, -1, 0, 0, 0, 'N', 'Y');
  }
  var in_data = { index : indexElagent+'*', type : "AgentStatActiveTrace", gte : gte, lte : lte };
  queryProvider.selectSingleQueryByID2("timeseries","selectByTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    } else {
      var data = [];
      out_data.forEach(function(d) {        
        d = d._source;
        data.push({ "timestamp" : new Date(Utils.getDateUTC2Local(d.timestamp,fmt2)).getTime(), "Fast" : d.activeTraceCounts.FAST, "Normal" : d.activeTraceCounts.NORMAL, "Slow" : d.activeTraceCounts.SLOW, "Very Slow" : d.activeTraceCounts.VERY_SLOW});
      }); 

    }       
    res.json({rtnCode: rtnCode,  rtnData: data });
  });
});


module.exports = router;