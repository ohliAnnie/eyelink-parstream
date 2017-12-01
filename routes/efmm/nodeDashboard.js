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

var startTime = CONSTS.STARTTIME.KOREA;
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

router.get('/analysis', function(req, res, next) {
   console.log('/analysis');  
  var outdata = {
    title: global.config.productname,
    mainmenu : mainmenu
  }
  logger.info('mainmenu : %s, outdata : %s' , mainmenu.dashboard, JSON.stringify(outdata));  
  res.render(global.config.pcode + '/dashboard/dashboard_detail', outdata);
});

router.get('/restapi/getDashboardAggsData', function(req, res, next) {
  console.log('reports/restapi/getDashboardAggsData');    
  var lte = Utils.getMs2Date(parseInt(req.query.now), fmt2, 'Y', 'Y');  
  var gte = Utils.getDate(lte, fmt2, 0, 0, 0, -10, 'Y', 'Y');    
  var in_data = { index : indexNotchingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , gte : gte, lte : lte };    
  queryProvider.selectSingleQueryByID3("dashboard","selectDashboardAggsData", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');    
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {          
      var notch = out_data.group_by_state.buckets[out_data.group_by_state.buckets.length-1];
      
      in_data = { index : indexStackingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , gte : gte, lte : lte };          
      queryProvider.selectSingleQueryByID3("dashboard","selectDashboardAggsData", in_data, function(err, out_data, params) {
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {    
          var stack = out_data.group_by_state.buckets[out_data.group_by_state.buckets.length-1];
          var data = { stacking : stack, notching : notch };
         // console.log(data);
        }
        res.json({rtnCode: rtnCode, rtnData: data});
      });
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

router.get('/restapi/getDashboardGageData', function(req, res, next) {
  console.log('reports/restapi/getDashboardGageData');    
  var lte = [], gte = [], indexNotch = [], indexStack = [], cnt = 0;
  lte[6] = Utils.getMs2Date(parseInt(req.query.now), fmt2, 'Y', 'Y');    
  gte[6] = Utils.getDate(lte[6], fmt2, 0, 0, 0, -1, 'Y', 'Y');
  indexNotch[6] = indexNotchingOee+Utils.getMs2Date(parseInt(req.query.now), fmt4, 'Y', 'Y');
  indexStack[6] = indexStackingOee+Utils.getMs2Date(parseInt(req.query.now), fmt4, 'Y', 'Y');  
  for(i = new Date(lte[6]).getTime()-6*24*60*60*1000; i<new Date(lte[6]).getTime(); i=i+24*60*60*1000){
    indexNotch[cnt]  = indexNotchingOee+Utils.getMs2Date(i, fmt4);
    indexStack[cnt]  = indexStackingOee+Utils.getMs2Date(i, fmt4);
    lte[cnt] = Utils.getMs2Date(i, fmt1, 'Y', 'Y')+'T23:59:59Z';
    gte[cnt] = Utils.getDate(lte[cnt++], fmt2, 0, 0, 0, 0, 'Y', 'Y');
  }  
  var in_data = { index : indexNotch, type : "oee",                   
                  gte0 : gte[0], lte0 : lte[0],
                  gte1 : gte[1], lte1 : lte[1],
                  gte2 : gte[2], lte2 : lte[2],
                  gte3 : gte[3], lte3 : lte[3],
                  gte4 : gte[4], lte4 : lte[4],
                  gte5 : gte[5], lte5 : lte[5],
                  gte6 : gte[6], lte6 : lte[6] };
  console.log(in_data);
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardGageData", in_data, function(err, out_data, params) {
    console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var notch = out_data;      
      in_data.index = indexStack;
      queryProvider.selectSingleQueryByID2("dashboard","selectDashboardGageData", in_data, function(err, out_data, params) {
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {    
          var stack = out_data;
          var len = (notch.length <= stack.length) ? notch.length : stack.length;          
          var stacking = [], notching = [], gage = [];                    
          for(i=0; i<len; i++) {                        
            n = notch[i]._source.data[0];
            console.log(n);
            n.dtSensed = Utils.getDateUTC2Local(n.dtSensed, fmt2);            
            n.cid = notch[i]._source.cid;
            notching.push(n);                        
            s = stack[i]._source.data[0];            
            s.dtSensed = Utils.getDateUTC2Local(s.dtSensed, fmt2);                        
            s.cid = stack[i]._source.cid;
            stacking.push(s);
          };
          var data = { stacking : stacking, notching : notching };
         // console.log(data);
        }
        res.json({rtnCode: rtnCode, rtnData: data});
      });
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

router.get('/restapi/getDashboardDetail', function(req, res, next) {
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
});

router.get('/restapi/getDashboardInfo', function(req, res, next) {
  console.log('reports/restapi/getDashboardInfo');  
  var i = indexNotchingOee.split('_');
  var date = Utils.getDateLocal2UTC(req.query.date, fmt2, 'Y', 'Y');
  console.log(req.query);  
  var in_data = { index : i[0]+'_'+req.query.type+'_'+i[2]+Utils.getDateLocal2UTC(req.query.date, fmt4, 'Y', 'Y'), type : "oee",                   
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


module.exports = router;
