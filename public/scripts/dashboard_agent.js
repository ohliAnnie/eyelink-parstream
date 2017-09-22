function getAgentData(){
 var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
 var yDay = new Date(new Date().getTime() - 24*60*60*1000);
 var y = yDay.toString().split(' ');
 var d = new Date().toString().split(' '); 
 var data = { index : "elagent_test-agent-*", type : "ApplicationLinkData",
 			  start : y[3]+"-"+mon[y[1]]+"-"+y[2]+"T15:00:00", id : "startTime" };
 $.ajax({
    url: "/dashboard/restapi/getAgentMap" ,
    dataType: "json",
    type: "get",
    data: data,
    success: function(result) {            
      if (result.rtnCode.code == "0000") {              
      	var elseJson = { nodes : result.nodes, edges : result.edges };      
        console.log(elseJson);
        getServerMap(elseJson);    
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
    url: "/dashboard/restapi/getAgentData" ,
    dataType: "json",
    type: "get",
    data: data,
    success: function(result) {            
      if (result.rtnCode.code == "0000") {                      
        console.log(result.rtnData);        
        summaryAgent(result.data, result.start, result.end);
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

function drawDashAgent(data, start, end){

}

function summaryAgent(data, start, end) {    
  var chart = dc.barChart("#test");
  var load = dc.barChart("#load");
 
  var timeformat = d3.time.format('%m-%d %H:%M');
  
  if((end-start)<60*60*1000){
    start -= 30*60*1000;
    end += 30*60*1000;
  }
  
  var minDate = new Date(start); 
  var maxDate = new Date(end);
  console.log(minDate, maxDate);  
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

function displayCountAgent() {      
  var indexs = "elagent_test-agent-";
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var day = new Date();
  var d = day.toString().split(' ');  
  var pday = new Date(day.getTime() - 24*60*60*1000);
  var p = pday.toString().split(' ')
  var today = p[3]+"-"+mon[p[1]]+"-"+p[2]+'T15:00:00';
  var wday = new Date(day.getTime() - 7*24*60*60*1000);
  var w = wday.toString().split(' ');
  var week = w[3]+"-"+mon[w[1]]+"-"+w[2]+'T15:00:00';
  var mday = new Date(day.getTime() - parseInt(d[2])*24*60*60*1000);
  var m = mday.toString().split(' ');
  var month = m[3]+"-"+mon[m[1]]+"-"+m[2]+'T15:00:00';
  pday = new Date(pday);      
    $.ajax({
    url: "/dashboard/restapi/countAgent",
    dataType: "json",
    type: "GET",    
    data: { index: indexs+"*", type :  "ApplicationLinkData"
    , start : today, id : "startTime"},
    success: function(result) {
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
         $('#dayCnt').text(result.rtnData);               
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

  $.ajax({
    url: "/dashboard/restapi/countAgent",
    dataType: "json",
    type: "GET",    
    data: { index: indexs+"*", type :  "ApplicationLinkData"
    , start : month, id : "startTime"},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
        $('#monCnt').text(result.rtnData);        
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
 
   $.ajax({
    url: "/dashboard/restapi/countAgentError",
    dataType: "json",
    type: "GET",    
    data: { index: indexs+"*", type :  "ApplicationLinkData"
    , start : today, id : "startTime"},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
         $('#errCnt').text(result.rtnData);                       
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

  $.ajax({
    url: "/dashboard/restapi/getAgentOneWeek",
    dataType: "json",
    type: "GET",    
    data: { index: indexs+"*", type :  "ApplicationLinkData"
    , start : week, id : "startTime"},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        //- $("#successmsg").html(result.message);        
        console.log(result);
        drawAgentWeekly(result.rtnData);
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

function drawAgentWeekly(data) {
  console.log(data);
  var markerName = "dashboardChart";
  var volumeChart = dc.barChart('#volumn-chart', markerName);

    var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
    var df = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ');
    var numberFormat = d3.format('.2f');
    var maxDate = new Date();
    var minDate  = addDays(new Date(), -20);

    // for Test
    maxDate = new Date(new Date().getTime());
    minDate = new Date(new Date().getTime()-7*24*60*60*1000-12*60*60*1000);
    
    // console.log(data);
    var ndx = crossfilter(data);

    var moveDays = ndx.dimension(function (d) {    
      return d3.time.day(new Date(d.day));
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
       
    
        d3.select("#test").select("svg").remove();
        d3.select("#load").select("svg").remove();
        d3.select("#sankey").select("svg").remove();
        //d3.select("#cy").select("svg").remove();
        /*document.createElement('chart1');*/
        console.log(d.x);
        makeDatabyDay(d.x);        
      });  
    });    
    dc.renderAll(markerName);
 
}