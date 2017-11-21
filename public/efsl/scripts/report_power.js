$(document).ready(function() {               
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().subtract(2, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));      
  drawChart();
  $('#btn_search').click(function() {          
    drawChart();
  });
});      

function drawChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  var data = { sdate : sdate, edate :edate };
  var in_data = { url : "/reports/restapi/getRangePowerData", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){        
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;              
      drawPower(data, sdate, edate);
    }
  });
}

function drawPower(data, sdate, edate) {
  var powerSum = dc.barChart('#powerSum');
  var weekPlot = dc.boxPlot('#weekPlot');
  var timeBar = dc.barChart('#timeBar');
  var volLine = dc.compositeChart('#volLine');

  var minDate = new Date(sdate);  
  var maxDate = new Date(edate);  

  var msHour = 1000*60*60;
  var gap = (maxDate-minDate)/(24 * msHour);
  var maxCnt = 0;
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

// Dimension by today
  var todayDim = nyx.dimension(function (d) { 
    return d3.time.day(new Date(d.event_time)); });
  var powerSumGroup = todayDim.group().reduceSum(function(d) {
    return d.active_power;
  });

// Dimension by Week
  var weekDim = nyx.dimension(function(d) {  
    return  week[new Date(d.event_time).getDay()]; });
  var weekPlotGroup = weekDim.group().reduce(
    function(p, v) {
      p.push(v.active_power);
      return p;
    }, function(p, v) {
      p.splice(p.indexOf(v.active_power), 1);
      return p;
    }, function() {
      return [];
    }  
  );

  // Dimension by hour
  var timeDim = nyx.dimension(function(d) {       
    return new Date(d.event_time).getHours();  });
  var timeBarGroup = timeDim.group().reduce(
    function(p, v) {
      p.cnt++;
      p.sum += v.active_power;
      p.avg = p.sum/p.cnt;
      return p;
    }, function(p, v) {
      p.cnt--;
      p.sum -= v.active_power;
      p.avg = p.sum/p.cnt;
      return p;
    }, function() {
     return { cnt:0, sum:0, avg:0 };
    }
  );

var hourDim = nyx.dimension(function(d) { return d3.time.hour(new Date(d.event_time)); });
var volLineGroup = hourDim.group().reduce(
  function(p, v) {
    p.cnt++;
    p.sum += v.voltage;
    p.avg = p.sum/p.cnt;
    return p;
  }, function(p, v) {
    p.cnt--;
    p.sum -= v.voltage;
    p.avg = p.sum/p.cnt;
    return p;
  }, function() {
    return { cnt:0, sum:0, avg:0 };
  }
);


  /*  dc.barChart("#volumeMax")  */
powerSum
  .width(window.innerWidth*0.4)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 15, right: 50, bottom: 40, left: 70})
  .transitionDuration(500)
  .dimension(todayDim)
  .group(powerSumGroup)
  .brushOn(true)
  .centerBar(true)
  .gap(gap)
  .x(d3.time.scale().domain([minDate, maxDate]))
  .round(d3.time.days.round)
  .alwaysUseRounding(true)
  .renderHorizontalGridLines(true)
  .xUnits(d3.time.days);

  weekPlot
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 10, right: 50, bottom: 40, left: 70})
    .dimension(weekDim)
    .group(weekPlotGroup)
      .y(d3.scale.linear().domain([0, 200]))
      .x(d3.scale.ordinal().domain(week));

  timeBar
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 10, right: 50, bottom: 40, left: 50})
    .dimension(timeDim)
    .group(timeBarGroup)
    .gap(8)
    .x(d3.scale.linear().domain([0, 24]))
    .y(d3.scale.linear().domain([0, 200]))
    .alwaysUseRounding(true)
    .renderHorizontalGridLines(true)  
    .valueAccessor(function (d){  return d.value.avg;   })
    .title(function(d) {    return "\nNumber of Povetry: " + d.key;    });

    var vol = 0;
  volLine
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 40, right: 20, bottom: 40, left: 40})
    .transitionDuration(100)
    .dimension(hourDim)    
    .x(d3.time.scale().domain([minDate, maxDate ]))
    .round(d3.time.hour.round)
    .xUnits(d3.time.hours)
    .y(d3.scale.linear().domain([150, 280]))
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .mouseZoomable(true)
    .legend(dc.legend().x(100).y(10).itemHeight(13).gap(10).horizontal(true))    
    .title(function(d) {
        return "\n"+d.key+" : " + d.value.avg;
      })
    .compose([
      dc.lineChart(volLine).group(volLineGroup, "voltage")
        .valueAccessor(function (d) {  return d.value.avg;  })
        .colors('green'),
      dc.lineChart(volLine).group(volLineGroup, "Min")
        .valueAccessor(function (d) {  return 200;  })
        .colors('blue')
        .dashStyle([5,5]),
      dc.lineChart(volLine).group(volLineGroup, "Max")
        .valueAccessor(function (d) {  return 240;  })
        .colors('red')
        .dashStyle([5,5]),
    ])
  dc.renderAll();
}