function getData(){
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var sindex =new Date(new Date(sdate).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  var index = [], cnt = 0;
  for(i=sindex.getTime(); i < new Date(edate).getTime()+24*60*60*1000; i+=24*60*60*1000){    
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = "filebeat_jira_access-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  console.log(index);
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';
  var e = new Date(edate).toString().split(' ' );
  var lte = e[3]+'-'+mon[e[1]]+'-'+e[2]+'T15:00:00.000Z';
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
  var minDate = new Date(new Date(sdate+' 00:00:00').getTime()-24*60*60*1000);
  var maxDate = new Date(edate+' 24:00:00');
  var minTime = new Date(sdate + ' 00:00:00');
  var maxTime = new Date(edate+' 23:00:00');
  var gap =(maxDate.getTime() - minDate.getTime())/24*60*60*1000;
  var countBar = dc.barChart("#countBar");
  var typePie = dc.pieChart("#typePie");
  var hourLine = dc.lineChart("#hourLine");
  var weekLine = dc.lineChart("#weekLine");  
  var monLine = dc.lineChart("#monLine");  

  var data = [], geo = [];
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var month = ['Jan', 'Feb' , 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  rtnData.forEach(function(d){        
   var t = d._source.timestamp.split(' ');               
    t = t[0].split(':');
    var s = t[0].split('/');   
    d._source.timestamp = new Date(new Date(s[2]+'-'+mon[s[1]]+'-'+s[0]+'T'+t[1]+':'+t[2]+':'+t[3]).getTime() + 9*60*60*1000);
    d._source.day = d3.time.day(d._source.timestamp);
    d._source.hour = d._source.timestamp.getHours();
    d._source.week = week[d._source.timestamp.getDay()];    
    d._source.mon = month[d._source.timestamp.getMonth()];    
    data.push(d._source);    
    geo.push({type : d._source.response, geo : d._source.geoip.latitude+','+d._source.geoip.longitude});
  });
  console.log(geo);
  //drawMarkerSelect(geo);

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var dayDim = nyx.dimension(function(d) {
    return d.day;
  });

  var barGroup = dayDim.group().reduceCount(function(d) {
    return 1;
  });

  var typeDim = nyx.dimension(function(d) {    
    return d.response;
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

  var monDim = nyx.dimension(function(d) {    
    return d.mon; 
  });

  var monGroup = monDim.group().reduceCount(function(d) {
    return 1;
  });

   countBar
    .width(window.innerWidth*0.45)
    .height(390)
    .x(d3.time.scale().domain([minDate, maxDate]))    
    .xUnits(function(){return 20;})    
    .dimension(dayDim)
    .group(barGroup)
    .elasticY(true)
    .brushOn(true)
    .mouseZoomable(true)
    .centerBar(true)
    
    .clipPadding(20);

  typePie
    .width(window.innerWidth*0.45)
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
    .width(window.innerWidth*0.45)
    .height(390)
    .x(d3.scale.linear().domain([0,24]))
    .elasticY(true)    
    .renderArea(true)
    .brushOn(false)
    .renderDataPoints(true)        
    .dimension(hourDim)
    .group(hourGroup);

  weekLine
    .width(window.innerWidth*0.45)
    .height(390)
    .xUnits(dc.units.ordinal)
    .x(d3.scale.ordinal().domain(week))
    .elasticY(true)    
    .brushOn(false)
    .renderDataPoints(true)                
    .dimension(weekDim)
    .group(weekGroup);

  monLine
    .width(window.innerWidth*0.45)
    .height(390)
    .xUnits(dc.units.ordinal)
    .x(d3.scale.ordinal().domain(month))
    .elasticY(true)
    .renderDataPoints(true)        
    .renderArea(true)
    .brushOn(false)        
    .dimension(monDim)
    .group(monGroup);

  dc.renderAll();
}

 function drawMarkerSelect(data) {
  var xf = crossfilter(data);
  var groupname = "marker-select";
  var facilities = xf.dimension(function(d) { return d.geo; });
  var facilitiesGroup = facilities.group().reduceCount();
  var marker = dc_leaflet.markerChart("#demo1 .map",groupname)
  .dimension(facilities)
  .group(facilitiesGroup)
  .width(600)
  .height(400)
  .center([42.69,25.42])
  .zoom(7)
  .cluster(true);
  
  dc.renderAll(groupname);
  return {marker: marker};
  }