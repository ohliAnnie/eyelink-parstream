$(function(){ // on dom ready  
  getDash(new Date);
  var elesJson = {
    nodes: [
      { data: { id: 'n1', name : 'USER', img: '../assets/images/user1.png' } },
      { data: { id: 'n2', name : 'USER', img: '../assets/images/user2.png' } },
      { data: { id: 'n3', name : 'FRONT-WEB', img: '../assets/sample/tomcat0.png' } },
      { data: { id: 'n4', name : 'BACKEND-WEB', img: '../assets/sample/tomcat3.png' } },
      { data: { id: 'n5', name : 'BACKEND-API', img: '../assets/sample/tomcat1.png' } },
      { data: { id: 'n6', name : 'MEMCACHED', img: '../assets/sample/memcached.png' } },
      { data: { id: 'n7', name : 'XXX:YYY:ZZZ', img: '../assets/sample/cloud.png' } },
      { data: { id: 'n8', name : 'URL\t2740\nURL:XXX\t1974\nURL:AAA\t1370\n765', img: '../assets/sample/cloud.png' } },      
      { data: { id: 'n10', name : 'MySQL', img: '../assets/sample/mysql.png' } },
      { data: { id: 'n11', name : 'ARCUS', img: '../assets/sample/arcus.png' } },      ],
    edges: [
       { data: { count : 8459, source: 'n1', target: 'n3' } },
       { data: { count : 5922, source: 'n3', target: 'n6' } },
       { data: { count : 709, source: 'n3', target: 'n7' } },
       { data: { count : 6849, source: 'n3', target: 'n8' } },
       { data: { count : 661, source: 'n3', target: 'n5' } },
       
       { data: { count : 854, source: 'n5', target: 'n10' } },
       { data: { count : 760, source: 'n3', target: 'n4' } },
       { data: { count : 1525, source: 'n2', target: 'n4' } },
       { data: { count : 205, source: 'n4', target: 'n7' } },
       { data: { count : 194, source: 'n4', target: 'n5' } },
       { data: { count : 2285, source: 'n4', target: 'n10' } },
       { data: { count : 2280, source: 'n4', target: 'n11' } },     
    ]  
  };
  var cy = cytoscape({
    container: document.getElementById('cy'),
          
     style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'width': '100px',
          'height': '60px',
          'content': 'data(name)',
          'background-fit': 'cover',
           'border-color': '#000',
          'border-width': 1,
          'border-opacity': 0.5,
          'text-outline-width': 2,
          'text-outline-color': 'white',          
          'shape': 'rectangle',   
          'text-valign': 'bottom', 
          'text-wrap' : 'wrap' ,
          'background-image': 'data(img)', })
      .selector('edge')
        .css({
          'curve-style': 'bezier',
          'width': 3,
          'line-color': '#B1C1F2',
          'target-arrow-color': '#B1C1F2',
          'target-arrow-shape': 'triangle',
          'text-outline-width': 5,
          'text-outline-color': 'white',
          'content': 'data(count)',
          'opacity': 0.8,
          
        })
      .selector(':selected')
        .css({
          'background-color': 'black',
          'line-color': 'blue',
           'border-width': 3,
          'border-color': 'blue',
          'target-arrow-color': 'blue',
          'source-arrow-color': 'black',
          'opacity': 1
        })
        .selector('#a1')
        .css({
          'background-image': '../assets/images/user1.png'
        })
        .selector('#a2')
        .css({
          'background-image': '../assets/images/user2.png'

        })
        .selector('#b1')
        .css({
          'background-image': '../assets/sample/tomcat.png'
        })
        .selector('.multiline-manual')
        .css({
          'text-wrap' : 'wrap'
        }),
        

    elements: elesJson,
    
    layout: {
      name: 'dagre',
      rankDir: 'LR',
      nodeSep: 100,
      edgeSep: 100,
      rankSep: 100,
    },

    ready: function(){
      window.cy = this;
      // giddy up
    }
  }); 
 
}); // on dom ready

function getDash(day) {
  console.log(new Date(day));
  var mon = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];  
  $.ajax({
    url: "/dashboard/restapi/selectJiraAccDash",
    dataType: "json",
    type: "GET",    
    data: { index: "filebeat_jira_access-"+day.getFullYear()+"."+mon[day.getMonth()]+"."+day.getDate()},
    success: function(result) {
      var mon = {'Jan' : 1, 'Feb' : 2, 'Mar' : 3, 'Apr' : 4, 'May' : 5, 'Jun' : 6, 'Jul' : 7, 'Aug' : 8, 'Sep' : 9, 'Oct' : 10, 'Nov' : 11, 'Dec' : 12 };
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
        var data = [];
        var start=new Date().getTime(), end=new Date(1990,0,0,0,0,0).getTime();
        result.rtnData.forEach(function(d){                    
          if(d._source.response != null) {
            var a = d._source.timestamp.split(':');

            var b = a[0].split('/');
            var c = a[3].split(' ');              
            var date = new Date(b[2], mon[b[1]]-1, b[0], a[1], a[2], c[0]).getTime();                          
            if(date < start){            
              start = date;            
            } else if(date > end){            
              end = date;        
            }          
              data.push({
                x : date,
                y : d._source.responsetime,
                date : new Date(date),
               hour : d3.time.hour(new Date(date)),
                type : d._source.response >= 400? 'Error' : (d._source.responsetime >= 300 ? 'Redirection' : 'Success'), 
                term : d._source.response >= 400? 'Error' : (d._source.responsetime < 1000 ? '1s' : (d._source.responsetime < 3000 ? '3s' : (d._source.responsetime < 5000 ? '5s' : 'Slow'))),
                index : d._source.response >= 400? 4 : (d._source.responsetime < 1000 ? 0 : (d._source.responsetime < 3000 ? 1 : (d._source.responsetime < 5000 ? 2 : 3)))
              });
            }
        });  
        console.log(new Date(start), new Date(end))     ;
        drawDash(data, start, end);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

var cnt = 0;
function drawDash(data, start, end) {  
  if(Modernizr.canvas){
    doBigScatterChart(start, end);
  }
  var oScatterChart;
  console.log(oScatterChart);
  function doBigScatterChart(start, end){
    oScatterChart = new BigScatterChart({
      sContainerId : 'chart1',
      nWidth : window.innerWidth*0.42,
      nHeight : 280,
      nXMin: start, nXMax: end,
      nYMin: 0, nYMax: 10000,
      nZMin: 0, nZMax: 5,
      nBubbleSize: 3,
      nPaddingTop : 50,
      nDefaultRadius : 3,
      htTypeAndColor : {
        'Success' :'#55c7c7',
        'Redirection' : '#fcc666',
        'Error' : '#fd7865'        
      },
      sXLabel : '(time)',
      sYLabel : '(ms)',
      htGuideLine : {
        'nLineWidth' : 1,
        'aLineDash' : [2, 5],
        'nGlobalAlpha' : 0.2
      },
      sXLabel : '',
      nPaddingRight : 5,
      fOnSelect : function(htPosition, htXY){
        console.log('fOnSelect', htPosition, htXY);
        console.time('fOnSelect');
        console.log(new Date(start), new Date(end));
        var aData = this.getDataByXY(htXY.nXFrom, htXY.nXTo, htXY.nYFrom, htXY.nYTo);
        console.log(new Date(htXY.nXTo), new Date(htXY.nXFrom));
        console.log(htXY.nXTo, htXY.nXFrom);
        var link = './selected_detail?start='+htXY.nXFrom+'&end='+htXY.nXTo+'&min='+htXY.nYFrom+'&max='+htXY.nYTo;
        console.timeEnd('fOnSelect');
        console.log('adata length', aData.length);
        window.open(link, "EyeLink Service LIst", "menubar=1,status=no,scrollbars=1,resizable=1 ,width=1200,height=640,top=50,left=50");
        d3.select("#test").select("svg").remove();
        d3.select("#load").select("svg").remove();
        var s = new Date(htXY.nXFrom).toString().split(' ');
        var date = new Date().toString().split(' ');
        var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
        $.ajax({
          url: "/dashboard/restapi/selectScatterSection" ,
          dataType: "json",
          type: "get",
          data: {       today : "filebeat_jira_access-"+date[3]+"."+mon[date[1]]+"."+date[2] , start:htXY.nXFrom, end:htXY.nXTo, min:htXY.nYFrom, max:htXY.nYTo},
          success: function(result) {
            if (result.rtnCode.code == "0000") {            
            var dataS = [];
            var startS=new Date().getTime(), endS=new Date(1990,0,0,0,0,0).getTime();          
            result.rtnData.forEach(function(d){              
              var a = d._source.timestamp.split(':');
              var b = a[0].split('/');
              var c = a[3].split(' ');
              var mon = {'Jan' : 1, 'Feb' : 2, 'Mar' : 3, 'Apr' : 4, 'May' : 5, 'Jun' : 6, 'Jul' : 7, 'Aug' : 8, 'Sep' : 9, 'Oct' : 10, 'Nov' : 11, 'Dec' : 12 };
              var date = new Date(b[2], mon[b[1]]-1, b[0], a[1], a[2], c[0]);                  
              if(date.getTime() < startS){
                startS = date.getTime();            
              } else if(date > endS){
                endS = date.getTime();        
              }
              dataS.push({
                x : date.getTime(),
                y : d._source.responsetime,
                date : date,
                hour : d3.time.hour(date),
                type : d._source.response >= 400? 'Error' : (d._source.responsetime >= 300 ? 'Redirection' : 'Success'),                
                term : d._source.response >= 400? 'Error' : (d._source.responsetime < 1000 ? '1s' : (d._source.responsetime < 3000 ? '3s' : (d._source.responsetime < 5000 ? '5s' : 'Slow'))),
                index : d._source.response >= 400? 4 : (d._source.responsetime < 1000 ? 0 : (d._source.responsetime < 3000 ? 1 : (d._source.responsetime < 5000 ? 2 : 3)))
              });
             });
            console.log(dataS);
             summary(dataS, startS, endS);
          } else {
            //- $("#errormsg").html(result.message);
          }
        },
        error: function(req, status, err) {
          //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
          $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
        }
      });     
          
        //alert('Selected data count : ' + aData.length);
      }
    }); 
      if(cnt != 0){         
        oScatterChart._empty();
        oScatterChart._redraw();      
        summary(data, start, end);
      }
      oScatterChart.addBubbleAndDraw(data);         
  }   
   if(cnt++ == 0) {
    console.log(new Date(start));
    console.log(new Date(end)); 

    summary(data, start, end);
   }  
};  

function summary(data, start, end) {  
  var chart = dc.barChart("#test");
  var load = dc.barChart("#load");
 
  var timeformat = d3.time.format('%m-%d %H:%M');
  
  if((end-start)<60*60*1000){
    start -= 30*60*1000;
    end += 30*60*1000;
  }
  
  var minDate = new Date(start); 
  var maxDate = new Date(end);
  var gap = (end-start)/(24 * 60 * 60 * 1000);

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var termDim = nyx.dimension(function(d) {      
    return d.term; 
  });

  var BarGroup = termDim.group().reduceCount(function(d) {
    return 1;
  });

  var hourDim = nyx.dimension(function(d) {    
    return d.hour;
  });
  var stackGroup = hourDim.group().reduce(function(p, v){
    p[v.index] = (p[v.index] || 0) + 1;    
    return p;
  }, function(p, v) {
    p[v.index] = (p[v.index] || 0) - 1;
    return p;
  }, function() {
    return{};
  });
  
var term = ['1s', '3s', '5s', 'Slow', 'Error'];
chart
    .width(window.innerWidth*0.20)
    .height(320)    
    .margins({left: 40, top: 5, right: 10, bottom: 40})
    .brushOn(false)    
    .dimension(termDim)
    .group(BarGroup)
    .elasticY(true)
    .brushOn(true)    
    .x(d3.scale.ordinal().domain(term))
    .xUnits(dc.units.ordinal)    
    .renderLabel(true)
    .on('renderlet', function(chart) {
        chart.selectAll('rect').on("click", function(d) {
            console.log("click!", d);
        });
    });
     
  load
    .width(window.innerWidth*0.20)
    .height(310)
    .margins({left: 65, top: 10, right: 10, bottom: 40})
    .brushOn(false)
    .transitionDuration(500)
    .clipPadding(10)
    .title(function(d) {
      for(var i=0; i<term.length; i++) {
        if(this.layer == term[i])                   
          return this.layer + ' : ' + d.value[i];
      }
    })      
    .dimension(hourDim)
    .group(stackGroup, term[0], sel_stack('0'))
    .mouseZoomable(true)
    .renderHorizontalGridLines(true)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.hour.round)
    .xUnits(function(){return 20;})
    .elasticY(true)
    .centerBar(true)
 //   .gap(gap)
    .colors(d3.scale.ordinal().range(["#EDC951",  "#31a354", "#00A0B0", "#FFB2F5" , "#CC333F"]));
    load.legend(dc.legend());
    dc.override(load, 'legendables', function() {
      var items = load._legendables();
      return items.reverse();
    });
    for(var i = 1; i<term.length; ++i){
      load.stack(stackGroup, term[i], sel_stack(i));
    }  
    /*  dc.barChart('#eventBar')  */
  function sel_stack(i) {
      return function(d) {            
          return d.value[i]?d.value[i]:0;
      };
  }
 dc.renderAll();
}

function displayCount() {    
  var mon = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];  
  var day = new Date();
  var pday = day.getTime() - 24*60*60*1000;
  pday = new Date(pday);    
    $.ajax({
    url: "/dashboard/restapi/countAccJira",
    dataType: "json",
    type: "GET",    
    data: { index: "filebeat_jira_access-"+day.getFullYear()+"."+mon[day.getMonth()]+"."+day.getDate()},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
         $('#dayCnt').text(result.rtnData);               
         pdayCnt(pday, mon);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });

  $.ajax({
    url: "/dashboard/restapi/countAccJira",
    dataType: "json",
    type: "GET",    
    data: { index: "filebeat_jira_access-"+day.getFullYear()+"."+mon[day.getMonth()]+".*"},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
        $('#monCnt').text(result.rtnData);        
        pmonCnt(day, mon);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
 
   $.ajax({
    url: "/dashboard/restapi/countAccJiraError",
    dataType: "json",
    type: "GET",    
    data: { index: "filebeat_jira_access-"+day.getFullYear()+"."+mon[day.getMonth()]+"."+day.getDate()},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
         $('#errCnt').text(result.rtnData);               
        perrCnt(pday, mon);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });      

}

function setStatus(obj, percent, msg, cnt) {
  // $('#mevent_status > .status > .status-number')
  obj.children('.progress').children('.progress-bar').css('width', percent + '%');
  obj.children('.status').children('.status-title').text('From the previous ' + msg + ' (' + cnt + ')');
  obj.children('.status').children('.status-number').text(repVal(percent) + '%');
}

function repVal(str) {
  str *= 1
  return str.toFixed(2);
}

function pdayCnt(day, mon){
   $.ajax({
    url: "/dashboard/restapi/countAccJira",
    dataType: "json",
    type: "GET",    
    data: { index: "filebeat_jira_access-"+day.getFullYear()+"."+mon[day.getMonth()]+"."+day.getDate()},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);
        setStatus($('#dayCnt_status'), parseInt($('#dayCnt').text())/result.rtnData*100, 'day', result.rtnData);       

      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function pmonCnt(day, mon){
   if(day.getMonth() == 0) {
    var index = "filebeat_jira_access-"+(day.getFullYear()-1)+"."+mon[11]+".*";
  } else {
    var index = "filebeat_jira_access-"+day.getFullYear()+"."+mon[day.getMonth()-1]+".*";
  }
  $.ajax({
    url: "/dashboard/restapi/countAccJira",
    dataType: "json",
    type: "GET",    
    data: { index: index },
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);
        setStatus($('#monCnt_status'), parseInt($('#monCnt').text())/result.rtnData*100, 'month', result.rtnData); 
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function perrCnt(day, mon){
   $.ajax({
    url: "/dashboard/restapi/countAccJiraError",
    dataType: "json",
    type: "GET",    
    data: { index: "filebeat_jira_access-"+day.getFullYear()+"."+mon[day.getMonth()]+"."+day.getDate()},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);
        setStatus($('#errCnt_status'), parseInt($('#errCnt').text())/result.rtnData*100, 'day', result.rtnData);       
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawChart() {
  var markerName = "dashboardChart";
  var volumeChart = dc.barChart('#volumn-chart', markerName);

  d3.json("/dashboard/restapi/getJiraAccOneWeek", function(err, out_data) {
    // if (err) throw Error(error);
    var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
    var df = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ');
    var numberFormat = d3.format('.2f');
    var maxDate = new Date();
    var minDate  = addDays(new Date(), -20);

    // for Test
    maxDate = new Date(new Date().getTime());
    minDate = new Date(new Date().getTime()-7*24*60*60*1000);

    var data = out_data.rtnData;
    // console.log(out_data);
    
    data.forEach(function (d) {         
      var a = d.timestamp.split(':');
      var b = a[0].split('/');
      var c = a[3].split(' ');
      var mon = {'Jan' : 1, 'Feb' : 2, 'Mar' : 3, 'Apr' : 4, 'May' : 5, 'Jun' : 6, 'Jul' : 7, 'Aug' : 8, 'Sep' : 9, 'Oct' : 10, 'Nov' : 11, 'Dec' : 12 };      
      d.day=d3.time.day(new Date(b[2], mon[b[1]]-1, b[0], a[1], a[2], c[0]));
            
    });

    // console.log(data);

    var ndx = crossfilter(data);

    var moveDays = ndx.dimension(function (d) {    
      return d.day;
    });

   var stackGroup = moveDays.group().reduce(function(p, v){
    p[v.event_type] = (p[v.event_type] || 0) + 1;    
    return p;
  }, function(p, v) {
    p[v.event_type] = (p[v.event_type] || 0) - 1;
    return p;
  }, function() {
    return{};
  });
  
    // console.log(ampereGroup);
  function sel_stack(i) {
      return function(d) {            
          return d.value[i]?d.value[i]:0;
      };
  }
   
/*  dc.barChart('#eventBar')  */
var type = ['success', 'error'];
    volumeChart
      // .width(600)
      .height(77)
      .margins({top: 0, right: 50, bottom: 20, left: 40})
      .dimension(moveDays)
      .group(stackGroup, type[0], sel_stack('0'))
      .centerBar(true)
      .brushOn(false)
      .gap(1)
      .x(d3.time.scale().domain([minDate, maxDate]))      
      .elasticY(true)
      .round(d3.time.day.round)
      .alwaysUseRounding(true)
      .xUnits(d3.time.days)
      .title(function(d) {
       for(var i=0; i<type.length; i++) {
        if(this.layer == type[i])                   
          return this.layer + ' : ' + d.value[i];
          }
       })
       .colors(d3.scale.ordinal().range(["#EDC951",  "#CC333F"]));
    for(var i = 1; i<type.length; ++i){
      volumeChart.stack(stackGroup, type[i], sel_stack(i));
    }  

    volumeChart.on("renderlet.somename", function(chart) {
      chart.selectAll('rect').on("click", function(d) {
       
       /*document.getElementById('chart1').reload();
        var el = document.getElementById('chart1');
//        el.parentNode.removeChild(el);
        disp = el.style.display;
        el.style.display = 'none';
        el.offsetHeight;
        el.style.display ='block';

        document.getElementById('chart1').remove();*/        
        d3.select("#test").select("svg").remove();
        d3.select("#load").select("svg").remove();
        /*document.createElement('chart1');*/
        getDash(d.x);
      });  
    });    
    dc.renderAll(markerName);
  });
}

function clear(cvsId) {
    //var canvas = document.getElementById("canvas");       
    var canvas = document.getElementsByClassName("bigscatterchart-Success");    
    console.log(canvas);    
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    
}