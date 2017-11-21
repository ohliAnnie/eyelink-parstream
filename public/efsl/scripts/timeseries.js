$(document).ready(function() {
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().subtract(0, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));

  // time series char를 그린다.
  drawChart();

  $('#btn_search').click(function() {
    drawChart();
  });
});

function drawChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  var data = { sdate : sdate, edate :edate };
  var in_data = { url : "/timeseries/restapi/getRangeData", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){    
    if (result.rtnCode.code == "0000") {      
      var data = result.rtnData;            
      drawTimeseries(data);      
      console.log(data);
    } 
  });
}

function drawTimeseries(data) {

  d3.selectAll("svg").remove();

  // 데이터 가공
  var ampere = 0, active_power = 0, amount_of_active_power = 0;
  var als_level = 0, dimming_level = 0, noise_decibel = 0, noise_frequency = 0;
  var vibration_x = 0, vibration_y = 0, vibration_z = 0, vibration = 0;
  data.forEach(function(d) { 
    if(d.event_type == "1"){
     ampere = d.ampere; 
     active_power = d.active_power; 
     amount_of_active_power = d.amount_of_active_power; }
    if(d.event_type == "17"){
     als_level = d.als_level; 
     dimming_level = d.dimming_level; }
    if(d.event_type == "49"){ 
      noise_frequency = d.noise_frequency;
      noise_decibel = d.noise_frequency }
    if(d.event_type == "33"){
     vibration_x = d.vibration_x; 
     vibration_y = d.vibration_y; 
     vibration_z = d.vibration_z; 
     vibration = d.vibration; }
    d.event_time = new Date(d.event_time);
    d.ampere = ampere;
    d.active_power = active_power;
    d.amount_of_active_power = amount_of_active_power;
    d.als_level = als_level;
    d.dimming_level = dimming_level;
    d.noise_decibel = noise_decibel;
    d.noise_frequency = noise_frequency;
    d.vibration_x = vibration_x;
    d.vibration_y = vibration_y;
    d.vibration_z = vibration_z;
    d.vibration = vibration;
  });
  // console.log(data);

  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(data,{x:'event_time',y:'active_power'},{interpolate:'linear'})
    .addSerie(data,{x:'event_time',y:'ampere'},{interpolate:'step-before'})
    .addSerie(data,{x:'event_time',y:'amount_of_active_power'},{interpolate:'linear'})
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


