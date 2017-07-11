function getData(){
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var sindex =new Date(new Date(s[0], parseInt(s[1])-1, s[2]).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  console.log(sindex);
  var index = [], cnt = 0;
  var e = edate.split('-');
  for(i=sindex.getTime(); i < new Date(e[0], parseInt(e[1])-1, e[2]).getTime()+24*60*60*1000; i+=24*60*60*1000){    
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = "filebeat_jira_access-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  console.log(index);
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';  
  var lte = edate+'T15:00:00.000Z';
  $.ajax({
    url: "/reports/restapi/getAccessError" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte , lte : lte},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {        
        drawChart(result.rtnData, sdate, edate);        
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
function drawChart(rtnData, sdate, edate) {
  var s = sdate.split('-');
  var minDate = new Date(new Date(s[0], parseInt(s[1])-1, s[2], 0, 0, 0).getTime()-24*60*60*1000);
  var e = edate.split('-');
  var maxDate = new Date(e[0], parseInt(e[1])-1, e[2], 24, 0, 0);
  var minTime = new Date(s[0], parseInt(s[1])-1, s[2], 0, 0, 0);
  var maxTime = new Date(e[0], parseInt(e[1])-1, e[2], 23, 0, 0);
  var gap =(maxDate.getTime() - minDate.getTime())/24*60*60*1000;

  var marker = dc_leaflet.markerChart(".map");
  var countBar = dc.barChart("#countBar");
  var typePie = dc.pieChart("#typePie");
  var hourLine = dc.lineChart("#hourLine");
  var weekLine = dc.lineChart("#weekLine");  
  var monLine = dc.lineChart("#monLine");  
  
  var monthNameFormat = d3.time.format("%b-%Y");

  var data = [], geo = [];
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var month = ['Jan', 'Feb' , 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  rtnData.forEach(function(d){        
   var t = d._source.timestamp.split(' ');               
    t = t[0].split(':');
    var s = t[0].split('/');       
    d._source.timestamp = new Date(new Date(s[2], parseInt(mon[s[1]])-1, s[0], t[1], t[2], t[3]).getTime() + 9*60*60*1000);
    var day = d3.time.day(d._source.timestamp);
    var hour = d._source.timestamp.getHours();
    var weekly = week[d._source.timestamp.getDay()];    
    var weekNum = d._source.timestamp.getDay();    
    var monthly = d._source.timestamp.getMonth();
    var type =  d._source.response;
    var geo = d._source.geoip.latitude+','+d._source.geoip.longitude;
    data.push({ timestamp : d._source.timestamp, day : day, hour : hour, week : weekly, weekNum : weekNum, mon : monthly, type : type, geo : geo });
  });

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var facilities = nyx.dimension(function(d) { return d.geo; });
  var facilitiesGroup = facilities.group().reduceCount();

  var dayDim = nyx.dimension(function(d) {
    return d.day;
  });

  var barGroup = dayDim.group().reduceCount(function(d) {
    return 1;
  });

  var typeDim = nyx.dimension(function(d) {    
    return d.type;
  });
  var pieGroup = typeDim.group().reduceCount(function(d) {
    return 1;
  });

  var hourDim = nyx.dimension(function(d) {
    return d.hour
  });

  var hourGroup = hourDim.group().reduceCount(function(d) {
    return 1;
  });

  var weekDim = nyx.dimension(function(d) {    
    return d.week; 
  });

  var weekGroup = weekDim.group().reduceCount(function(d) {
    return 1;
  });

  var wNumDim = nyx.dimension(function(d){        
    return d.weekNum;
  });

  var wNumGroup = wNumDim.group().reduceCount(function(d) {
    return 1;
  });

  var monDim = nyx.dimension(function(d) {     
    return d.mon;
  });

  var monGroup = monDim.group().reduceCount(function(d) {
    return 1;
  });

     countBar
    .width(window.innerWidth*0.44)
    .height(390)
    .x(d3.time.scale().domain([minDate, maxDate]))    
    .xUnits(function(){return 20;})    
    .round(d3.time.day.round)
    .alwaysUseRounding(true)
    .dimension(dayDim)
    .group(barGroup)
    .elasticY(true)
    .brushOn(true)
    .mouseZoomable(true)
    .centerBar(true)
    
    .clipPadding(20);

  typePie
    .width(window.innerWidth*0.44)
    .height(400)
    .radius(160)
    .dimension(typeDim)
    .group(pieGroup)    
    .drawPaths(true)
    .legend(dc.legend())
    .label(function (d){      
      if(typePie.hasFilter() && !typePie.hasFilter(d.key)) {
        return '0(0%)';
      }
      var label = d.key;
      if(all.value()) {
        label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
      }
      return label;
    })
    .renderLabel(true)
    .colors(d3.scale.ordinal().range(["#FFB2F5", "#EDC951",  "#31a354", "#00D8FF", "#8041D9", "#CC333F", "#00A0B0", "#B5B2FF" ]));

  hourLine
    .width(window.innerWidth*0.44)
    .height(390)
    .x(d3.scale.linear().domain([0,23]))
    .elasticY(true)    
    .renderArea(true)
    .brushOn(true)
    .renderDataPoints(true)        
    .dimension(hourDim)
    .group(hourGroup);

  weekLine
    .width(window.innerWidth*0.44)
    .height(390)
    .x(d3.scale.linear().domain([0,6]))       
    .elasticY(true)    
    .brushOn(true)
    .renderDataPoints(true)                
    .dimension(wNumDim)
    .group(wNumGroup)
    .title(function(d){      
      return week[d.key]+' : '+d.value;
    });

  weekLine.xAxis().tickFormat(function(v) {return week[v];})  ;

  monLine
    .width(window.innerWidth*0.44)
    .height(390)
    .x(d3.scale.linear().domain([0,11]))             
    .elasticY(true)
    .renderDataPoints(true)        
    .brushOn(true)   
    .dimension(monDim)
    .group(monGroup)    
    .title(function(d){      
      return month[d.key]+' : '+d.value;
    });


  monLine.xAxis().tickFormat(function(v) {return month[v];})  ;

  marker
  .dimension(facilities)
  .group(facilitiesGroup)
  .width(window.innerWidth*0.44)
  .height(400)
  .center([37.467271, 127.042861])
  .zoom(11)
  .cluster(true);

  dc.renderAll();
  
}
