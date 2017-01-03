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

  var minDate = new Date(sdate);  
  var maxDate = new Date(edate);

   // 데이터 가공
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  data.forEach(function(d) {    
    d.event_time = df.parse(d.event_time);
    d.today = d3.time.day(d.event_time);        
    d.week = d.event_time.getDay();
    console.log(d);
  });

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

// Dimension by today
  var todayDim = nyx.dimension(function (d) { return d.today; });
  var powerSumGroup = todayDim.group().reduceSum(function(d) {
    return d.active_power;
  });

// Dimension by Week
  var weekDim = nyx.dimension(function(d) { return d.week; });
  var weekPlotGroup = weekDim.group().reduce(
    function(p, v) {

    }, function(p, v) {

    }, function() {

    }  
  );

  /*  dc.barChart("#volumeMax")  */
powerSum
  .width(window.innerWidth*0.4)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 15, right: 50, bottom: 40, left: 40})
  .transitionDuration(500)
  .dimension(todayDim)
  .group(powerSumGroup)
  .brushOn(true)
  .centerBar(true)
  .gap(5)
  .x(d3.time.scale().domain([minDate, maxDate]))
  .round(d3.time.days.round)
  .alwaysUseRounding(true)
  .renderHorizontalGridLines(true)
  .xUnits(d3.time.days)

  weekPlot
    .width(768)
    .height(480)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(weekDim)
    .group(weekPlotGroup)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.day.round)
    .xUnits(d3.time.days)
    .elasticY(true);

  dc.renderAll();
}