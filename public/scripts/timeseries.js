function drawChart() {
  var searchDate = $('#daterange').val()
  console.log('daterange : ' + searchDate);

  var ind = searchDate.indexOf(' - ');
  var sdate = searchDate.substring(0, ind);
  var edate = searchDate.substring(ind+3);
  console.log('%s, %s', sdate, edate);
  $.ajax({
    url: "/dashboard/restapi/getTbRawDataByPeriod" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        // TO-DO json data 수신 방식 점검 필요 by 배성한
        //- $("#successmsg").html(result.message);
        // for test
        // var data = [
        //   {date:new Date('2016-01-01'), als_level: 5, dimming_level: 5, power:120, noise:130, vibration:200},
        //   {date:new Date('2016-01-15'), als_level: 7, dimming_level: 1, power:100, noise:150, vibration:100},
        //   {date:new Date('2016-02-02'), als_level: 1, dimming_level: 3, power:150, noise:170, vibration:100},
        //   {date:new Date('2016-03-02'), als_level: 6, dimming_level: 7, power:200, noise:110, vibration:100},
        //   {date:new Date('2016-04-02'), als_level: 4, dimming_level: 5, power:157, noise:100, vibration:100},
        //   {date:new Date('2016-05-02'), als_level: 8, dimming_level: 0, power:50,  noise:150, vibration:100},
        //   {date:new Date('2016-06-02'), als_level: 9, dimming_level: 1, power:125, noise:150, vibration:100},
        //   {date:new Date('2016-07-02'), als_level: 2, dimming_level: 3, power:158, noise:150, vibration:300},
        //   {date:new Date('2016-08-02'), als_level: 6, dimming_level: 7, power:123, noise:150, vibration:100},
        //   {date:new Date('2016-09-02'), als_level: 7, dimming_level: 5, power:132, noise:50, vibration:100},
        //   {date:new Date('2016-10-02'), als_level: 8, dimming_level: 3, power:160, noise:150, vibration:100},
        //   {date:new Date('2016-11-02'), als_level: 5, dimming_level: 2, power:50 , noise:150, vibration:100},
        // ];
        console.log(data);
        var data = result.rtnData;
        console.log(data);
        drawTimeseries(data);
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

function drawTimeseries(data) {

  // 데이터 가공
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  data.forEach(function(d) {
    d.event_time = df.parse(d.event_time);
    d.ampere = d.ampere === undefined? 0:d.ampere;
    d.als_level = d.als_level === null?0:d.als_level;
    d.dimming_level = d.dimming_level === null?0:d.dimming_level;
    d.noise_frequency = d.noise_frequency === null?0:d.noise_frequency;
    d.vibration_x = d.vibration_x === null? 0 : d.vibration_x;
    d.vibration_y = d.vibration_y === null? 0 : d.vibration_y;
    d.vibration_z = d.vibration_z === null? 0 : d.vibration_z;
  });

  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(data,{x:'event_time',y:'active_power'},{interpolate:'linear'})
    .addSerie(data,{x:'event_time',y:'ampere'},{interpolate:'step-before'})
    // .addSerie(data,{x:'event_time',y:'active_power'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart01(chartName);

  var chartName = '#ts-chart02';
  chart02 = d3.timeseries()
    .addSerie(data,{x:'event_time',y:'als_level'},{interpolate:'step-before'})
    .addSerie(data,{x:'event_time',y:'dimming_level'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart02(chartName);

  chartName = '#ts-chart03';
  chart03 = d3.timeseries()
    .addSerie(data,{x:'event_time',y:'noise_decibel'},{interpolate:'step-before'})
    .addSerie(data,{x:'event_time',y:'noise_frequency'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart03(chartName);

  chartName = '#ts-chart04';
  chart04 = d3.timeseries()
    .addSerie(data,{x:'event_time',y:'vibration_x'},{interpolate:'linear'})
    .addSerie(data,{x:'event_time',y:'vibration_y'},{interpolate:'step-before'})
    .addSerie(data,{x:'event_time',y:'vibration_z'},{interpolate:'linear'})
    .addSerie(data,{x:'event_time',y:'vibration'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart04(chartName);

}



