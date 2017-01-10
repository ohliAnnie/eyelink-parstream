function drawChart() {
/*  var searchDate = $('#daterange').val()
  console.log('daterange : ' + searchDate);

  var ind = searchDate.indexOf(' - ');
  var sdate = searchDate.substring(0, ind);
  var edate = searchDate.substring(ind+3);
  console.log('%s, %s', sdate, edate);  */
  var sdate = moment().subtract(45, 'days').format('YYYY-MM-DD');
  var edate = moment().subtract(40, 'days').format('YYYY-MM-DD');
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
  var dayCount = dc.barChart('#dayCount');
  var groupCount = dc.pieChart('#groupCount');

  var minDate = new Date(sdate);  
  var maxDate = new Date(edate);

  var group_id = new Array();

  var msHour = 1000*60*60;
  var gap = (maxDate-minDate)/(24 * msHour);
  var maxCnt = 0;
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

   // 데이터 가공
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var timeFormat = d3.time.format.utc("%H:%M");
  data.forEach(function(d) {    
       var group = d.node_id.split('.');    
    d.group_id = group[0];
    var index = 0;
    while(index <= group_id.length) {
      if(group_id.length === 0) {
        group_id[0] = d.group_id;
        console.log(group_id);
      }
      if(group_id[index] === d.group_id) {
        break;
      }
      if(index === (group_id.length)){
        group_id[index] = d.group_id;
        break;
      }
      index++;
    }
    var a = d.event_time.split(" ");
    var b = a[1].split(":");
    d.event_time = df.parse(d.event_time);
    d.today = d3.time.day(d.event_time);        
    d.week = week[d.event_time.getDay()];
    d.time = parseInt(b[0]);
    d.hour = d3.time.hour(d.event_time);    
    d.active_power = parseFloat(d.active_power);
    d.amount_active_power = parseFloat(d.amount_active_power);
    d.voltage = parseFloat(d.voltage);     
  });


  var nyx = crossfilter(data);
  var all = nyx.groupAll();

// Dimension by today
  var todayDim = nyx.dimension(function (d) {   return d.today;   });
  var powerSumGroup = todayDim.group().reduceCount(function(d) {
    console.log(d);
    return 1;
  });

// Dimension by Node_ID
  var zoneDim = nyx.dimension(function(d) {       
    return d.group_id; });
  var zonePieGroup = zoneDim.group().reduceCount(function(d) {
    return 1;
  });

   /* dc.barChart('#dayCount') */
  dayCount
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 15, right: 50, bottom: 40, left: 40})
    .transitionDuration(500)
    .dimension(todayDim)
    .group(powerSumGroup)
    .elasticY(true)
    .brushOn(true)
    .centerBar(true)
    .gap(gap)         
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.days.round)
    .alwaysUseRounding(true)
    .renderHorizontalGridLines(true)
    .xUnits(d3.time.days);

  /* dc.pieChart('#groupCount') */
groupCount
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .radius((window.innerWidth*0.4)*0.2)
    .dimension(zoneDim)
    .group(zonePieGroup)    
    .drawPaths(true)
    .legend(dc.legend())    
    .renderLabel(true)
    .colors(d3.scale.ordinal().range(["#EDC951", "#CC333F", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399", "#FFB2F5"]));


  dc.renderAll();
}