function drawChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  $.ajax({
    url: "/dashboard/restapi/getTbRawDataByPeriod" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;
        // console.log(data);
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

  d3.selectAll("svg").remove();

  // 데이터 가공
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  data.forEach(function(d) {
    d.event_time = df.parse(d.event_time);
    d.ampere = d.ampere === undefined? 0:d.ampere;
    console.log('als_level : ' + d.als_level);
    console.log(d.als_level === '');
    d.als_level = d.als_level === ''? 0:d.als_level;
    d.dimming_level = d.dimming_level === ''? 0:d.dimming_level;
    d.noise_frequency = d.noise_frequency === ''? 0:d.noise_frequency;
    d.vibration_x = d.vibration_x === ''? 0 : d.vibration_x;
    d.vibration_y = d.vibration_y === ''? 0 : d.vibration_y;
    d.vibration_z = d.vibration_z === ''? 0 : d.vibration_z;
  });

  // console.log(data);

  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(data,{x:'event_time',y:'active_power'},{interpolate:'linear'})
    .addSerie(data,{x:'event_time',y:'ampere'},{interpolate:'step-before'})
    .addSerie(data,{x:'event_time',y:'amount_active_power'},{interpolate:'linear'})
    // .xscale.tickFormat(d3.time.format("%b %d"))
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



