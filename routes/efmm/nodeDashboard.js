var logger = global.log4js.getLogger('nodeDashboard');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
require('date-utils');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'open selected', timeseries:'', reports:'', analysis:'', management:'', settings:''};

var indexNotchingOee = global.config.es_index.notching_oee;
var indexStackingOee = global.config.es_index.stacking_oee;
var indexStackingStatus = global.config.es_index.stacking_status;

var startTime = CONSTS.TIMEZONE.EFMM_START;
var endTime = CONSTS.TIMEZONE.EFMM_END;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",

/* GET reports page. */
router.get('/', function(req, res, next) {
  // console.log(_rawDataByDay);
  var outdata = {
    title: global.config.productname,
    mainmenu : mainmenu
  }

  logger.info('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));  
  res.render(global.config.pcode + '/dashboard/dashboard', outdata);
});

router.get('/detail', function(req, res, next) {
   console.log('/dashboard/detail');  
  var outdata = {
    title: global.config.productname,
    mainmenu : mainmenu
  }
  logger.info('mainmenu : %s, outdata : %s' , mainmenu.dashboard, JSON.stringify(outdata));  
  res.render(global.config.pcode + '/dashboard/dashboard_detail', outdata);
});

router.get('/info', function(req, res, next) {
   console.log('/dashboard/info');  
  var outdata = { title: global.config.productname, mainmenu : mainmenu }
  logger.info('mainmenu : %s, outdata : %s' , mainmenu.dashboard, JSON.stringify(outdata));  
  res.render(global.config.pcode + '/dashboard/dashboard_info', outdata);
});

router.get('/restapi/getDashboardWeekly', function(req, res, next) {
  console.log('reports/restapi/getDashboardWeekly');    
  var lte = [], gte = [], indexNotch = [], indexStack = [], cnt = 0;  
  var now = Utils.getMs2Date(parseInt(req.query.now), fmt2, 'Y', 'Y');
  for(i = new Date(now).getTime()-6*24*60*60*1000; i<=new Date(now).getTime(); i=i+24*60*60*1000){    
    indexNotch[cnt]  = indexNotchingOee+Utils.getMs2Date(i, fmt4);
    indexStack[cnt]  = indexStackingOee+Utils.getMs2Date(i, fmt4);
    lte[cnt] = Utils.getMs2Date(i, fmt1, 'Y', 'Y')+endTime;
    gte[cnt++] = Utils.getMs2Date(i, fmt1, 'Y', 'Y')+startTime;
  }
  lte[--cnt] = now;
  var in_data = { index : indexNotch, type : "oee",                   
                  gte0 : gte[0], lte0 : lte[0],
                  gte1 : gte[1], lte1 : lte[1],
                  gte2 : gte[2], lte2 : lte[2],
                  gte3 : gte[3], lte3 : lte[3],
                  gte4 : gte[4], lte4 : lte[4],
                  gte5 : gte[5], lte5 : lte[5],
                  gte6 : gte[6], lte6 : lte[6] };  
  queryProvider.selectSingleQueryByID3("dashboard","selectDashboardLastDate", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {          
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
      queryProvider.selectSingleQueryByID3("dashboard","selectDashboardLastDate", in_data, function(err, out_data, params) {        
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
          in_data = { index : indexNotch, type : "oee", term : JSON.stringify(nque) };            
          queryProvider.selectSingleQueryByID2("dashboard","selectDashboardTermData", in_data, function(err, out_data, params) {                
            var rtnCode = CONSTS.getErrData('0000');
            if (out_data == null) {
              rtnCode = CONSTS.getErrData('0001');
            } else {                  
              var ndata = {};              
              for(i=0; i<out_data.length; i++){               
                var d = out_data[i]._source.data[0];
                d.date = Utils.getDate(d.dtSensed, fmt1, 0, 0, 0, 0, 'Y');
                d.timestamp = Utils.getDate(d.dtSensed, fmt2, 0, 0, 0, 0, 'Y')
                if(ndata[d.date]==null){
                  ndata[d.date] = { accept_pieces : 0, down_time : 0, ideal_run_rate : 0, meal_break : 0, operating_time : 0,
                                    planned_production_time : 0, reject_pieces : 0, shift_length : 0, short_break : 0,
                                    total_accept_pieces : 0, total_down_time : 0, total_expected_unit : 0, total_meal_break : 0, 
                                    total_pieces : 0, total_reject_pieces : 0, total_shift_length : 0, total_short_break : 0 };
                }                               
                for(key in ndata[d.date]) {
                  if(key == 'ideal_run_rate'){
                    ndata[d.date][key] = d[key];
                  } else {
                    ndata[d.date][key] += d[key];                      
                  }
                }
              }                            
              in_data = { index : indexStack, type : "oee", term : JSON.stringify(sque) };
              queryProvider.selectSingleQueryByID2("dashboard","selectDashboardTermData", in_data, function(err, out_data, params) {
                var rtnCode = CONSTS.getErrData('0000');
                if (out_data == null) {
                  rtnCode = CONSTS.getErrData('0001');
                } else {                      
                  var sdata = {}, days = [], cnt = 0;
                  for(i=0; i<out_data.length; i++){                    
                    var d = out_data[i]._source.data[0];                                      
                    d.date = Utils.getDate(d.dtSensed, fmt1, 0, 0, 0, 0, 'Y');
                    d.timestamp = Utils.getDate(d.dtSensed, fmt2, 0, 0, 0, 0, 'Y')            
                    if(sdata[d.date]==null){
                      days[cnt++] = d.date;
                      sdata[d.date] = { accept_pieces : 0, down_time : 0, ideal_run_rate : 0, meal_break : 0, operating_time : 0,
                                        planned_production_time : 0, reject_pieces : 0, shift_length : 0, short_break : 0,
                                        total_accept_pieces : 0, total_down_time : 0, total_expected_unit : 0, total_meal_break : 0, 
                                        total_pieces : 0, total_reject_pieces : 0, total_shift_length : 0, total_short_break : 0 };
                    }
                    for(key in sdata[d.date]) {                      
                      if(key == 'ideal_run_rate'){
                        sdata[d.date][key] = d[key];
                      } else {
                        sdata[d.date][key] += d[key];                      
                      }
                    }                                        
                  }
                  var total = [], week = [], cnt = 0, last = '';
                  var now = Utils.getMs2Date(parseInt(req.query.now), fmt1, 'Y', 'Y');                                    
                  for(key1 in sdata) {                    
                    var tot = {}, value = {};
                    for(key2 in sdata[key1]) {
                      if(key2 == 'ideal_run_rate'){
                        tot[key2] = (sdata[key1][key2] > ndata[key1][key2])?sdata[key1][key2] : ndata[key1][key2];
                      } else {
                        tot[key2] = sdata[key1][key2] + ndata[key1][key2];
                      }
                    }
                    sdata[key1].availability = sdata[key1].operating_time/sdata[key1].planned_production_time;
                    sdata[key1].performance = sdata[key1].total_pieces/sdata[key1].operating_time/sdata[key1].ideal_run_rate;
                    sdata[key1].quality = sdata[key1].total_accept_pieces/sdata[key1].total_pieces;
                    sdata[key1].overall_oee = sdata[key1].availability*sdata[key1].performance*sdata[key1].quality;
                    ndata[key1].availability = ndata[key1].operating_time/ndata[key1].planned_production_time;
                    ndata[key1].performance = (ndata[key1].total_pieces/ndata[key1].operating_time)/ndata[key1].ideal_run_rate;
                    ndata[key1].quality = ndata[key1].total_accept_pieces/ndata[key1].total_pieces;
                    ndata[key1].overall_oee = ndata[key1].availability*ndata[key1].performance*ndata[key1].quality;
                    value.availability = tot.operating_time/tot.planned_production_time;
                    value.performance = (tot.total_pieces/tot.operating_time)/tot.ideal_run_rate;
                    value.quality = tot.total_accept_pieces/tot.total_pieces;
                    value.overall_oee = value.availability*value.performance*value.quality;
                    var k = key1.split('-');
                    value.date = k[1]+'-'+k[2];
                    total.push(value);
                    week[cnt++] = k[1]+'-'+k[2];
                    last = key1;
                  }                                    
                  var data = { stacking : sdata[key1], notching : ndata[key1], total : total, week : week };
                  console.log(data);
                }
                res.json({rtnCode: rtnCode, rtnData: data});
              });
            }         
          });
        }     
      });
    }    
  });
});

router.get('/restapi/getDashboardDetail', function(req, res, next) {
  console.log('reports/restapi/getDashboardDetail');    
  var lte = [], gte = [], indexNotch = [], indexStack = [], cnt = 0;  
  var now = Utils.getMs2Date(parseInt(req.query.date), fmt2, 'Y', 'Y');
  var gte = Utils.getMs2Date(parseInt(req.query.date), fmt1, 'Y', 'Y')+startTime;
  var today = Utils.getMs2Date(parseInt(req.query.date), fmt4, 'Y', 'Y');  
  var indexNotch = indexNotchingOee+today;
  var indexStack = indexStackingOee+today;
  var in_data = { index : indexNotch, type : "oee", gte : gte, lte : now };  
  queryProvider.selectSingleQueryByID3("dashboard","selectDashboardLastTime", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {          
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
      queryProvider.selectSingleQueryByID3("dashboard","selectDashboardLastTime", in_data, function(err, out_data, params) {        
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
          in_data = { index : indexNotch, type : "oee", term : JSON.stringify(nque) };            
          queryProvider.selectSingleQueryByID2("dashboard","selectDashboardDetailData", in_data, function(err, out_data, params) {                
            var rtnCode = CONSTS.getErrData('0000');
            if (out_data == null) {
              rtnCode = CONSTS.getErrData('0001');
            } else {                  
              var ndata = { accept_pieces : 0, down_time : 0, ideal_run_rate : 0, meal_break : 0, operating_time : 0,
                            planned_production_time : 0, reject_pieces : 0, shift_length : 0, short_break : 0,
                            total_accept_pieces : 0, total_down_time : 0, total_expected_unit : 0, total_meal_break : 0, 
                            total_pieces : 0, total_reject_pieces : 0, total_shift_length : 0, total_short_break : 0 };
              var notch = [];
              for(i=0; i<out_data.length; i++){               
                var d = out_data[i]._source.data[0];                
                d.cid = out_data[i]._source.cid;
                d.dtSensed = Utils.getDateUTC2Local(d.dtSensed, fmt2);                
                for(key in ndata) {
                  if(key == 'ideal_run_rate'){
                    ndata[key] = d[key];
                  } else {
                    ndata[key] += d[key];                      
                  }
                }
                notch.push(d);
              }              
              in_data = { index : indexStack, type : "oee", term : JSON.stringify(sque) };
              queryProvider.selectSingleQueryByID2("dashboard","selectDashboardDetailData", in_data, function(err, out_data, params) {
                var rtnCode = CONSTS.getErrData('0000');
                if (out_data == null) {
                  rtnCode = CONSTS.getErrData('0001');
                } else {                      
                  var sdata = { accept_pieces : 0, down_time : 0, ideal_run_rate : 0, meal_break : 0, operating_time : 0,
                                planned_production_time : 0, reject_pieces : 0, shift_length : 0, short_break : 0,
                                total_accept_pieces : 0, total_down_time : 0, total_expected_unit : 0, total_meal_break : 0, 
                                total_pieces : 0, total_reject_pieces : 0, total_shift_length : 0, total_short_break : 0 };
                  var stack = [];
                  for(i=0; i<out_data.length; i++){                    
                    var d = out_data[i]._source.data[0];
                    d.cid = out_data[i]._source.cid;
                    d.dtSensed = Utils.getDateUTC2Local(d.dtSensed, fmt2);
                    for(key in sdata) {                      
                      if(key == 'ideal_run_rate'){
                        sdata[key] = d[key];
                      } else {
                        sdata[key] += d[key];                      
                      }
                    }
                    stack.push(d);
                  }                  
                  var stacking = {}, notching = {};
                  stacking.dtSensed = today, notching.dtSensed = today;
                  stacking.cid = 'Stacking', notching.cid = 'Notching';
                  stacking.availability = sdata.operating_time/sdata.planned_production_time;
                  stacking.performance = sdata.total_pieces/sdata.operating_time/sdata.ideal_run_rate;
                  stacking.quality = sdata.total_accept_pieces/sdata.total_pieces;
                  stacking.overall_oee = stacking.availability*stacking.performance*stacking.quality;
                  notching.availability = ndata.operating_time/ndata.planned_production_time;
                  notching.performance = (ndata.total_pieces/ndata.operating_time)/ndata.ideal_run_rate;
                  notching.quality = ndata.total_accept_pieces/ndata.total_pieces;
                  notching.overall_oee = notching.availability*notching.performance*notching.quality;                  
                  var data = { stacking : stacking, notching : notching, stack : stack, notch : notch };
                  console.log(data)
                }
                res.json({rtnCode: rtnCode, rtnData: data});
              });
            }         
          });
        }     
      });
    }    
  });
});

/*router.get('/restapi/getDashboardDetail', function(req, res, next) {
  console.log('reports/restapi/getDashboardDetail');
  var gte = Utils.getDate(req.query.date, fmt2, 0, 0, 0, -60, 'Y', 'Y');    
  var in_data = { index : indexNotchingOee+Utils.getDate(req.query.date, fmt4, 0, 0, 0, -30, 'Y', 'Y'), type : "oee",                   
                  gte : gte, lte : req.query.date };
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardDetail", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var notch = out_data;                        
      in_data.index = indexStackingOee+"*";
      queryProvider.selectSingleQueryByID2("dashboard","selectDashboardDetail", in_data, function(err, out_data, params) {
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {    
          var stack = out_data;          
          var stacking = [], notching = [];          
          var ndate = notch[0]._source.data[0].dtSensed;          
          for(i=0; i<notch.length; i++){            
            if(ndate == notch[i]._source.data[0].dtSensed){            
              var n = notch[i]._source.data[0];
              n.dtSensed = Utils.getDateUTC2Local(n.dtSensed, fmt2);            
              n.cid = notch[i]._source.cid;       
              n.availability *= 100;
              n.quality *= 100;
              n.performance *= 100;
              notching.push(n);    
            } else {
              i = notch.length;
            }
          };
          var sdate = stack[0]._source.data[0].dtSensed;
          for(i=0; i<stack.length; i++){            
            if(sdate == stack[i]._source.data[0].dtSensed){              
              var s = stack[i]._source.data[0];            
              s.dtSensed = Utils.getDateUTC2Local(s.dtSensed, fmt2);     
              s.cid = stack[i]._source.cid;
              s.availability *= 100;
              s.quality *= 100;
              s.performance *= 100;
              stacking.push(s);
            } else {
              i = stack.length;
            }
          };
          var data = { stacking : stacking, notching : notching };
        }
        res.json({rtnCode: rtnCode, rtnData: data});
      });
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});*/

router.get('/restapi/getDashboardInfo', function(req, res, next) {
  console.log('reports/restapi/getDashboardInfo');  
  var i = indexNotchingOee.split('_');  
  var date = Utils.getMs2Date(parseInt(req.query.date), fmt2, 'Y', 'Y');  
  var in_data = { index : i[0]+'_'+req.query.type+'_'+i[2]+Utils.getDateLocal2UTC(date, fmt4, 'Y', 'Y'), type : "oee",                   
                  sort : "dtTransmitted" , date : date, cid : req.query.cid };
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardInfo", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      data = out_data[0]._source.data[0];      
      data.dtSensed = Utils.getDateUTC2Local(data.dtSensed, fmt2);
      data.availability *= 100;
      data.quality *= 100;
      data.performance *= 100;
      data.flag = out_data[0]._source.flag;
      data.type = out_data[0]._source.type;
      data.cid = out_data[0]._source.cid;
      data.sensorType = out_data[0]._source.sensorType;
      data.state = req.query.state;     
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

router.get('/restapi/getDashboardInfoStatus', function(req, res, next) {
  console.log('reports/restapi/getDashboardInfoStatus');    
  var date = Utils.getMs2Date(parseInt(req.query.date), fmt2, 'Y', 'Y');
  var gte = Utils.getDate(date, fmt2, 0, 0, -1, 0, 'Y', 'Y')
  var d = date.split('T');
  var g = gte.split('T');
  var in_data = { index : indexStackingStatus+'2017.09.27', type : "status",
                  sort : "dtTransmitted" , gte : '2017-09-27T'+g[1], lte : '2017-09-27T'+d[1], cid : req.query.cid };  
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardInfoStatus", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {          
      for(i=0; i<out_data.length; i++){
        var d = out_data[i]._source.data[0];
        d.measure_time = Utils.getDateUTC2Local(d.measure_time, fmt2);
        d.cid = out_data[i]._source.cid;
        d.flag = out_data[i]._source.flag;
        d.sensorType = out_data[i]._source.sensorType;
        d.type = out_data[i]._source.type2
        data.push(d);
      }
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});


module.exports = router;
