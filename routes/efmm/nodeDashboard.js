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

router.get('/restapi/getDashboardAggsData', function(req, res, next) {
  console.log('reports/restapi/getDashboardAggsData');    
  var lte = Utils.getMs2Date(parseInt(req.query.now), fmt2, 'Y', 'Y');    
  //var gte = Utils.getMs2Date(parseInt(req.query.now), fmt1, 'Y', 'Y')+'T00:00:00';    
  var gte = Utils.getDate(lte, fmt2, 0, 0, 0, -5, 'Y', 'Y');    
/*  var index = [], cnt = 0;  -
  for(i = new Date(gte).getTime(); i<=new Date(lte).getTime(); i=i+24*60*60*1000){    
    index[cnt++]  = indexCore+Utils.getMs2Date(i, fmt4);
  }  */
  var in_data = { index : indexNotchingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , gte : gte, lte : lte };    
  queryProvider.selectSingleQueryByID3("dashboard","selectDashboardAggsData", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      console.log(out_data)
      var notch = out_data.group_by_state.buckets[out_data.group_by_state.buckets.length-1];      
      console.log(notch);
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
  var lte = Utils.getMs2Date(parseInt(req.query.now), fmt2, 'Y', 'Y');    
  //var gte = Utils.getMs2Date(parseInt(req.query.now), fmt1, 'Y', 'Y')+'T00:00:00';    
  var gte = Utils.getDate(lte, fmt2, 0, 0, -30, 0, 'Y', 'Y');    
/*  var index = [], cnt = 0;  -
  for(i = new Date(gte).getTime(); i<=new Date(lte).getTime(); i=i+24*60*60*1000){    
    index[cnt++]  = indexCore+Utils.getMs2Date(i, fmt4);
  }  */
  var in_data = { index : indexNotchingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , gte : gte, lte : lte };    
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardGageData", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var notch = out_data;                  
      console.log(out_data);
      in_data = { index : indexStackingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , gte : gte, lte : lte };          
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
  var in_data = { index : indexNotchingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , date : req.query.date };
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardDetail", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var notch = out_data;                  
      console.log(out_data);
      in_data = { index : indexStackingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , date : req.query.date };         
      queryProvider.selectSingleQueryByID2("dashboard","selectDashboardDetail", in_data, function(err, out_data, params) {
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {    
          var stack = out_data;
          var len = (notch.length <= stack.length) ? notch.length : stack.length;          
          var stacking = [], notching = [], gage = [];                    
          for(i=0; i<len; i++) {                        
            n = notch[i]._source.data[0];                                
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

router.get('/restapi/getDashboardInfo', function(req, res, next) {
  console.log('reports/restapi/getDashboardInfo');  
  var i = indexNotchingOee.split('_');
  console.log(req.query);
  var in_data = { index : i[0]+'_'+req.query.type+'_'+i[2]+"*", type : "oee",                   
                  sort : "dtTransmitted" , date : req.query.date, cid : req.query.cid };
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardInfo", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      data = out_data[0]._source.data[0];      
      data.dtSensed = Utils.getDateUTC2Local(data.dtSensed, fmt2);
      data.flag = out_data[0]._source.flag;
      data.type = out_data[0]._source.type;
      data.cid = out_data[0]._source.cid;
      data.sensorType = out_data[0]._source.sensorType;
      data.status = req.query.status;     
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});


module.exports = router;
