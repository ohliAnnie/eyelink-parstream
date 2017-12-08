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
        d.dtSensed = Utils.getDateUTC2Local(d.dtSensed, fmt2);
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
          d.dtSensed = Utils.getDateUTC2Local(d.dtSensed, fmt2);
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

module.exports = router;