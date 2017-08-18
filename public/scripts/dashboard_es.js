
$(function(){ // on dom ready  
  getDash(new Date);  
  displayCount();
  drawChart();      
   $.ajax({
    url: "/dashboard/restapi/getAppmapdata" ,
    dataType: "json",
    type: "get",
    data: {},
    success: function(result) {      
      if (result.rtnCode.code == "0000") {        
        makeElesJson(result.rtnData);             
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}); // on dom ready

var nodeList = [];

function makeElesJson(data){  
  var nodes = [], edges = [], nodekey = [], edgekey = [];
  var color = ["#d5d5d5", "#57a115", "#de9400", "#de3636"];
  data.forEach(function(d){    
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
  console.log(nodekey);
  nodes.forEach(function(d){    
    if(nodekey[d.data.id]!=0){
      d.data.color = color[3];
    } else {
      d.data.color = color[0];
    }
  });
  console.log(nodes);
  for(key in nodekey) {
    if(nodekey[key] != 0){
      nodes.push({ data : { id : 'p_'+key, name : nodekey[key] ,img : '../assets/sample/back.png' }});      
    }
  }
  for(key in edgekey) {
    var id = key.split('-');    
    edges.push({ data : { count : edgekey[key], source : id[0], target : id[1]} });
  }
  var elesJson = { nodes : nodes, edges : edges };  
  getServerMap(elesJson);
}

function getServerMap(elesJson) {    
  var cy = cytoscape({
    container: document.getElementById('cy'),

/*      
  boxSelectionEnabled: false,
  autounselectify: true,
*/
     style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'width': '90px',
          'height': '90px',
          'content': 'data(name)',
          'background-fit': 'cover',
           'border-color': 'data(color)',
          'border-width': 3,
          'border-opacity': 0.5,
          'text-outline-width': 2,
          'text-outline-color': 'white',          
          'shape': 'circle',   
          'text-valign': 'bottom', 
          'text-wrap' : 'wrap' ,          
          'background-image': 'data(img)',
          'background-color': 'white',
          })
      .selector(':parent')
        .css({
          'background-opacity': 0.333 })
      .selector('$node > node')
        .css({
          'padding-top': '0px',
          'padding-left': '0px',
          'padding-bottom': '0px',
          'padding-right': '0px',
           'border-color': 'white',
          'text-valign': 'top',
          'text-halign': 'right',
          'text-outline-width': 10,
          'text-outline-color': 'red',
          'background-color': 'white',
          "color" : "white",
          "font-size" : '20px'
        })
      .selector('edge')
        .css({
          'curve-style': 'bezier',
          'width': 3,
          'line-color': '#ddd ',
          'target-arrow-color': '#ddd ',
          'target-arrow-shape': 'triangle',
          'text-outline-width': 5,
          'text-outline-color': 'white',
          'content': 'data(count)',
          'opacity': 0.8,          
        })
      .selector(".background")
        .css({
          "text-background-opacity": 1,
          "text-background-color": "red",
          "text-background-shape":  "circle",
          "text-border-color": "red",
          "text-border-width": 2,
          "text-border-opacity": 1,
          "text-valign": "top",
          "text-halign": "right",
          "text-color" : "white"
//          "text-outline-color": "red",
 //         "text-outline-width": 3
        })      
      .selector(':selected')
        .css({
          'background-color': 'white',
          'line-color': '#1593ff',
           'border-width': 3,
          'border-color': '#1593ff',
          'target-arrow-color': '#1593ff',
          'source-arrow-color': 'white',
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
  cy.on('click', 'node', function(evt){    
     var id = this.id();
     nodeList.forEach(function(d){      
      if(d.id == id){
         d.status = (d.status == 0) ?1 : 0
      }
     });
  });  
};

function getDash(day) {  
  console.log(day);
  var yDay = new Date(day.getTime()-24*60*60*1000);    
  var indexs = $('#indexs').val();
  var d = day.toString().split(' ');  
  var y = yDay.toString().split(' ');  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  $.ajax({
    url: "/dashboard/restapi/selectJiraAccDash",
    dataType: "json",
    type: "GET",    
    data: { index: [indexs+d[3]+"."+mon[d[1]]+"."+d[2], indexs+y[3]+"."+mon[y[1]]+"."+y[2]],
              START : y[3]+"-"+mon[y[1]]+"-"+y[2]+'T15:00:00', END : d[3]+"-"+mon[d[1]]+"-"+d[2]+"T15:00:00"},
    success: function(result) {
      
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
        var data = [];
        var start=new Date().getTime(), end=new Date(1990,0,0,0,0,0).getTime();
        result.rtnData.forEach(function(d){                    
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

$.ajax({
    url: "/dashboard/restapi/selectJiraAccReq" ,
    dataType: "json",
    type: "get",
    data: { index: [indexs+d[3]+"."+mon[d[1]]+"."+d[2], indexs+y[3]+"."+mon[y[1]]+"."+y[2]],
              START : y[3]+"-"+mon[y[1]]+"-"+y[2]+'T15:00:00', END : d[3]+"-"+mon[d[1]]+"-"+d[2]+"T15:00:00"},
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "0000") {        
        makeData(result.rtnData);
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

function getDataByToggle(gap) {  
  d3.select("#test").select("svg").remove();
  d3.select("#load").select("svg").remove();
  d3.select("#sankey").select("svg").remove();
  var day = new Date();
  var yDay = new Date(day.getTime()-24*60*60*1000);  
  var indexs = $('#indexs').val();
  var d = day.toString().split(' ');  
  var y = yDay.toString().split(' ');
  var yyDay = new Date(day.getTime()-48*60*60*1000);  
  var yy = yyDay.toString().split(' ')
  var now = new Date().getTime() - 9*60*60*1000;
  var e = new Date(now).toString(' ').split(' ');
  var s = new Date(now-gap*60*1000).toString().split(' ');
  console.log(e);
  console.log(s);
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  $.ajax({
    url: "/dashboard/restapi/selectJiraAccDash",
    dataType: "json",
    type: "GET",    
    data: { index: [indexs+d[3]+"."+mon[d[1]]+"."+d[2], indexs+y[3]+"."+mon[y[1]]+"."+y[2], indexs+yy[3]+"."+mon[yy[1]]+"."+yy[2]],
              START : s[3]+"-"+mon[s[1]]+"-"+s[2]+'T'+s[4], END : e[3]+"-"+mon[e[1]]+"-"+e[2]+"T"+e[4]},
    success: function(result) {
      
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
        var data = [];
        var start=new Date().getTime(), end=new Date(1990,0,0,0,0,0).getTime();
        result.rtnData.forEach(function(d){                    
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

$.ajax({
    url: "/dashboard/restapi/selectJiraAccReq" ,
    dataType: "json",
    type: "get",
    data: { index: [indexs+d[3]+"."+mon[d[1]]+"."+d[2], indexs+y[3]+"."+mon[y[1]]+"."+y[2], indexs+yy[3]+"."+mon[yy[1]]+"."+yy[2]],
              START : s[3]+"-"+mon[s[1]]+"-"+s[2]+'T'+s[4], END : e[3]+"-"+mon[e[1]]+"-"+e[2]+"T"+e[4]},
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "0000") {        
        makeData(result.rtnData);
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
  var indexs = $('#indexs').val();
  if(Modernizr.canvas){
    doBigScatterChart(start, end);
  }
  var oScatterChart;
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
        'aLineDash' : [2, 7],
        'nGlobalAlpha' : 0.2
      },
      sXLabel : '',
      'fXAxisFormat' : function(nXStep, i){        
        var nMilliseconds = (nXStep * i + this._nXMin),
          sDay = new Date(nMilliseconds).toString().split(' '),
          sDate = sDay[4].split(':');
          
        return sDate[0]+':'+sDate[1]; 
      },
      nPaddingRight : 5,
      fOnSelect : function(htPosition, htXY){
        console.log(new Date(start), new Date(end));
        var aData = this.getDataByXY(htXY.nXFrom, htXY.nXTo, htXY.nYFrom, htXY.nYTo);
        var link = '/dashboard/selected_detail?start='+htXY.nXFrom+'&end='+htXY.nXTo+'&min='+htXY.nYFrom+'&max='+htXY.nYTo;
        console.timeEnd('fOnSelect');
        console.log('adata length', aData.length);
        window.open(link, "EyeLink Service LIst", "menubar=1,status=no,scrollbars=1,resizable=1 ,width=1200,height=640,top=50,left=50");
        d3.select("#test").select("svg").remove();
        d3.select("#load").select("svg").remove();        
        $.ajax({
          url: "/dashboard/restapi/selectScatterSection" ,
          dataType: "json",
          type: "get",
          data: { start:htXY.nXFrom, end:htXY.nXTo, min:htXY.nYFrom, max:htXY.nYTo},
          success: function(result) {
            if (result.rtnCode.code == "0000") {            
            var dataS = [];
            var startS=new Date().getTime(), endS=new Date(1990,0,0,0,0,0).getTime();          
            result.rtnData.forEach(function(d){              
              var a = d._source.timestamp.split(':');
              var b = a[0].split('/');
              var c = a[3].split(' ');
              var mon = {'Jan' : 1, 'Feb' : 2, 'Mar' : 3, 'Apr' : 4, 'May' : 5, 'Jun' : 6, 'Jul' : 7, 'Aug' : 8, 'Sep' : 9, 'Oct' : 10, 'Nov' : 11, 'Dec' : 12 };
              var date = new Date(b[2], mon[b[1]]-1, b[0], a[1], a[2], c[0]).getTime()+9*60*60*1000;                  
              if(date < startS){
                startS = date;            
              } else if(date > endS){
                endS = date;        
              }
              dataS.push({
                x : date,
                y : d._source.responsetime,
                date : new Date(date),
                hour : new Date(date).getHours(),
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
    .width(window.innerWidth*0.14)
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
    .width(window.innerWidth*0.28)
    .height(310)
    .margins({left: 80, top: 10, right: 10, bottom: 40})
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
    .x(d3.scale.linear().domain([0, 23]))
    //.x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.hour.round)
    .xUnits(function(){return 24;})
    .elasticY(true)
    .centerBar(true)
 //   .gap(gap)
     .colors(d3.scale.ordinal().range(["#57a115", "#0ecdb0", "#0e99cd", "#de9400", "#de3636"]));
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
  var indexs = $('#indexs').val();  
  var mon = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];  
  var day = new Date();
  var d = day.toString().split(' ');  
  var pday = day.getTime() - 24*60*60*1000;
  pday = new Date(pday);      
    $.ajax({
    url: "/dashboard/restapi/countAccJira",
    dataType: "json",
    type: "GET",    
    data: { index: indexs+day.getFullYear()+"."+mon[day.getMonth()]+"."+d[2]},
    success: function(result) {
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
    data: { index: indexs+day.getFullYear()+"."+mon[day.getMonth()]+".*"},
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
    data: { index: indexs+day.getFullYear()+"."+mon[day.getMonth()]+"."+d[2]},
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
 var indexs = $('#indexs').val();
 var d = day.toString().split(' ');

   $.ajax({
    url: "/dashboard/restapi/countAccJira",
    dataType: "json",
    type: "GET",    
    data: { index: indexs+day.getFullYear()+"."+mon[day.getMonth()]+"."+d[2]},
    success: function(result) {
       console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        /
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
  var indexs = $('#indexs').val();
   if(day.getMonth() == 0) {
    var index = indexs+(day.getFullYear()-1)+"."+mon[11]+".*";
  } else {
    var index = indexs+day.getFullYear()+"."+mon[day.getMonth()-1]+".*";
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
  var indexs = $('#indexs').val();
  var d = day.toString().split(' ');
   $.ajax({
    url: "/dashboard/restapi/countAccJiraError",
    dataType: "json",
    type: "GET",    
    data: { index: indexs+day.getFullYear()+"."+mon[day.getMonth()]+"."+d[2]},
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
    minDate = new Date(new Date().getTime()-7*24*60*60*1000-12*60*60*1000);

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
      .margins({top: 0, right: 50, bottom: 20, left: 60})
      .dimension(moveDays)
      .group(stackGroup, type[0], sel_stack('0'))
      .centerBar(true)
      .brushOn(false)      
      .x(d3.time.scale().domain([minDate, maxDate]))            
      //.yAxisPadding()
      .elasticY(true)
      .round(d3.time.day.round)
      .alwaysUseRounding(true)
      .xUnits(function(){return 8;})      
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
        el.style.display = 'none';z
        el.offsetHeight;
        el.style.display ='block';

        document.getElementById('chart1').remove();*/        
        d3.select("#test").select("svg").remove();
        d3.select("#load").select("svg").remove();
        d3.select("#sankey").select("svg").remove();
        /*document.createElement('chart1');*/
        console.log(d.x);
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

function makeData(result){
  var node={}, nodes = [], line = {}, lines = [], req={},  last = {}, lineNode = {}, id={};
 var colors=['#FF0000', '#FF5E00', '#FFBB00', '#FFE400', '#ABF200', '#1DDB16', '#00D8FF', '#0054FF', '#0100FF', '#5F00FF',
                    '#FF00DD', '#FF007F', '#FFA7A7', '#FFE08C', '#CEF279', '#B2EBF4', '#B5B2FF', '#FFB2F5', '#CC723D', '#008299'];  
 var reqCnt = 0, nodeCnt = 0, lineCnt = 0, lineNodeCnt = 0, idCnt = 0;        
 var nodeNo = 0;
 var nodeList = [];
 result.forEach(function(d) {        
    var a = d._source.request.split('?');                         
    var c = a[0].split('.');    
    if(c[c.length-1]!='js'&&c[c.length-1]!='css'&&c[c.length-1]!='png'&&c[c.length-1]!='woff'&&c[c.length-1]!='json'&&c[c.length-1]!='jsp'&&c[c.length-1]!='jspa'&&c[c.length-1]!='ico'&&c[c.length-1]!='svg'&&c[c.length-1]!='gif'){     
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
   });

 var json = {"nodes" :nodes, "links" : lines };
 drawSankey({rtnData : json, id : id});
}


function drawSankey(data){    
  console.log(data);
  
  console.log(data.id);
  var colors = data.id;
  /*var json = JSON.parse(data.rtnData); 
  console.log(json);*/
    var chart = d3.select("#sankey").append("svg").chart("Sankey.Path");
   chart
      .name(label)
      .colorNodes(function(name, node) {
        return color(node, 1) || colors.fallback;
      })
      .colorLinks(function(link) {
        return color(link.source, 4) || color(link.target, 1) || colors.fallback;
      })
      .nodeWidth(15)
      .nodePadding(10)
      .spread(true)
      .iterations(0)
      .draw(data.rtnData);
    function label(node) {
      return node.name.replace(/\s*\(.*?\)$/, '');
    }
    
    function color(node, depth) {
      var id = node.id.replace(/(_score)?(_\d+)?$/, '');
      if (colors[id]) {
        return colors[id];
      } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
        return color(node.targetLinks[0].source, depth-1);
      } else {
        return null;
      }
    }
};