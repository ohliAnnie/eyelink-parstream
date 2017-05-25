var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'', settings:'', sample:'open selected'};

/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./sample/serverMap', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/samplePage', function(req, res, next) {
  res.render('./sample/samplePage', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap', function(req, res, next) {
  res.render('./sample/serverMap', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap1', function(req, res, next) {
  res.render('./sample/serverMap1', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/serverMap2', function(req, res, next) {
  res.render('./sample/serverMap2', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatter01', function(req, res, next) {
  res.render('./sample/scatter01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatter02', function(req, res, next) {
  res.render('./sample/scatter02', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatter03', function(req, res, next) {
  res.render('./sample/scatter03', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/scatterTest01', function(req, res, next) {
  res.render('./sample/scatterTest01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/summary', function(req, res, next) {
  res.render('./sample/summary', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/sankey', function(req, res, next) {
  res.render('./sample/sankey', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/sankey01', function(req, res, next) {
  res.render('./sample/sankey01', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/sankey02', function(req, res, next) {
  res.render('./sample/sankey02', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

router.get('/sankey03', function(req, res, next) {
  res.render('./sample/sankey03', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu });
});

// query Report
router.get('/restapi/selectJiraAccess', function(req, res, next) {
  console.log('sample/restapi/selectJiraAccess');
  var in_data = {};
  queryProvider.selectSingleQueryByID2("sample","selectJiraAccess", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

// query Report
router.get('/restapi/selectJiraAccReq', function(req, res, next) {
  console.log('sample/restapi/selectJiraAccReq');
  var in_data = {};
  queryProvider.selectSingleQueryByID2("sample","selectJiraAccReq", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

router.get('/restapi/selectJiraAccJson', function(req, res, next) {
  console.log('sample/restapi/selectJiraAccJson');
  var in_data = {};
  queryProvider.selectSingleQueryByID2("sample","selectJiraAccReq", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
     }
     var node={}, nodes = [], line = {}, lines = [], req={},  last = {}, lineNode = {};
     var reqCnt = 0, nodeCnt = 0, lineCnt = 0, lineNodeCnt = 0;        
     var nodeNo = 0;
     var nodeList = [];
     out_data.forEach(function(d) {        
        var a = d._source.request.split('?');                     
        
        if(req[a[0]] == null) {          
          req[a[0]] = { no : reqCnt++, cnt : 1};
        } else {
          req[a[0]].cnt++;        
        }        
        
        var nodeId = d._source.auth+'_'+req[a[0]].no;       
        
        if(node[nodeId] ==null){
          nodeList[nodeNo] = nodeId;
          node[nodeId] ={ name : a[0], id : nodeId, no : nodeNo++ };          
        }
        if(last[d._source.auth] != null){
          var from = last[d._source.auth];
          var to = nodeId;  
          if(node[from].no > node[to].no){
            from = nodeId;
            to = last[d._source.auth];
          }        
          if(from != to){
            if(line[node[to].no+'-'+node[from].no] == null){
              if(lineNode[from] == null) {                
                lineNode[from] = {};        
                node[from].no = lineNodeCnt;        
                nodes[lineNodeCnt++] = node[from];                        
              }
              if(lineNode[to] == null) {
                lineNode[to] = {};    
                node[to].no = lineNodeCnt;
                nodes[lineNodeCnt++] = node[to];                                
              }
              var source = node[from].no;
              var target = node[to].no;              
              if(line[source+'-'+target] == null) {                
                line[source+'-'+target] = { no : lineCnt };               
                lines[lineCnt++] = {  source:  source , target: target, value : 0.0001 };                
              } else {                            
                lines[line[source+'-'+target].no].value += 0.0001;
              }
            } else {                   
              lines[line[node[to].no+'-'+node[from].no].no].value += 0.0001;
            }
          } else {            
           if(lineNode[to] == null) {
              lineNode[to] = {};                  
              node[to].no = lineNodeCnt;              
              nodes[lineNodeCnt++] = node[to];                                
            }  
          }
        }        
        last[d._source.auth] =  node[nodeId].id;       
       });
     var json = {"nodes" :nodes, "links" : lines };
     var text = JSON.stringify(json);    
    res.json({rtnCode: rtnCode, rtnData: json});
  });

});

  
module.exports = router;
