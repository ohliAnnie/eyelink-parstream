function drawChart() {
  var searchDate = $('#daterange').val()
  console.log('daterange : ' + searchDate);

  var ind = searchDate.indexOf(' - ');
  var sdate = searchDate.substring(0, ind);
  var edate = searchDate.substring(ind+3);
  console.log('%s, %s', sdate, edate);  
  $.ajax({
    url: "/reports/restapi/getTbRawDataByPeriodPower" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;        
        drawPower(data, sdate, edate);
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

function drawPower(data, sdate, edate) {
  var powerSum = dc.barChart('#powerSum');
  var weekPlot = dc.boxPlot('#weekPlot');
  var timePlot = dc.boxPlot('#timePlot');
  var volLine = dc.compositeChart('#volLine');

  var minDate = new Date(sdate);  
  var maxDate = new Date(edate);

  var msHour = 1000*60*60;
  var gap = (maxDate-minDate)/(24 * msHour);
  var maxCnt = 0;
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

   // 데이터 가공
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var timeFormat = d3.time.format.utc("%H:%M");
  data.forEach(function(d) {    
    var a = d.event_time.split(" ");
    var b = a[1].split(":");
    d.event_time = df.parse(d.event_time);
    d.today = d3.time.day(d.event_time);        
    d.week = week[d.event_time.getDay()];
    d.time = b[0];
    d.hour = d3.time.hour(d.event_time);    
  });

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

// Dimension by today
  var todayDim = nyx.dimension(function (d) { return d.today; });
  var powerSumGroup = todayDim.group().reduceSum(function(d) {
    return d.active_power;
  });

// Dimension by Week
  var weekDim = nyx.dimension(function(d) {  return d.week; });
  var weekPlotGroup = weekDim.group().reduce(
    function(p, v) {
      p.push(v.amount_active_power);
      return p;
    }, function(p, v) {
      p.splice(p.indexOf(v.amount_active_power), 1);
      return p;
    }, function() {
      return [];
    }  
  );

  // Dimension by hour
  var timeDim = nyx.dimension(function(d) { return d.time;  });
  var timePlotGroup = timeDim.group().reduce(
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

var hourDim = nyx.dimension(function(d) { return d.hour; });
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
  .xUnits(d3.time.days)

  weekPlot
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 10, right: 50, bottom: 30, left: 70})
    .dimension(weekDim)
    .group(weekPlotGroup)
    .x(d3.scale.ordinal().domain(week))    
    .xUnits(dc.units.ordinal)    
    .elasticY(true);

  timePlot
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(timeDim)
    .group(timePlotGroup)
    .x(d3.scale.linear().domain([0, 24]))
    .xUnits(d3.time.hours)
    .round(d3.time.hours.round)
    .y(d3.scale.linear().domain([0, 24]));

    var vol = 0;
  volLine
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 40, right: 20, bottom: 25, left: 40})
    .transitionDuration(100)
    .dimension(hourDim)    
    .x(d3.time.scale().domain([minDate, maxDate ]))
    .round(d3.time.hour.round)
    .xUnits(d3.time.hours)
    .y(d3.scale.linear().domain([180, 260]))
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .legend(dc.legend().x(100).y(10).itemHeight(13).gap(10).horizontal(true))
    .brushOn(false)
    .compose([
      dc.lineChart(volLine).group(volLineGroup, "voltage")
        .valueAccessor(function (d) {  return d.value.avg;  })
        .colors('yellow'),
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