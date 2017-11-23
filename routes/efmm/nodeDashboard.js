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
  logger.debug('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  logger.error('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  res.render(global.config.pcode + '/dashboard/dashboard', outdata);
});

router.get('/test', function(req, res, next) {
  // console.log(_rawDataByDay);
  mainmenu.dashboard = ' open selected';

  mainmenu.timeseries = '';
  var outdata = {
    title: global.config.productname,
    mainmenu : mainmenu
  }

  logger.info('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  logger.debug('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  logger.error('mainmenu : %s, outdata : %s', mainmenu.dashboard, JSON.stringify(outdata));
  res.render(global.config.pcode + '/dashboard/test', outdata);
});

router.get('/restapi/getDashboardRawData', function(req, res, next) {
  console.log('reports/restapi/getDashboardRawData');    
  var lte = Utils.getMs2Date(parseInt(req.query.now), fmt2, 'Y', 'Y');    
  var gte = Utils.getDate(lte, fmt2, 0, 0, 0, -30, 'Y', 'Y');    
/*  var index = [], cnt = 0;  
  for(i = new Date(gte).getTime(); i<=new Date(lte).getTime(); i=i+24*60*60*1000){    
    index[cnt++]  = indexCore+Utils.getMs2Date(i, fmt4);
  }  */
  var in_data = { index : indexNotchingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , gte : gte, lte : lte };    
  queryProvider.selectSingleQueryByID2("dashboard","selectDashboardRawData", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {    
      var notch = out_data;                  
      in_data = { index : indexStackingOee+"*", type : "oee",                   
                  sort : "dtTransmitted" , gte : gte, lte : lte };          
      queryProvider.selectSingleQueryByID2("dashboard","selectDashboardRawData", in_data, function(err, out_data, params) {
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
            n.realtime = (n.total_shift_length-n.total_down_time)/60;            
            notching.push(n);                        
            s = stack[i]._source.data[0];            
            s.dtSensed = Utils.getDateUTC2Local(s.dtSensed, fmt2);            
            s.realtime = (s.total_shift_length-s.total_down_time)/60;            
            stacking.push(s);            
        //    gage.push(gageData([n,s]));            
            /*var avg = { date : Utils.getDateUTC2Local(s.dtSensed, fmt2), odd : (n.overall_oee+s.overall_oee)/2, availability : (n.availability_s.availability)/2, 
              performance : (n.performance+s.performance)/2, quality : (n.quality+s.quality)/2 }
            console.log(avg)
            gage.push(avg);*/
          };
          var data = { stacking : stacking, notching : notching, gage : gage };
         // console.log(data);
        }
        res.json({rtnCode: rtnCode, rtnData: data});
      });
    }
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

function gageData(data){    
  var gage = { oee : 0, availability : 0, performance : 0, quality : 0 };
  for(i=0; i<data.length; i++){  
    gage.oee += data[i].overall_oee;    
    gage.availability += data[i].availability;
    gage.performance += data[i].performance;
    gage.quality += data[i].quality;
  }
  gage.date = data[0].dtSensed;
  gage.oee = gage.oee/data.length*100;
  gage.availability = gage.availability/data.length*100;
  gage.performance = gage.performance/data.length*100;
  gage.quality = gage.quality/data.length*100;  
  return gage;
}

module.exports = router;
