$(document).ready(function() {
  var dateFormat = 'YYYY-MM-DD HH:mm:ss';  
  $('#baseTime').val(moment().subtract(parseInt($('#gap').val()),'minutes').format(dateFormat));
  //$('#sdate').val(moment().format(dateFormat));   
  var start = new Date().getTime()-60*1000;  
  //$('#datetimepicker').datetimepicker();
  // time series char를 그린다.
  
  getData();
  $('#btn_search').click(function() {
    getData();
  });
});

var chartData = {};
var vList = ["overall_oee", "availability", "performance", "quality"];
function getData() {  
  var data = { start : $('#baseTime').val(), gap : $('#gap').val()};  
  var in_data = { url : "/timeseries/restapi/getTimeseries", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    console.log(result)
    if (result.rtnCode.code == "0000") {      
      chartData = result.rtnData;
      drawChart01();
      drawChart02();
      drawChart03();
      drawChart04();
    } 
  });
  var dateFormat = 'YYYY-MM-DD';
  var rawData = [  
  { index : 0, date : moment().subtract(6, 'days').format(dateFormat), oee : 88, availability : 93, performance : 97, quality : 99},
  { index : 1, date : moment().subtract(5, 'days').format(dateFormat), oee : 76, availability : 90, performance : 84, quality : 99},
  { index : 2, date : moment().subtract(4, 'days').format(dateFormat), oee : 81, availability : 89, performance : 91, quality : 99},
  { index : 3, date : moment().subtract(3, 'days').format(dateFormat), oee : 83, availability : 90, performance : 93, quality : 99},
  { index : 4, date : moment().subtract(2, 'days').format(dateFormat), oee : 77, availability : 88, performance : 87, quality : 99},
  { index : 5, date : moment().subtract(1, 'days').format(dateFormat), oee : 81, availability : 91, performance : 89, quality : 99},
  { index : 6, date : moment().format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99}];
  //drawTimeseries(rawData);
}

function drawChart01(){  
  d3.select("#ts-chart01").select("svg").remove();
  var id = $('#cid1').val().split('_');
  var data = chartData[id[0]][id[1]];
  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);    
  for(i=0; i<vList.length; i++) {
    chart01.addSerie(data,{x:'dtSensed',y:vList[i]},{interpolate:'linear'});
  }  
  chart01(chartName);
}

function drawChart02(){
  d3.select("#ts-chart02").select("svg").remove();
  var id = $('#cid2').val().split('_');
  var data = chartData[id[0]][id[1]];
  var chartName = '#ts-chart02';    
  chart02 = d3.timeseries()    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);    
  for(i=0; i<vList.length; i++) {
    chart02.addSerie(data,{x:'dtSensed',y:vList[i]},{interpolate:'linear'});
  }
  chart02(chartName);
}

function drawChart03(){
  d3.select("#ts-chart03").select("svg").remove();
  var id = $('#cid3').val().split('_');
  var data = chartData[id[0]][id[1]];  
  console.log(id)
  console.log(data)
  var chartName = '#ts-chart03';  
  chart03 = d3.timeseries()    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);    
  for(i=0; i<vList.length; i++) {
    chart03.addSerie(data,{x:'dtSensed',y:vList[i]},{interpolate:'linear'});
  }  
  chart03(chartName);
}

function drawChart04(){
  d3.select("#ts-chart04").select("svg").remove();
  var id = $('#cid4').val().split('_');  
  var data = chartData[id[0]][id[1]];
  var chartName = '#ts-chart04';  
  chart04 = d3.timeseries()    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);    
  for(i=0; i<vList.length; i++) {
    chart04.addSerie(data,{x:'dtSensed',y:vList[i]},{interpolate:'linear'});
  }
  chart04(chartName);
}

