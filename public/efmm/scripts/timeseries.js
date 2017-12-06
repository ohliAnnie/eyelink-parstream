$(document).ready(function() {
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().subtract(0, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));
  // time series char를 그린다.
  getData();

  $('#btn_search').click(function() {
    getData();
  });
});

function getData() {
  var dateFormat = 'YYYY-MM-DD';
  var rawData = [  
  { index : 0, date : moment().subtract(6, 'days').format(dateFormat), oee : 88, availability : 93, performance : 97, quality : 99},
  { index : 1, date : moment().subtract(5, 'days').format(dateFormat), oee : 76, availability : 90, performance : 84, quality : 99},
  { index : 2, date : moment().subtract(4, 'days').format(dateFormat), oee : 81, availability : 89, performance : 91, quality : 99},
  { index : 3, date : moment().subtract(3, 'days').format(dateFormat), oee : 83, availability : 90, performance : 93, quality : 99},
  { index : 4, date : moment().subtract(2, 'days').format(dateFormat), oee : 77, availability : 88, performance : 87, quality : 99},
  { index : 5, date : moment().subtract(1, 'days').format(dateFormat), oee : 81, availability : 91, performance : 89, quality : 99},
  { index : 6, date : moment().format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99}];
  drawTimeseries(rawData);
}

function drawTimeseries(data) {
  console.log(data);
  d3.selectAll("svg").remove();

  var chartName = '#ts-chart01';
  var vList = ["availability", "performance"];    
  drawChart01(data, chartName, 'index', vList);
  chart01(chartName);

  var chartName = '#ts-chart02';
  chart02 = d3.timeseries()
    .addSerie(data,{x:'index',y:'als_level'},{interpolate:'step-before'})
    .addSerie(data,{x:'index',y:'dimming_level'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart02(chartName);

  chartName = '#ts-chart03';
  chart03 = d3.timeseries()
    .addSerie(data,{x:'index',y:'noise_decibel'},{interpolate:'step-before'})
    .addSerie(data,{x:'index',y:'noise_frequency'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart03(chartName);

  chartName = '#ts-chart04';
  chart04 = d3.timeseries()
    .addSerie(data,{x:'index',y:'vibration_x'},{interpolate:'linear'})
    .addSerie(data,{x:'index',y:'vibration_y'},{interpolate:'step-before'})
    .addSerie(data,{x:'index',y:'vibration_z'},{interpolate:'linear'})
    .addSerie(data,{x:'index',y:'vibration'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart04(chartName);

}


function drawChart01(chart, data, chartName, xValue, vList){
  chart01 = d3.timeseries()    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);    
  for(i=0; i<vList.length; i++) {
    chart01.addSerie(data,{x:xValue,y:vList[i]},{interpolate:'linear'});
  }
}

function drawChart02(chart, data, chartName, xValue, vList){
  chart02 = d3.timeseries()    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);    
  for(i=0; i<vList.length; i++) {
    chart02.addSerie(data,{x:xValue,y:vList[i]},{interpolate:'linear'});
  }
}


function drawChart03(chart, data, chartName, xValue, vList){
  chart03 = d3.timeseries()    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);    
  for(i=0; i<vList.length; i++) {
    chart03.addSerie(data,{x:xValue,y:vList[i]},{interpolate:'linear'});
  }
}

function drawChart04(chart, data, chartName, xValue, vList){
  chart04 = d3.timeseries()    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);    
  for(i=0; i<vList.length; i++) {
    chart04.addSerie(data,{x:xValue,y:vList[i]},{interpolate:'linear'});
  }
}