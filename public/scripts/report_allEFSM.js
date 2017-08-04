function drawChart() {
  var indexs = $('#indexs').val();
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var sindex =new Date(new Date(sdate).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(new Date(sdate), edate);
  var index = [], cnt = 0;
  for(i=sindex.getTime(); i < new Date(edate).getTime()+24*60*60*1000; i+=24*60*60*1000){    
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = indexs+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  console.log(index);
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';
  var e = new Date(edate).toString().split(' ' );
  var lte = e[3]+'-'+mon[e[1]]+'-'+e[2]+'T15:00:00.000Z';
  $.ajax({
    url: "/reports/restapi/getJiraAcc",
    dataType: "json",
    type: "get",
    data: { index :  index, gte : gte, lte : lte }, 
    success: function(result) {   
      if (result.rtnCode.code == "0000") {             
        console.log(sdate, edate);
        drawAll(result.rtnData, sdate, edate);
      } else {
        //- $("#errormsg").html(result.message);
      }
    }
  });
}

function drawAll(data, sdate, edate) {
  var pieChart = dc.pieChart('#pieChart');
  var countBar = dc.barChart('#countBar');
  var countLine = dc.compositeChart("#countLine");
  var serverCount = dc.barChart('#serverCount');

  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  var gap = (maxDate-minDate)/(24 * 60 * 60 * 1000);  
  var acc = [];
  var minTime = new Date(), maxTime = new Date('1990-01-01');
  var minDate = new Date(sdate);  
  var maxDate =  new Date(edate);
  console.log(minDate);
  console.log(maxDate);
  data.forEach(function(d) { 
    if(d._type == "access"){
         d._source.type = "jira";
    } 
    var t = d._source.timestamp.split(' ');               
    t = t[0].split(':');
    var s = t[0].split('/');   
    d._source.timestamp = new Date(new Date(s[2]+'-'+mon[s[1]]+'-'+s[0]+'T'+t[1]+':'+t[2]+':'+t[3]).getTime() + 9*60*60*1000);
    d._source.response = parseInt(d._source.response);     
    d._source.responsetime = parseInt(d._source.responsetime);
    d._source.day = d3.time.day(d._source.timestamp);
    d._source.hour = d3.time.hour(d._source.timestamp);
    if(d._source.response >= 400)  {
      d._source.section = 'error';
      d._source.index = 4;
    } else if(d._source.responsetime <= 1000) {
      d._source.section = '1s';
      d._source.index = 0;
    } else if(d._source.responsetime <= 3000) {
      d._source.section = '3s';
      d._source.index = 1;
    } else if(d._source.responsetime <= 5000) {
      d._source.section = '5s';
      d._source.index = 2;
    } else {
      d._source.section = 'slow';
      d._source.index = 3
    }    
    acc.push(d._source);
    if(minTime.getTime() > d._source.hour.getTime()){
      minTime = d._source.hour;
    }
    if(maxTime.getTime() < d._source.hour.getTime()){
      maxTime = d._source.hour;
    }
  });

  if(sdate == edate) {
    minDate = new Date(minTime.getTime()-30*60*1000);
    maxDate = new Date(maxTime.getTime()+30*60*1000);
  } else {
    minDate = new Date(minDate.getTime()-12*60*60*1000);
  }
  var nyx = crossfilter(acc);
  var all = nyx.groupAll();

  var sectionDim = nyx.dimension(function(d){
    return d.section;
  }); 

  var pieGroup = sectionDim.group().reduceCount(function(d){
    return 1;
  });
  if(sdate != edate) {    
    var dayDim = nyx.dimension(function(d){      
      return d.day;
    });
  } else {
    var dayDim = nyx.dimension(function(d) {                  
      return d.hour;
    });
  }

  var stackGroup = dayDim.group().reduce(function(p, v){
    p[v.index] = (p[v.index] || 0) + 1;    
    return p;
  }, function(p, v) {
    p[v.index] = (p[v.index] || 0) - 1;
    return p;
  }, function() {    return{};  });

  var errGroup = dayDim.group().reduce(
    function (p, v) {      
      if(v.section == "error") {    ++p.cnt ;      }      
      return p;
    },
    function (p, v) {      
      if(v.section == "error") {   -- p.cnt ;      }                  
      return p;
    },
    function() {      return { cnt:0 };    }
  );

  var slowGroup = dayDim.group().reduce(
    function (p, v) {      
      if(v.section == "slow") {   ++p.cnt ;     }      
      return p;
    },
    function (p, v) {
      if(v.section == "slow") {    -- p.cnt ;      }                  
      return p;
    },
    function() {      return { cnt:0 };    }
  );  

  var s1Group = dayDim.group().reduce(
    function (p, v) {      
      if(v.section == "1s") {   ++p.cnt ;      }      
      return p;
    },
    function (p, v) {   
      if(v.section == "1s") {   -- p.cnt ;      }                  
      return p;
    },
    function() {      return { cnt:0 };    }
  );

   var s3Group = dayDim.group().reduce(
    function (p, v) {      
      if(v.section == "3s") {    ++p.cnt ;      }      
      return p;
    },
    function (p, v) {     
      if(v.section == "3s") {    -- p.cnt ;      }                  
      return p;
    },
    function() {      return { cnt:0 };    }
  );

  var s5Group = dayDim.group().reduce(
    function (p, v) {      
      if(v.section == "5s") {   ++p.cnt ;      }      
      return p;
    },
    function (p, v) {      
      if(v.section == "5s") {   -- p.cnt ;      }                  
      return p;
    },
    function() {      return { cnt:0 };    }
  );

  var typeDim = nyx.dimension(function(d){    
    return d.type;
  });

  var typeGroup = typeDim.group().reduce(function(p, v){
    p[v.index] = (p[v.index] || 0) + 1;        
    return p;
  }, function(p, v) {
    p[v.index] = (p[v.index] || 0) - 1;
    return p;
  }, function() {    return{};  });

/* dc.pieChart('#eventChart') */
  pieChart 
    .width(window.innerWidth*0.45)
    .height(400)
    .radius(160)
    .dimension(sectionDim)
    .group(pieGroup)    
    .drawPaths(true)
    .legend(dc.legend())
    .label(function (d){
      if(pieChart.hasFilter() && !pieChart.hasFilter(d.key)) {
        return '0(0%)';
      }
      var label = d.key;
      if(all.value()) {
        label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
      }
      return label;
    })
    .renderLabel(true)
    .colors(d3.scale.ordinal().range(["#EDC951",  "#31a354", "#00A0B0", "#FFB2F5" , "#CC333F"]));

  var term = ['1s', '3s', '5s', 'slow', 'error'];
  countBar
    .width(window.innerWidth*0.43)
    .height(380)
    .margins({left: 65, top: 10, right: 10, bottom: 40})
    .brushOn(true)
    .transitionDuration(500)
    .clipPadding(20)
    .title(function(d) {
      for(var i=0; i<term.length; i++) {
        if(this.layer == term[i])                   
          return this.layer + ' : ' + d.value[i];
      }
    })      
    .dimension(dayDim)
    .group(stackGroup, term[0], sel_stack('0'))
    .mouseZoomable(true)
    .renderHorizontalGridLines(true)
    .x(d3.time.scale().domain([minDate, maxDate]))    
    .xUnits(function(){return 24;})
    .elasticY(true)
    .centerBar(true)
  //.gap(20)
    .colors(d3.scale.ordinal().range(["#EDC951",  "#31a354", "#00A0B0", "#FFB2F5" , "#CC333F"]));

  if(sdate == edate){
    countBar
    .round(d3.time.hour.round);
  } else {
    countBar
    .round(d3.time.day.round);
  }
    
  countBar.legend(dc.legend());
  
  dc.override(countBar, 'legendables', function() {
    var items = countBar._legendables();
    return items.reverse();    
  });

  for(var i = 1; i<term.length; ++i){
    countBar.stack(stackGroup, term[i], sel_stack(i));
  }  
    /*  dc.barChart('#eventBar')  */
  function sel_stack(i) {
      return function(d) {            
          return d.value[i]?d.value[i]:0;
      };
  }

  countLine
    .width(window.innerWidth*0.43)
    .height(380)
     .margins({top: 20, right: 20, bottom: 40, left: 120})
    .dimension(dayDim)
    .transitionDuration(500)
    .elasticY(true)
    .y(d3.scale.linear().domain([0, data.length]))      
    .brushOn(true)
    .mouseZoomable(true)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .y(d3.scale.linear().domain([0, 100]))
    .round(function(d) {
      if(edate == sdate) {
        return d3.time.hour.round;
      } else {
      return d3.time.day.round;
    }})
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true) 
    .title(function(d) {
      console.log(d);
      return "\nCount : " + d.value.cnt;
    })
    .legend(dc.legend().x(20).y(10).itemHeight(13).gap(5))
    .compose([
        dc.lineChart(countLine).group(errGroup, "error")
          .valueAccessor(function(d){
           return d.value.cnt; })
          .colors("#CC333F"),
        dc.lineChart(countLine).group(slowGroup, "slow")
          .valueAccessor(function(d){
            return d.value.cnt; })
          .colors("#FFB2F5"),
        dc.lineChart(countLine).group(s1Group, "1s")
          .valueAccessor(function(d){
            return d.value.cnt; })
          .colors("#EDC951"),
        dc.lineChart(countLine).group(s3Group, "3s")
          .valueAccessor(function(d){
            return d.value.cnt; })
          .colors('#31a354'),
        dc.lineChart(countLine).group(s5Group, "5s")
          .valueAccessor(function(d){
            return d.value.cnt; })
          .colors("#00A0B0")
      ]);

   if(sdate == edate) {
    countLine.rangeChart(countBar);
    countBar.rangeChart(countLine);
    } 
  var serverList = ["jira"];
  serverCount
    .width(window.innerWidth*0.43)
    .height(380)
    .margins({left: 65, top: 10, right: 10, bottom: 40})
    .brushOn(true)
    .transitionDuration(500)
    .clipPadding(30)
    .title(function(d) {
      for(var i=0; i<term.length; i++) {
        if(this.layer == term[i])                   
          return this.layer + ' : ' + d.value[i];
      }
    })      
    .dimension(typeDim)
    .group(typeGroup, term[0], sel_stack('0'))
    .mouseZoomable(true)
    .renderHorizontalGridLines(true)
    //.centerBar(true)
    .gap(serverList.length+20)             
    .x(d3.scale.ordinal().domain(serverList))     
    .xUnits(dc.units.ordinal)
    .colors(d3.scale.ordinal().range(["#EDC951",  "#31a354", "#00A0B0", "#FFB2F5" , "#CC333F"]));
    
  serverCount.legend(dc.legend());
  
  dc.override(serverCount, 'legendables', function() {
    var items = serverCount._legendables();
    return items.reverse();    
  });


  for(var i = 1; i<term.length; ++i){
    serverCount.stack(typeGroup, term[i], sel_stack(i));
  }  

  dc.renderAll();
}