$(document).ready(function() {
  var dateFormat = 'YYYY-MM-DD HH:mm:ss';    
  $('#baseTime').val(moment().seconds(0).subtract(parseInt($('#gap').val())-1,'minutes').format(dateFormat));
  $('#baseTime').datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss'
  });
  var start = new Date().getTime()-60*1000;  
  getData();
  $('#btn_search').click(function() {
    getData();
  });
});

function checkTimeGap() {
  var gap = parseInt($('#gap').val());
  var now = new Date().getTime();
  var base = new Date($('#baseTime').val()).getTime();  
  if(now-base < gap*60*1000){    
    var dateFormat = 'YYYY-MM-DD HH:mm:ss';   
    $('#baseTime').val(moment().seconds(0).subtract(parseInt($('#gap').val())-1,'minutes').format(dateFormat)); 
  }
}

var chartData = {};
var vList = ["overall_oee", "availability", "performance", "quality"];
function getData() {  
  var data = { start : $('#baseTime').val(), gap : $('#gap').val()};    
  if(data.gap === '1'||data.gap === '5'||data.gap === '10'){    
    var in_data = { url : "/timeseries/restapi/getTimeseries", type : "GET", data : data };
  } else {
    var in_data = { url : "/timeseries/restapi/getGapTimeseries", type : "GET", data : data };      
  } 
  ajaxTypeData(in_data, function(result){      
    if (result.rtnCode.code == "0000") {      
      chartData = result.rtnData;
      drawChart01();
      drawChart02();
      drawChart03();
      drawChart04();
    } 
  });
}

function drawChart01(){  
  d3.select("#ts-chart01").select("svg").remove();
  var id = $('#cid1').val().split('_');
  var data = chartData[id[0]][id[1]];
  if(data != undefined) {        
    var chartName = '#ts-chart01';
    chart01 = d3.timeseries()          
      .width($(chartName).parent().width()-25)
      .height(270)      
      .margin.left(0);    

    for(i=0; i<vList.length; i++) {
      chart01.addSerie(data,{x:'dtSensed',y:vList[i]},{interpolate:'linear'});
    }  
    chart01(chartName);
  }
}

function drawChart02(){
  d3.select("#ts-chart02").select("svg").remove();
  var id = $('#cid2').val().split('_');
  var data = chartData[id[0]][id[1]];  
  if(data != undefined) {
    var chartName = '#ts-chart02';    
    chart02 = d3.timeseries()          
      .width($(chartName).parent().width()-25)
      .height(270)      
      .margin.left(0);    
    for(i=0; i<vList.length; i++) {
      chart02.addSerie(data,{x:'dtSensed',y:vList[i]},{interpolate:'linear'});
    }
    chart02(chartName);
  }
}

function drawChart03(){
  d3.select("#ts-chart03").select("svg").remove();
  var id = $('#cid3').val().split('_');
  var data = chartData[id[0]][id[1]];    
  if(data != undefined) {
    var chartName = '#ts-chart03';  
    chart03 = d3.timeseries()          
      .width($(chartName).parent().width()-25)
      .height(270)      
      .margin.left(0);    
    for(i=0; i<vList.length; i++) {
      chart03.addSerie(data,{x:'dtSensed',y:vList[i]},{interpolate:'linear'});
    }  
    chart03(chartName);
  }
}

function drawChart04(){
  d3.select("#ts-chart04").select("svg").remove();
  var id = $('#cid4').val().split('_');  
  var data = chartData[id[0]][id[1]];
  if(data != undefined) {
    var chartName = '#ts-chart04';  
    chart04 = d3.timeseries()          
      .width($(chartName).parent().width()-25)
      .height(270)      
      .margin.left(0);    
    for(i=0; i<vList.length; i++) {
      chart04.addSerie(data,{x:'dtSensed',y:vList[i]},{interpolate:'linear'});
    }
    chart04(chartName);
  }
}

