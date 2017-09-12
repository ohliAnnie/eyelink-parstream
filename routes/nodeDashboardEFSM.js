var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
require('date-utils');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'open selected', timeseries:'', reports:'', analysis:'', management:'', settings:''};

var indexAcc = global.config.es_index.es_jira;

router.get('/', function(req, res, next) {
  mainmenu.dashboard = ' open selected';
  mainmenu.timeseries = '';
  var in_data = {    index:  "elagent_test-agent-2017.09.06", type: "AgentInfo"    };
  queryProvider.selectSingleQueryByID2("dashboard","selectByIndex", in_data, function(err, out_data, params) {     
    var rtnCode = CONSTS.getErrData('0000');
    var check = {}, list = [], cnt = 0;
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      out_data.forEach(function(d){
        if(check[d._source.agentId]==null){
          check[d._source.agentId] = { no : cnt++};
          list.push({ id : d._source.agentId, name : d._source.applicationName })
        } 
      });
      list.push({ id : 'test-file', name : 'JIRA' });
    }
  res.render('./dashboard/main', { title: global.config.productname, mainmenu:mainmenu, indexs: indexAcc, agent: list }); 
  });
});

 router.get('/error_pop', function(req, res, next) { 
  res.render('./dashboard/error_pop', { title: global.config.productname, mainmenu:mainmenu, indexs: indexAcc });
});


router.get('/timeseries', function(req, res, next) {
  // console.log(_rawDataByDay);
  mainmenu.dashboard = '';
  mainmenu.timeseries = ' open selected';
  res.render('./dashboard/timeseries'+global.config.pcode, { title: global.config.productname, mainmenu:mainmenu, indexs: indexAcc });
});

router.get('/inspector', function(req, res, next) {
  mainmenu.dashboard = ' open selected';  
  res.render('./dashboard/inspector', { title: global.config.productname, mainmenu:mainmenu, indexs: indexAcc });
});


router.get('/trenddata', function(req, res, next) {
  mainmenu.dashboard = ' open selected';
  mainmenu.timeseries = '';
  res.render('./dashboard/trenddata', { title: global.config.productname, mainmenu:mainmenu, indexs: indexAcc});
});

router.get('/test', function(req, res, next) {
  mainmenu.dashboard = ' open selected';
  mainmenu.timeseries = '';
  res.render('./dashboard/test', { title: global.config.productname, mainmenu:mainmenu, indexs: indexAcc });
});

// query RawData
router.get('/restapi/getDashboardRawData', function(req, res, next) {
  // load data on startup이 true일 경우
  if (global.config.loaddataonstartup.active) {    
    queryProvider.selectSingleQueryByID2("dashboard", "selectEventRawData", in_data, function(err, out_data, params) {
      console.log(out_data[0]);
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data === null) {
        rtnCode = CONSTS.getErrData('0001');
      }

      // console.log('typeof array : %s', (typeof out_data[0] !== 'undefined'));
      // console.log('typeof array : %s', (out_data[0] !== null));

      // MERGE = 'Y'이면 이전 날짜의 RawData를 합쳐준다.
      // if (params.MERGE === 'Y')
      //   out_data = Utils.mergeLoadedData(out_data);

      // console.log('dashboard/restapi/getReportRawData -> out_data : %s', out_data);
      // console.log('dashboard/restapi/getReportRawData -> out_data : %s', out_data[0]);
      console.log('dashboard/restapi/getDashboardRawData -> length : %s', out_data.length);
      res.json({rtnCode: rtnCode, rtnData: out_data});
    });
  } else {  // false 인 경우는 현재일자부터 7일전 리스트를 조회.
    var d = new Date();
    var to_date = d.toFormat('YYYY-MM-DD');
    getTbRawDataByPeriod(d.removeDays(7).toFormat('YYYY-MM-DD'), to_date, res);
  }
});

router.get('/restapi/selectJiraAccReq', function(req, res, next) {
  console.log('dashboard/restapi/selectJiraAccReq');
  var in_data = {    index : req.query.index, START : req.query.START, END : req.query.END  };  
  queryProvider.selectSingleQueryByID2("dashboard","selectJiraAccReq", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
     }     
    res.json({rtnCode: rtnCode, rtnData: out_data});
  });
});

router.get('/restapi/selectJiraSankeyByLink', function(req, res, next) {
  console.log('dashboard/restapi/selectJiraAccReq');
  var in_data = {    index : req.query.index, START : req.query.START, END : req.query.END  };  
  queryProvider.selectSingleQueryByID2("dashboard","selectJiraAccReq", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
     } else {
        var node={}, nodes = [], line = {}, lines = [], req={},  last = {}, lineNode = {}, id={};
 var colors=['#FF0000', '#FF5E00', '#FFBB00', '#FFE400', '#ABF200', '#1DDB16', '#00D8FF', '#0054FF', '#0100FF', '#5F00FF',
                    '#FF00DD', '#FF007F', '#FFA7A7', '#FFE08C', '#CEF279', '#B2EBF4', '#B5B2FF', '#FFB2F5', '#CC723D', '#008299'];  
 var reqCnt = 0, nodeCnt = 0, lineCnt = 0, lineNodeCnt = 0, idCnt = 0;        
 var nodeNo = 0;
 var nodeList = []; 
 out_data.forEach(function(d) {  
  if(d._source.request != null) {
  var a = d._source.request.split('?');                         
  var c = a[0].split('.');    
  if(c[c.length-1]!='js'&&c[c.length-1]!='css'&&c[c.length-1]!='png'&&c[c.length-1]!='woff'&&c[c.length-1]!='json'&&c[c.length-1]!='jsp'&&c[c.length-1]!='ico'&&c[c.length-1]!='svg'&&c[c.length-1]!='gif'&&c[c.length-1]!='navigation'){     
    if(d._source.auth == null){
     d._source.auth = 'visitor';
    }      
    var b = a[0].split('/');

    if(req[a[0]] == null) {          
      req[a[0]] = { no : reqCnt++, cnt : 1};
    } else {
      req[a[0]].cnt++;        
    }        
    
    if(id[b[b.length-1]] == null) {
      id[b[b.length-1]] = colors[idCnt++%20];                   
    }
    
    var nodeId = b[b.length-1]+'_'+req[a[0]].no;       
    
    if(node[nodeId] ==null){
      nodeList[nodeNo] = nodeId;
       node[nodeId] ={ name : a[0], id : nodeId, no : nodeNo++, errcnt : 0 };  
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
             if(d._source.response < 400){                           
                lines[lineCnt++] = {  source:  source , target: target, value : 0.0001, cnt :  1, errcnt : 0 };                           
              } else {                             
                console.log(d._source)
                lines[lineCnt++] = {  source:  source , target: target, value : 0.0001, cnt :  1, errcnt : 1, elist : d._id };
                nodes[target].errcnt++;                                         
             }  
          } else {                            
            lines[line[source+'-'+target].no].value += 0.0001;
            lines[line[source+'-'+target].no].cnt++;
             if(d._source.response >= 400){
              console.log(d._source )
                 if(lines[line[source+'-'+target].no].errcnt == 0) {
                    lines[line[source+'-'+target].no].elist = d._id;
                 } else {
                  lines[line[source+'-'+target].no].elist += ','+d._id;       
                 }       
               lines[line[source+'-'+target].no].errcnt++;             
               nodes[target].errcnt++;                           
            }
          }
        } else {                   
          lines[line[node[to].no+'-'+node[from].no].no].value += 0.0001;
          lines[line[node[to].no+'-'+node[from].no].no].cnt++;
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
    }
  }
   });
 nodes.forEach(function(d){
  if(d.errcnt > 0){
    d.name = '[Err:'+ d.errcnt + '] '+d.name;
  }
});
  var json = {"nodes" :nodes, "links" : lines };
   }   
    res.json({rtnCode: rtnCode, rtnData: json, id : id});
  });
});

router.get('/restapi/selectJiraSankeyByLinkForScatter', function(req, res, next) {
  console.log('dashboard/restapi/selectJiraSankeyByLinkForScatter');
  var s = new Date(parseInt(req.query.start)).toString().split(' ');
  var e = new Date(parseInt(req.query.end)).toString().split(' ');  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var start = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4];
  var end = e[3]+'-'+mon[e[1]]+'-'+e[2]+'T'+e[4];  
  var date = new Date().toString().split(' ');  
  var in_data = {
    index:  [indexAcc+e[3]+"."+mon[e[1]]+"."+e[2],  indexAcc+s[3]+"."+mon[s[1]]+"."+s[2]],
    START : start,
    END : end,
    MIN : parseInt(req.query.min),
    MAX : parseInt(req.query.max)  
  };  
  queryProvider.selectSingleQueryByID2("dashboard","selectJiraAccReqMinMax", in_data, function(err, out_data, params) {      
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data == null) {
        rtnCode = CONSTS.getErrData('0001');
       } else {
          var node={}, nodes = [], line = {}, lines = [], req={},  last = {}, lineNode = {}, id={};
   var colors=['#FF0000', '#FF5E00', '#FFBB00', '#FFE400', '#ABF200', '#1DDB16', '#00D8FF', '#0054FF', '#0100FF', '#5F00FF',
                      '#FF00DD', '#FF007F', '#FFA7A7', '#FFE08C', '#CEF279', '#B2EBF4', '#B5B2FF', '#FFB2F5', '#CC723D', '#008299'];  
   var reqCnt = 0, nodeCnt = 0, lineCnt = 0, lineNodeCnt = 0, idCnt = 0;        
   var nodeNo = 0;
   var nodeList = [];
   out_data.forEach(function(d) {            
    if(d._source.request != null) {
    var a = d._source.request.split('?');                         
    var c = a[0].split('.');    
    if(c[c.length-1]!='js'&&c[c.length-1]!='css'&&c[c.length-1]!='png'&&c[c.length-1]!='woff'&&c[c.length-1]!='json'&&c[c.length-1]!='jsp'&&c[c.length-1]!='ico'&&c[c.length-1]!='svg'&&c[c.length-1]!='gif'&&c[c.length-1]!='eot'&&c[c.length-1]!='charts'&&c[c.length-1]!='da'&&c[c.length-1]!='gadget'){             
      if(d._source.auth == null){
        d._source.auth = 'visitor';
      }
      var b = a[0].split('/');

      if(req[a[0]] == null) {          
        req[a[0]] = { no : reqCnt++, cnt : 1};
      } else {
        req[a[0]].cnt++;        
      }        
      
      if(id[b[b.length-1]] == null) {
        id[b[b.length-1]] = colors[idCnt++%20];                   
      }
      
      var nodeId = b[b.length-1]+'_'+req[a[0]].no;       
      
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
              lines[lineCnt++] = {  source:  source , target: target, value : 0.0001, cnt :  1 };                
            } else {                            
              lines[line[source+'-'+target].no].value += 0.0001;
              lines[line[source+'-'+target].no].cnt++;
            }
          } else {                   
            lines[line[node[to].no+'-'+node[from].no].no].value += 0.0001;
            lines[line[node[to].no+'-'+node[from].no].no].cnt++;
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
    }
    }
     });

   nodes.forEach(function(d){
    if(d.errcnt > 0){
    d.name = '[Err:'+ d.errcnt + '] '+d.name;
    }
  });
    var json = {"nodes" :nodes, "links" : lines };
     }
      res.json({rtnCode: rtnCode, rtnData: json, id : id});
    });
});

router.get('/sankey_pop', function(req, res, next) {
  var in_data = {
    index:  indexAcc+"*",    
    type: "access",
    id : req.query.link.split(',')
  };
  console.log(in_data);
  queryProvider.selectSingleQueryByID2("dashboard","selectByIdList", in_data, function(err, out_data, params) {     
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }     
    res.render('./dashboard/sankey_pop', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu, list : out_data });
  });  
});


router.get('/restapi/selectJiraAccScatter', function(req, res, next) {
  console.log('dashboard/restapi/selectJiraAccScatter');
  console.log(req.query.start, req.query.end);
  var date = new Date().toString().split(' ');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var in_data = {
    today: indexAcc+date[3]+"."+mon[date[1]]+"."+date[2]    
  };  
  queryProvider.selectSingleQueryByID2("dashboard","selectJiraAccScatter", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/selectJiraAccDash', function(req, res, next) {
  console.log('dashboard/restapi/selectJiraAccDash');
  var date = new Date().toString().split(' ');  
  var in_data = {    index : req.query.index, START : req.query.START, END : req.query.END  };    
  queryProvider.selectSingleQueryByID2("dashboard","selectJiraAccDash", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }        
    var data = [];
    var start=new Date().getTime(), end=new Date(1990,0,0,0,0,0).getTime();    
    var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
    out_data.forEach(function(d){          
      if(d._source.response != null) {        
        var a = d._source.timestamp.split(':');                    
        var b = a[0].split('/');        
        var c = a[3].split(' ');                      
        var date = new Date(b[2], parseInt(mon[b[1]])-1, b[0], a[1], a[2], c[0]).getTime()+9*60*60*1000;                     
        if(date < start){            
          start = date;            
        } else if(date > end){            
          end = date;        
        }          
          data.push({
            x : date,
            y : d._source.responsetime,
            date : new Date(date),
           hour : new Date(date).getHours(),
            type : d._source.response >= 400? 'Error' : (d._source.responsetime >= 300 ? 'Redirection' : 'Success'), 
            term : d._source.response >= 400? 'Error' : (d._source.responsetime < 1000 ? '1s' : (d._source.responsetime < 3000 ? '3s' : (d._source.responsetime < 5000 ? '5s' : 'Slow'))),
            index : d._source.response >= 400? 4 : (d._source.responsetime < 1000 ? 0 : (d._source.responsetime < 3000 ? 1 : (d._source.responsetime < 5000 ? 2 : 3)))
          });
        }
    });  
    res.json({rtnCode: rtnCode, rtnData: data, start : start, end : end });
  });
});

router.get('/selected_detail', function(req, res, next) {      
  var s = new Date(parseInt(req.query.start)).toString().split(' ');
  var e = new Date(parseInt(req.query.end)).toString().split(' ');  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var start = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4];
  var end = e[3]+'-'+mon[e[1]]+'-'+e[2]+'T'+e[4];  
  var date = new Date().toString().split(' ');
  console.log(start, end);  
  var in_data = {
    index:  [indexAcc+e[3]+"."+mon[e[1]]+"."+e[2],  indexAcc+s[3]+"."+mon[s[1]]+"."+s[2]],
    START : start,
    END : end,
    MIN : parseInt(req.query.min),
    MAX : parseInt(req.query.max)  
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectScatterSectionList", in_data, function(err, out_data, params) {     
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }     
    res.render('./dashboard/scatter_detail_jira', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu, list : out_data });
  });  
});                 

router.get('/selected_detail_agent', function(req, res, next) {    
  var point = new Date(parseInt(req.query.start)+9*60*60*1000).toString().split(' ');  
  console
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var in_data = {    index : "elagent_test-agent-2017.09.08", type : "TraceV2"
  };
  queryProvider.selectSingleQueryByID2("dashboard","getTransaction", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');    
    out_data.forEach(function(d){                  
      var s = new Date(new Date(d._source.startTime).getTime()).toString().split(' ');            
      d._source.startTime = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4];            
    });       
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }  
    res.render('./dashboard/scatter_detail', { title: 'EyeLink for Service Monitoring', mainmenu:mainmenu, list : out_data });
  });  
});        

router.get('/restapi/getTransactionDetail', function(req, res, next) {
  console.log('dashboard/restapi/getTransactionDetail');      
  var in_data = {
    index : req.query.index ,    type : req.query.type,
    id : req.query.id,    value : req.query.value
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectByIdValue", in_data, function(err, out_data, params) {     
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }    
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/selectScatterSection', function(req, res, next) {
  console.log('dashboard/restapi/selectScatterSection');  
  var s = new Date(parseInt(req.query.start)).toString().split(' ');
  var e = new Date(parseInt(req.query.end)).toString().split(' ');  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var start = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4];
  var end = e[3]+'-'+mon[e[1]]+'-'+e[2]+'T'+e[4];  
  var date = new Date().toString().split(' ');
  console.log(start, end);
  
  var in_data = {
    index:  indexAcc+e[3]+"*",
    START : start,
    END : end,
    MIN : parseInt(req.query.min),
    MAX : parseInt(req.query.max)  
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectScatterSection", in_data, function(err, out_data, params) {     
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
    var data = [];
    var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
    out_data.forEach(function(d){          
      if(d._source.response != null) {        
        var a = d._source.timestamp.split(':');                    
        var b = a[0].split('/');        
        var c = a[3].split(' ');                      
        var date = new Date(b[2], parseInt(mon[b[1]])-1, b[0], a[1], a[2], c[0]).getTime()+9*60*60*1000;       

          data.push({
            x : date,
            y : d._source.responsetime,
            date : new Date(date),
            hour : new Date(date).getHours(),
            type : d._source.response >= 400? 'Error' : (d._source.responsetime >= 300 ? 'Redirection' : 'Success'), 
            term : d._source.response >= 400? 'Error' : (d._source.responsetime < 1000 ? '1s' : (d._source.responsetime < 3000 ? '3s' : (d._source.responsetime < 5000 ? '5s' : 'Slow'))),
            index : d._source.response >= 400? 4 : (d._source.responsetime < 1000 ? 0 : (d._source.responsetime < 3000 ? 1 : (d._source.responsetime < 5000 ? 2 : 3)))
          });
        }
    });  
  }
    res.json({rtnCode: rtnCode, rtnData: data });
  });
});

router.get('/restapi/countAccJira', function(req, res, next) {
  console.log('dashboard/restapi/countAccJira');      
  console.log(req.query.index);
  var in_data = {    index : req.query.index    };  
  queryProvider.selectSingleQueryCount("dashboard","countAccJira", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }    
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/countAccJiraError', function(req, res, next) {
  console.log('dashboard/restapi/countAccJiraError');      
  console.log(req.query.index);
  var in_data = {    index : req.query.index    };
  console.log(in_data);
  queryProvider.selectSingleQueryCount("dashboard","countAccJiraError", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }        
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getJiraAccOneWeek', function(req, res, next) {
  console.log('dashboard/restapi/getJiraAccOneWeek');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var week = [];  
  var s = new Date(new Date().getTime()-9*60*60*1000-7*24*60*60*1000).toString().split(' ');
  var in_data = {
    index: indexAcc+"*",
    start: s[3]+"-"+mon[s[1]]+"-"+s[2]+"T15:00:00"
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectJiraAccOneWeek", in_data, function(err, out_data, params) {
    // console.log(out_datsa);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }     
    var data = [];
    out_data.forEach(function(d) {              
      d._source.response = parseInt(d._source.response);
      if(d._source.response >= 400 && d._source.response < 500) {
        d._source.event_type = 1;
      } else {
        d._source.event_type = 0;
      }
      if(d._source.timestamp != null){        
        data.push(d._source);

      }
    });       
    res.json({rtnCode: rtnCode, rtnData: data });
  });  
});

router.get('/restapi/getTransaction', function(req, res, next) {
  console.log('dashboard/restapi/getTransaction');  
  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var in_data = {
    index : 'transactionlist-2017-06',
    id : req.query.id
  };
  queryProvider.selectSingleQueryByID2("dashboard","getTransactionList", in_data, function(err, out_data, params) {
       var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }    
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getAccTimeseries', function(req, res, next) {
  console.log('dashboard/restapi/getAccTimeseries');        
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","getAccTimeseries", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');  
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }    
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getProcessTimeseries', function(req, res, next) {
  console.log('dashboard/restapi/getProcessTimeseries');    
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","getProcessTimeseries", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];   
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }    
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getTopTimeseries', function(req, res, next) {
  console.log('dashboard/restapi/getTopTimeseries');    
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","getTopTimeseries", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];   
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }    
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getTotalTimeseries', function(req, res, next) {
  console.log('dashboard/restapi/getTotalTimeseries');    
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","getTotalTimeseries", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');
    var data = [];   
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }    
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getJiramapdata', function(req, res, next) {
  console.log('dashboard/restapi/getJiramapdata');    
 var in_data = {    index : req.query.index, START : req.query.START, END : req.query.END  };    
  queryProvider.selectSingleQueryByID2("dashboard","selectJiraAccMap", in_data, function(err, out_data, params) {        
    var rtnCode = CONSTS.getErrData('0000');    
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }        
     var nodes = [], edges = [], nodekey = [], edgekey = [], nodeList = [];
     nodes.push({ data : { id : 'jira', name : 'jira', img : '../assets/sample/JIRA.png', parent : 'p_jira' }});      
     nodekey['jira'] = 0
      var color = ["#d5d5d5", "#57a115", "#de9400", "#de3636"];
      out_data.forEach(function(d){            
        d._source.application_id = 'users';
        d._source.application_name = 'users';
        d._source.to_application_id = 'jira';        
        if(nodekey[d._source.application_id]!=null) {       
          if(parseInt(d._source.response) >=400 ) {
            nodekey[d._source.to_application_id]++;
          }
        } else { 
          nodekey[d._source.application_id] = 0;                  
          var img = d._source.application_name.split(' ');
          nodeList.push({ id : d._source.application_id, status : 0 });
          nodes.push({ data : { id : d._source.application_id, name : d._source.application_name, img : '../assets/sample/'+img[0]+'.png', parent : 'p_'+d._source.application_id }});      
          if(parseInt(d._source.response) >= 400 ) {
            nodekey[d._source.application_id]++;
          }
        }        
        if(edgekey[d._source.application_id+'-'+d._source.to_application_id] != null) {
          edgekey[d._source.application_id+'-'+d._source.to_application_id]++
        } else {
          edgekey[d._source.application_id+'-'+d._source.to_application_id] = 1;
        }        
      });      

      nodes.forEach(function(d){    
        if(nodekey[d.data.id]!=0){
          d.data.color = color[3];
        } else {
          d.data.color = color[1];
        }
      });      
      for(key in nodekey) {
        if(nodekey[key] != 0){
          nodes.push({ data : { id : 'p_'+key, name : nodekey[key] ,img : '../assets/sample/back.png' }});      
        }
      }
      for(key in edgekey) {
        var id = key.split('-');    
        edges.push({ data : { count : edgekey[key], source : id[0], target : id[1]} });
      }       
    res.json({rtnCode: rtnCode, nodes : nodes, edges : edges, nodeList : nodeList});
  });
});

router.get('/restapi/getJiramapdataForScatter', function(req, res, next) {
  console.log('dashboard/restapi/getJiramapdata');    
  var s = new Date(parseInt(req.query.start)).toString().split(' ');
  var e = new Date(parseInt(req.query.end)).toString().split(' ');  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var start = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4];
  var end = e[3]+'-'+mon[e[1]]+'-'+e[2]+'T'+e[4];  
  var date = new Date().toString().split(' ');  
  var in_data = {
    index:  indexAcc+"*",
    START : start,
    END : end,
    MIN : parseInt(req.query.min),
    MAX : parseInt(req.query.max)  
  };   
  queryProvider.selectSingleQueryByID2("dashboard","selectJiraAccMapMinMax", in_data, function(err, out_data, params) {        
    var rtnCode = CONSTS.getErrData('0000');    
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }        
     var nodes = [], edges = [], nodekey = [], edgekey = [], nodeList = [];
     nodes.push({ data : { id : 'jira', name : 'jira', img : '../assets/sample/JIRA.png', parent : 'p_jira' }});      
     nodekey['jira'] = 0
      var color = ["#d5d5d5", "#57a115", "#de9400", "#de3636"];
      out_data.forEach(function(d){            
        d._source.application_id = 'users';
        d._source.application_name = 'users';
        d._source.to_application_id = 'jira';        
        if(nodekey[d._source.application_id]!=null) {       
          if(parseInt(d._source.response) >=400 ) {
            nodekey[d._source.to_application_id]++;
          }
        } else { 
          nodekey[d._source.application_id] = 0;                  
          var img = d._source.application_name.split(' ');
          nodeList.push({ id : d._source.application_id, status : 0 });
          nodes.push({ data : { id : d._source.application_id, name : d._source.application_name, img : '../assets/sample/'+img[0]+'.png', parent : 'p_'+d._source.application_id }});      
          if(parseInt(d._source.response) >= 400 ) {
            nodekey[d._source.application_id]++;
          }
        }        
        if(edgekey[d._source.application_id+'-'+d._source.to_application_id] != null) {
          edgekey[d._source.application_id+'-'+d._source.to_application_id]++
        } else {
          edgekey[d._source.application_id+'-'+d._source.to_application_id] = 1;
        }        
      });      

      nodes.forEach(function(d){    
        if(nodekey[d.data.id]!=0){
          d.data.color = color[3];
        } else {
          d.data.color = color[1];
        }
      });      
      for(key in nodekey) {
        if(nodekey[key] != 0){
          nodes.push({ data : { id : 'p_'+key, name : nodekey[key] ,img : '../assets/sample/back.png' }});      
        }
      }
      for(key in edgekey) {
        var id = key.split('-');    
        edges.push({ data : { count : edgekey[key], source : id[0], target : id[1]} });
      }       
    res.json({rtnCode: rtnCode, nodes : nodes, edges : edges, nodeList : nodeList});
  });
});

/*
router.get('/restapi/getAppmapdata', function(req, res, next) {
  console.log('dashboard/restapi/getAppmapdata');    
  var in_data = {
    index : 'applicationmapdata-2017-08',
    //gte : req.query.gte,
    //lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectAppmapdata", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');    
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }       

     var nodes = [], edges = [], nodekey = [], edgekey = [], nodeList = [];
      var color = ["#d5d5d5", "#57a115", "#de9400", "#de3636"];
      out_data.forEach(function(d){    
        if(nodekey[d._source.application_id]!=null) {       
          if(parseInt(d._source.state) >=400 ) {
            nodekey[d._source.application_id]++;
          }
        } else { 
          nodekey[d._source.application_id] = 0;                  
          var img = d._source.application_name.split(' ');
          nodeList.push({ id : d._source.application_id, status : 0 });
          nodes.push({ data : { id : d._source.application_id, name : d._source.application_name, img : '../assets/sample/'+img[0]+'.png', parent : 'p_'+d._source.application_id }});      
          if(parseInt(d._source.state) >= 400 ) {
            nodekey[d._source.application_id]++;
          }
        }
        if(edgekey[d._source.application_id+'-'+d._source.to_application_id] != null) {
          edgekey[d._source.application_id+'-'+d._source.to_application_id]++
        } else {
          edgekey[d._source.application_id+'-'+d._source.to_application_id] = 1;
        }        
      });      
      nodes.forEach(function(d){    
        if(nodekey[d.data.id]!=0){
          d.data.color = color[3];
        } else {
          d.data.color = color[1];
        }
      });      
      for(key in nodekey) {
        if(nodekey[key] != 0){
          nodes.push({ data : { id : 'p_'+key, name : nodekey[key] ,img : '../assets/sample/back.png' }});      
        }
      }
      for(key in edgekey) {
        var id = key.split('-');    
        edges.push({ data : { count : edgekey[key], source : id[0], target : id[1]} });
      }      
    res.json({rtnCode: rtnCode, nodes : nodes, edges : edges, nodeList : nodeList});
  });
});
*/

router.get('/restapi/getHeapData', function(req, res, next) {
  console.log('dashboard/restapi/getHeapData');    
  var in_data = {
    index : req.query.index,
    type : req.query.type,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectByTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }        
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getJvmSysData', function(req, res, next) {
  console.log('dashboard/restapi/getHeapData');    
  var in_data = {
    index : req.query.index,
    type : req.query.type,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectByTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }        
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});


router.get('/restapi/getStatTransaction', function(req, res, next) {
  console.log('dashboard/restapi/getStatTransaction');    
  var in_data = {
    index : req.query.index,
    type : req.query.type,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectByTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }        
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getActiveTrace', function(req, res, next) {
  console.log('dashboard/restapi/getActiveTrace');    
  var in_data = {
    index : req.query.index,
    type : req.query.type,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID2("dashboard","selectByTimestamp", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');        
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }        
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});


router.get('/restapi/getRestimeCount', function(req, res, next) {
  console.log('dashboard/restapi/getRestimeCount');    
  var in_data = {
    index : req.query.index,
    gte : req.query.gte,
    lte : req.query.lte
  };
  queryProvider.selectSingleQueryByID3("dashboard","getRestimeCount", in_data, function(err, out_data, params) {    
    var rtnCode = CONSTS.getErrData('0000');    
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');      
    }    
    res.json({rtnCode: rtnCode, rtnData: out_data.group_by_timestamp.buckets });
  });
});


// ###########################################################


module.exports = router;