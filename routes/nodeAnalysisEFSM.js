var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var fs = require('fs');
var net = require('net');
var router = express.Router();
var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;

var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis: 'open selected', management:'', settings:''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/clustering', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/clustering', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/clustering', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/cluster_detail', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/cluster_detail', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/clusteringPop', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/clustering_popup', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/runalaysis', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/runanalysis', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/anomaly', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/anomaly', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/anomaly_new', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/anomaly_new', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/pattern', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/pattern', { title: global.config.productname, mainmenu:mainmenu});
});

router.get('/postTest', function(req, res, next) {
  console.log(_rawDataByDay);
  res.render('./analysis/postTest', { title: global.config.productname, mainmenu:mainmenu});
});

router.post('/restapi/insertAnomaly/:id', function(req, res, next) {  
  console.log('/analysis/restapi/insertAnomaly');    
  console.log(JSON.stringify(req.body));
   var id = req.params.id;
   var in_data = {    INDEX: "analysis", TYPE: "anomaly", ID: id   };  
   queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {        
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');
      console.log(rtnCode);
      res.json({rtnCode: rtnCode});
    }  else  {
      var in_data = {    INDEX: "analysis", TYPE: "anomaly", ID: id,   BODY : JSON.stringify(req.body)   };  
     queryProvider.insertQueryByID("analysis", "insertById", in_data, function(err, out_data) {        
          console.log(out_data);
          if(out_data.result == "created"){
            console.log(out_data);  
            var rtnCode = CONSTS.getErrData("D001");                   
          }
        if (err) { console.log(err) };                     
        res.json({rtnCode: rtnCode});    
      });
    }
  });
});

router.post('/restapi/updateAnomaly/:id', function(req, res, next) {  
  console.log('/analysis/restapi/updateAnomaly');    
  console.log(JSON.stringify(req.body));
  var in_data = {  INDEX: "analysis", TYPE: "anomaly", ID: req.params.id };  
  queryProvider.deleteQueryByID("analysis", "deleteById", in_data, function(err, out_data) {
    if(out_data.result == "deleted"){
      var rtnCode = CONSTS.getErrData("D003");
      var in_data = {    INDEX: "analysis", TYPE: "anomaly", ID: req.params.id,  BODY : JSON.stringify(req.body)     };  
     queryProvider.insertQueryByID("analysis", "insertById", in_data, function(err, out_data) {                  
        if(out_data.result == "created"){          
          rtnCode = CONSTS.getErrData("D001");                   
        }
        if (err) { console.log(err) };                     
        res.json({rtnCode: rtnCode});    
      });
     rtnCode = CONSTS.getErrData("D002");  
    }
    res.json({rtnCode: rtnCode});
  });  
});

router.delete('/restapi/deleteAnomaly/:id', function(req, res, next) {  
  console.log('/analysis/restapi/deleteAnomaly');      
  var in_data = {  INDEX: "analysis", TYPE: "anomaly", ID: req.params.id };  
  queryProvider.deleteQueryByID("analysis", "deleteById", in_data, function(err, out_data) {
    if(out_data.result == "deleted"){
      var rtnCode = CONSTS.getErrData("D003");    
    }
    res.json({rtnCode: rtnCode});
  });  
});

// query RawData
router.get('/restapi/getAnomaly/:id', function(req, res, next) {
  console.log(req.query);
  var in_data = {  INDEX: "analysis", TYPE: "anomaly" , ID: req.params.id}  
  queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {
    console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data.length == 0) {
      rtnCode = CONSTS.getErrData('0001');
      console.log('test');
      res.json({rtnCode: rtnCode});
    }
    console.log('analysis/restapi/getDaClusterDetail -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]._source});
  })
});

// patterns
router.get('/restapi/getPatterns', function(req, res, next) {
  console.log(req.query);
  var in_data = {  INDEX: "analysis", TYPE: "anomaly" , ID: req.query._id}  
  queryProvider.selectSingleQueryByID2("analysis", "selectPatterns", in_data, function(err, out_data, params) {
    console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data.length == 0) {
      rtnCode = CONSTS.getErrData('0001');
      console.log('test');
      res.json({rtnCode: rtnCode});
    }
    console.log('analysis/restapi/getPatterns -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]._source});
  })
});


router.post('/restapi/insertAnomalyPattern/:id', function(req, res, next) {  
  console.log('/analysis/restapi/insertAnomalyPattern');    
  console.log(JSON.stringify(req.body));   
   var in_data = {    INDEX: "analysis", TYPE: "anomaly_pattern", ID: req.params.id   };  
   queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {        
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');      
    }  else  {      
      var in_data = {    INDEX: "analysis", TYPE: "anomaly_pattern", ID: req.params.id,   BODY : JSON.stringify(req.body)   };  
     queryProvider.insertQueryByID("analysis", "insertById", in_data, function(err, out_data) {        
          if(out_data.result == "created"){
            console.log(out_data);  
            var rtnCode = CONSTS.getErrData("D001");                   
          }
        if (err) { console.log(err) };                     
        res.json({rtnCode: rtnCode});    
      });     
    }
     res.json({rtnCode: rtnCode});    
     
  });
});

router.post('/restapi/insertPatternInfo/:id', function(req, res, next) {  
  console.log('/analysis/restapi/insertPatternInfo');    
  console.log(JSON.stringify(req.body));   
   var in_data = {    INDEX: "analysis", TYPE: "anomaly_pattern", ID: req.params.id   };  
   queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {        
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');      
    }  else  {      
      var in_data = {    INDEX: "analysis", TYPE: "anomaly_pattern", ID: req.params.id,   BODY : JSON.stringify(req.body)   };  
     queryProvider.insertQueryByID("analysis", "insertById", in_data, function(err, out_data) {        
          if(out_data.result == "created"){
            console.log(out_data);  
            var rtnCode = CONSTS.getErrData("D001");                   
          }
        if (err) { console.log(err) };                     
        res.json({rtnCode: rtnCode});    
      });     
    }
     res.json({rtnCode: rtnCode});    
  });
});

// query RawData
router.get('/restapi/getAnomalyPattern/:id', function(req, res, next) {  
  var in_data = {  INDEX: "analysis", TYPE: "anomaly_pattern" , ID: req.params.id}  
  queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data.length === 0000) {
      rtnCode = CONSTS.getErrData('0001');      
      res.json({rtnCode: rtnCode});
    } else {
      console.log('f');
      console.log(out_data);
      var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
      var day = new Date().toString().split(' ');
      var id = day[3]+'-'+mon[day[1]]+'-'+day[2];
      var in_data = {  INDEX: "analysis", TYPE: "anomaly" , ID: id };      
      var pattern = out_data[0]._source ;      
      queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data,  function(err, out_data, params) {        
        var clust = out_data[0]._source.pattern_data;
        console.log(pattern);
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data[0] === null) {   rtnCode = CONSTS.getErrData('0001');     
         res.json({rtnCode: rtnCode});   }
        console.log('analysis/restapi/getAnomaly -> length : %s', out_data.length);
        res.json({rtnCode: rtnCode, pattern : pattern, clust : clust});
      });
    }
        console.log('analysis/restapi/getAnomalyPattern -> length : %s', out_data.length);
        res.json({rtnCode: rtnCode, pattern : pattern, clust : clust});
  });  
});

// pattern dataset
router.get('/restapi/getAnomalyPatternList', function(req, res, next) {
  console.log(req.query);
  var in_data = {
      INDEX : "analysis", TYPE : "anomaly",
      START_TIMESTAMP: req.query.startDate + 'T00:00:00',
      END_TIMESTAMP: req.query.endDate + 'T23:59:59'};

  var sql = "selectPatternList";

  queryProvider.selectSingleQueryByID2("analysis", sql, in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log('analysis/restapi/getAnomalyPatternList -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

// query RawData
router.get('/restapi/getAnomalyChartData', function(req, res, next) {    
  var now = new Date(parseInt(req.query.now));   
  var end = now.getTime()+5*1000;
  console.log(now);
  var e = new Date(end).toString().split(' ');
  var s = new Date(now.getTime()-10*60*1000).toString().split(' ');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var in_data = {  INDEX: "analysis", TYPE: "anomaly_pattern", gte : s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4], lte : e[3]+'-'+mon[e[1]]+'-'+e[2]+'T'+e[4] } 
  queryProvider.selectSingleQueryByID2("analysis", "selectByAnalysisTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      console.log('null');
      rtnCode = CONSTS.getErrData('0001');
    } else if(out_data.length == 0) {
      rtnCode = CONSTS.getErrData('0001');
    } else {      
      var id = e[3]+'-'+mon[e[1]]+'-'+e[2];
      var in_data = {  INDEX: "analysis", TYPE: "anomaly" , ID: id };      
      var pattern = out_data[0]._source.analysis ;      
      queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data,  function(err, out_data, params) {                                
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) { 
          console.log('null');          
         rtnCode = CONSTS.getErrData('0001');        
        } else if(out_data.length == 0) {
           rtnCode = CONSTS.getErrData('0001');
        } else {
          var clust = out_data[0]._source.pattern_data;
          console.log(pattern.timestamp)
          var t = pattern.timestamp.split('T');
          var tt = t[0].split('-');          
          var ttt = t[1].split(':');    
          var point = new Date(tt[0], parseInt(tt[1])-1, tt[2], ttt[0], ttt[1], ttt[2]).getTime();    
          console.log(point)                               
          var start = point - 50*60*1000;
          var s = new Date(start-0.6*60*1000).toString().split(' ');                
          var in_data = {
          START_TIMESTAMP: s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4],
          END_TIMESTAMP:  e[3]+'-'+mon[e[1]]+'-'+e[2]+'T'+e[4],
          NODE: ["0002.00000039"]       };
         queryProvider.selectSingleQueryByID2("analysis", "selectClusterNodePower", in_data, function(err, out_data, params) {
            var rtnCode = CONSTS.getErrData('0000');
            if (out_data == null) {
              rtnCode = CONSTS.getErrData('0001');
            } else if(out_data.length == 0) {
              rtnCode = CONSTS.getErrData('0001');
            } else {
            console.log('analysis/restapi/getClusterNodePower -> length : %s', out_data.length);            
              var voltage = ({ center : clust.voltage.center[pattern.voltage], center2 : clust.voltage.center[pattern.voltage_2], center3 : clust.voltage.center[pattern.voltage_3], min : clust.voltage.min_value[pattern.voltage], max : clust.voltage.max_value[pattern.voltage], lower : clust.voltage.lower[pattern.voltage], upper : clust.voltage.upper[pattern.voltage]});              
              var ampere = ({ center : clust.ampere.center[pattern.ampere], center2 : clust.ampere.center[pattern.ampere_2], center3 : clust.ampere.center[pattern.ampere_3], min : clust.ampere.min_value[pattern.ampere], max : clust.ampere.max_value[pattern.ampere], lower : clust.ampere.lower[pattern.ampere], upper : clust.ampere.upper[pattern.ampere]});
              var power_factor = ({ center : clust.power_factor.center[pattern.power_factor], center2 : clust.power_factor.center[pattern.power_factor_2], center3 : clust.power_factor.center[pattern.power_factor_3], min : clust.power_factor.min_value[pattern.power_factor], max : clust.power_factor.max_value[pattern.power_factor], lower : clust.power_factor.lower[pattern.power_factor], upper : clust.power_factor.upper[pattern.power_factor]});
              var active_power = ({ center : clust.active_power.center[pattern.active_power], center2 : clust.active_power.center[pattern.active_power_2], center3 : clust.active_power.center[pattern.active_power_3], min : clust.active_power.min_value[pattern.active_power], max : clust.active_power.max_value[pattern.active_power], lower : clust.active_power.lower[pattern.active_power], upper : clust.active_power.upper[pattern.active_power]});
              var vdata = [], adata = [], pfdata = [], apdata = [];
              var vapt = [], aapt = [], pfapt = [], apapt = [], vcpt = [], acpt = [], pfcpt = [], apcpt = [];
              for(i=59; i<voltage.center.length; i++){                
                vdata.push({date : start+(i-59)*60*1000, center : voltage.center[i], center2 : voltage.center2[i], center3 : voltage.center3[i], min : voltage.min[i], max : voltage.max[i], lower :  voltage.lower[i], upper : voltage.upper[i] });
                adata.push({date : start+(i-59)*60*1000, center : ampere.center[i], center2 : ampere.center2[i], center3 : ampere.center3[i], min : ampere.min[i], max : ampere.max[i], lower : ampere.lower[i], upper : ampere.upper[i]});
                apdata.push({date : start+(i-59)*60*1000, center : active_power.center[i], center2 : active_power.center2[i], center3 : active_power.center3[i], min : active_power.min[i], max : active_power.max[i], lower : active_power.lower[i], upper : active_power.upper[i] });
                pfdata.push({date : start+(i-59)*60*1000, center : power_factor.center[i], center2 : power_factor.center2[i], center3 : power_factor.center3[i], min : power_factor.min[i], max : power_factor.max[i], lower : power_factor.lower[i], upper : power_factor.upper[i]});                
              }                     
              for(i=59; i<pattern.ampere_caution_pt.length; i++){
                if(pattern.ampere_caution_pt[i] != -1){
                  acpt.push({ date : start+(i-59)*60*1000, value : pattern.ampere_caution_pt[i] });
                  console.log(pattern.ampere_caution_pt[i]);
                }
                if(pattern.voltage_caution_pt[i] != -1){
                  vcpt.push({ date : start+(i-59)*60*1000, value : pattern.voltage_caution_pt[i] });
                }
                if(pattern.active_power_caution_pt[i] != -1){
                  apcpt.push({ date : start+(i-59)*60*1000, value : pattern.active_power_caution_pt[i] });
                }
                if(pattern.power_factor_caution_pt[i] != -1){
                  pfcpt.push({ date : start+(i-59)*60*1000, value : pattern.power_factor_caution_pt[i] });
                }
                if(pattern.ampere_anomaly_pt[i] != -1){
                  aapt.push({ date : start+(i-59)*60*1000, value : pattern.ampere_anomaly_pt[i] });
                }
                if(pattern.voltage_anomaly_pt[i] != -1){
                  vapt.push({ date : start+(i-59)*60*1000, value : pattern.voltage_anomaly_pt[i] });
                }
                if(pattern.active_power_anomaly_pt[i] != -1){
                  apapt.push({ date : start+(i-59)*60*1000, value : pattern.active_power_anomaly_pt[i] });
                }
                if(pattern.power_factor_anomaly_pt[i] != -1){
                  pfapt.push({ date : start+(i-59)*60*1000, value : pattern.power_factor_anomaly_pt[i] });
                }
              }

              var anomaly = { vdata : vdata, adata : adata, apdata : apdata, pfdata : pfdata };              
              var pt = { vapt : vapt, aapt : aapt, apapt : apapt, pfapt : pfapt, vcpt : vcpt, acpt : acpt, apcpt : apcpt, pfcpt : pfcpt };              
              var data = []; 
              out_data.forEach(function(d){      
                data.push(d._source);
              });   
              var last = data[data.length-1];
              var s = new Date(start).toString().split(' ');
              data[0].event_time = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4];
              console.log(last)
              var n = new Date(parseInt(req.query.now)).toString().split(' ');
              console.log(n)
              data.push({ active_power : last.active_power, ampere : last.ampere, power_factor : last.power_factor, voltage : last.voltage, event_time : n[3]+'-'+mon[n[1]]+'-'+n[2]+'T'+n[4], node_id : last.node_id });
              console.log(data[data.length-1]);
              res.json({rtnCode: rtnCode, anomaly : anomaly, raw : data, point : point, pattern : pattern, pt : pt});
            }
          });
        }         
        console.log('analysis/restapi/getAnomaly -> length : %s', out_data.length);
         res.json({rtnCode: rtnCode, anomaly : anomaly, raw : data, point : point});
      });
    }
    console.log('analysis/restapi/getAnomalyPattern -> length : %s', out_data.length);
     res.json({rtnCode: rtnCode, anomaly : anomaly, raw : data, point : point});
  });
});

router.get('/restapi/getAnomalyPatternCheck/:id', function(req, res, next) {  
  var in_data = {  INDEX: "analysis", TYPE: "anomaly_pattern" , ID: req.params.id}
  queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } 
    res.json({rtnCode: rtnCode, rtnData : out_data});  
  });
});

// query RawData
router.get('/restapi/getClusterNodePower', function(req, res, next) {
  console.log(req.query);
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };  
  var in_data = {
      START_TIMESTAMP: req.query.startDate,
      END_TIMESTAMP: req.query.endDate,
      NODE: req.query.nodeId.split(','),
      FLAG : 'N'};
  queryProvider.selectSingleQueryByID2("analysis", "selectClusterNodePower", in_data, function(err, out_data, params) {
     //console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
   var data = [];    
    out_data.forEach(function(d){                 
      data.push(d._source);
    });    
    console.log('analysis/restapi/getClusterNodePower -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

// query RawData
router.get('/restapi/getClusterRawData', function(req, res, next) { 
  console.log(req.query)
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };  
  var start = new Date(req.query.startDate).getTime();  
  var end = new Date(req.query.endDate).getTime();  
  var index = [], cnt = 0;
  for(i = start; i<=end; i=i+24*60*60*1000){
    var d = new Date(i).toString().split(' ');    
    index[cnt++]  = "corecode-"+d[3]+'-'+mon[d[1]]+'-'+d[2];
  }
  console.log(index);
  var in_data = {
      index : index, type : "corecode",
      START_TIMESTAMP: req.query.startDate,
      END_TIMESTAMP: req.query.endDate,
    };
  queryProvider.selectSingleQueryByID2("analysis", "selectClusterRawData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log('analysis/restapi/getClusterRawData -> length : %s', out_data.length);
    var data = [];    
    out_data.forEach(function(d){                 
      data.push(d._source);
    });    
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

// query RawData
router.get('/restapi/getClusterRawDataByNode', function(req, res, next) { 
  console.log(req.query)    
  var in_data = {
      index : "corecode-*", type : "corecode",
      START_TIMESTAMP: req.query.startDate,
      END_TIMESTAMP: req.query.endDate,
      node : req.query.node
    };
  queryProvider.selectSingleQueryByID2("analysis", "selectClusterRawDataByNode", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log('analysis/restapi/getClusterRawData -> length : %s', out_data.length);
    var data = [];    
    out_data.forEach(function(d){                 
      data.push(d._source);
    });    
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

// query RawData
router.get('/restapi/getDataBySource', function(req, res, next) { 
  console.log(req.query)
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };  
  var start = new Date(req.query.startDate).getTime();  
  var end = new Date(req.query.endDate).getTime();  
  var index = [], cnt = 0;
  for(i = start; i<=end; i=i+24*60*60*1000){
    var d = new Date(i).toString().split(' ');    
    index[cnt++]  = "corecode-"+d[3]+'-'+mon[d[1]]+'-'+d[2];
  }
  console.log(index);
  var in_data = {
      index : "corecode-*", type : "corecode",
      START_TIMESTAMP: req.query.startDate,
      END_TIMESTAMP: req.query.endDate,
      Source : req.query.source.split(',')
    };
  queryProvider.selectSingleQueryByID2("analysis", "selectDataBySource", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log('analysis/restapi/getClusterRawData -> length : %s', out_data.length);
    var data = [];    
    out_data.forEach(function(d){                 
      data.push(d._source);
    });    
    res.json({rtnCode: rtnCode, rtnData: data});
  });
});

router.post('/restapi/insertClusterMaster/:id', function(req, res, next) {  
  console.log('/analysis/restapi/insertClusterMaster');    
  console.log(JSON.stringify(req.body));
   var id = req.params.id;
   var in_data = {    INDEX: "cluster", TYPE: "master", ID: id   };  
   queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {        
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');
      console.log(rtnCode);
      res.json({rtnCode: rtnCode});
    }  else  {
      var in_data = {    INDEX: "cluster", TYPE: "master", ID: id,   BODY : JSON.stringify(req.body)   };  
     queryProvider.insertQueryByID("analysis", "insertById", in_data, function(err, out_data) {        
          console.log(out_data);
          if(out_data.result == "created"){
            console.log(out_data);  

            var rtnCode = CONSTS.getErrData("D001");                   
          }
        if (err) { console.log(err) };                     
        res.json({rtnCode: rtnCode});    
      });
    }
  });
});

router.post('/restapi/insertClusterDetail/:id', function(req, res, next) {  
  console.log('/analysis/restapi/insertClusterDetail');    
  console.log(JSON.stringify(req.body));
   var id = req.params.id;
   var in_data = {    INDEX: "cluster", TYPE: "detail", ID: id   };  
   queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {        
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');
      console.log(rtnCode);
      res.json({rtnCode: rtnCode});
    }  else  {
      var in_data = {    INDEX: "cluster", TYPE: "detail", ID: id,   BODY : JSON.stringify(req.body)   };  
     queryProvider.insertQueryByID("analysis", "insertById", in_data, function(err, out_data) {        
          console.log(out_data);
          if(out_data.result == "created"){
            console.log(out_data);  
            var rtnCode = CONSTS.getErrData("D001");                   
          }
        if (err) { console.log(err) };                     
        res.json({rtnCode: rtnCode});    
      });
    }
  });
});

// query RawData
router.get('/restapi/getDaClusterDetail', function(req, res, next) {  
  var in_data = {
      INDEX : "cluster",    TYPE : "detail",
      ID : req.query.daDate };
  queryProvider.selectSingleQueryByID2("analysis", "selectById", in_data, function(err, out_data, params) {    
    console.log(err);
    console.log(out_data);    
    if (out_data === null) {
      var rtnCode = CONSTS.getErrData('0001');
      res.json({rtnCode: rtnCode, rtnData: out_data});
    } else {
      var rtnCode = CONSTS.getErrData('0000');
      console.log('analysis/restapi/getDaClusterDetail -> length : %s', out_data.length);      
    }   
    res.json({rtnCode: rtnCode, rtnData : out_data[0]._source.detail_result });
  });
});

router.get('/restapi/getDaClusterMasterByDadate', function(req, res, next) {
  console.log(req.query);
  var in_data = {
      index : "cluster",    type : "master",
      DADATE: req.query.dadate };
  queryProvider.selectSingleQueryByID2("analysis", "selectDaClusterMasterByDadate", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log('analysis/restapi/getDaClusterMaster -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data[0]._source.master_result });
  });
});


router.get('/restapi/getDaClusterMaster', function(req, res, next) {
  console.log(req.query);
  console.log(req.query.interval);
  var in_data = {
      index : "cluster", type : "master",
      START_TIMESTAMP: req.query.startDate + 'T00:00:00',
      END_TIMESTAMP: req.query.endDate + 'T23:59:59',
      INTERVAL: parseInt(req.query.interval),
      FLAG : 'N'};
  if(req.query.interval === 'all')  {
    var sql = "selectDaClusterMasterAll";
  } else {
    var sql = "selectDaClusterMaster";
  }
  queryProvider.selectSingleQueryByID2("analysis", sql, in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data === null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    console.log('analysis/restapi/getDaClusterMaster -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});



// run analysis
router.post('/restapi/runAnalysis', function(req, res, next) {
  console.log(req.body);
  var in_data = {"start_date": req.body.startDate,
                "end_date": req.body.endDate,
                "time_interval": parseInt(req.body.interval)};
  in_data = JSON.stringify(in_data, null, 4);
  console.log(in_data);
  // FIX-ME Socket Connection Close 처리 로직 보완 필요함.
  getConnectionToDA("DataAnalysis", function(socket) {
    console.log(socket);
    writeDataToDA(socket, in_data, function() {
      var rtnCode = CONSTS.getErrData('0000');
      res.json({rtnCode: rtnCode, rtnData: ''});
    });
  });
});

function getConnectionToDA(connName, callback){  
  var pUrl = global.config.analysis.host;
  var pPort = global.config.analysis.port;
  // var pUrl = 'm2u-da.eastus.cloudapp.azure.com';
  // var pUrl = 'localhost';
  console.log(pUrl);
  console.log(pPort);
  var client = net.connect({port: pPort, host:pUrl}, function() {
    console.log(connName + ' Connected: ');
    console.log('   local = %s:%s', this.localAddress, this.localPort);
    console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
    this.setTimeout(500);
    this.setEncoding('utf8');
    this.on('data', function(data) {
      console.log(connName + " From Server: " + data.toString());
      this.end();
    });
    this.on('end', function() {
      console.log(connName + ' Client disconnected');
    });
    this.on('error', function(err) {
      console.log('Socket Error: ', JSON.stringify(err));
    });
    this.on('timeout', function() {
      console.log('Socket Timed Out');
    });
    this.on('close', function() {
      console.log('Socket Closed');
    });
    callback(client);
  });
  // return client;
}

function writeDataToDA(socket, data, callback){
  var success = !socket.write(data);
  console.log('success : ' + success);
  if (!success){
    (function(socket, data){
      socket.once('drain', function(){
        console.log('drain');
        writeData(socket, data, callback);
      });
    })(socket, data);
  }

  if (success) {
    callback();
  }
}



module.exports = router;