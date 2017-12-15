$(document).ready(function() {
  var dateFormat = 'YYYY-MM-DD HH:mm:ss';    
  $('#baseTime').val(moment().seconds(0).subtract(parseInt($('#gap').val())-1,'minutes').format(dateFormat));
  $('#baseTime').datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss'
  });
  /*document.getElementById("Status_all").value = 'true';
  $('#Running').prop('checked', true).change();
  $('#DownTime').prop('checked', true).change();
  $('#MealBreak').prop('checked', true).change();
  $('#ShortBreak').prop('checked', true).change();*/

  var start = new Date().getTime()-60*1000;  
  getData();
  $('#btn_search').click(function() {
    getData();
  });

/*  $("#Status_all").click(function(){        
    if($(this).attr('value')=='false'){
      document.getElementById("Status_all").value = 'true';
      $('#Running').prop('checked', true).change();
      $('#DownTime').prop('checked', true).change();
      $('#MealBreak').prop('checked', true).change();
      $('#ShortBreak').prop('checked', true).change();
    } else {
      document.getElementById("Status_all").value = 'false';
      $('#Running').prop('checked', false).change();
      $('#DownTime').prop('checked', false).change();
      $('#MealBreak').prop('checked', false).change();
      $('#ShortBreak').prop('checked', false).change();
    }
  });*/
});

function checkTimeGap() {
  var dateFormat = 'YYYY-MM-DD HH:mm:ss';
  var gap = $('#gap').val();
  if(gap === 'day') {
    console.log($('#baseTime').val())
    $('#baseTime').val(moment().hours(9).minutes(0).seconds(0).format(dateFormat));   
    console.log($('#baseTime').val())
  } else {
    gap = parseInt($('#gap').val());
    var now = new Date().getTime();
    var base = new Date($('#baseTime').val()).getTime();
    if(now-base < gap*60*1000){    
      $('#baseTime').val(moment().seconds(0).subtract(parseInt($('#gap').val())-1,'minutes').format(dateFormat)); 
    }
  }
}

var chartData = {};
var vList = { oee : ["overall_oee", "availability", "performance", "quality"], 
  oee_factor : ["planned_production_time", "total_down_time", "total_meal_break", "total_short_break", "total_shift_length", "total_accept_pieces", "total_reject_pieces", "operating_time"] };
function getData() {
  /*var selected = [], scnt = 0;
  $('input:checkbox[name="selected"]').each(function() {          
    if(this.checked){            
      selected[scnt++] = this.value;
    }    
  });  
  var data = { start : $('#baseTime').val(), gap : $('#gap').val(), status : selected }; */  
  var data = { start : $('#baseTime').val(), gap : $('#gap').val() };
  console.log(data);
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
  var type = $('#cid1').val().split('-');
  var id = type[0].split('_');
  var data = chartData[id[0]][id[1]];
  console.log(id)
  console.log(vList[type[1]])
  console.log(type[1])
  console.log(data)
  if(data != undefined) {        
    var chartName = '#ts-chart01';
    chart01 = d3.timeseries()          
      .width($(chartName).parent().width()-25)
      .height(270)      
      .margin.left(0);    

    for(i=0; i<vList[type[1]].length; i++) {    
      chart01.addSerie(data,{x:'dtSensed',y:vList[type[1]][i]},{interpolate:'linear'});
    }  
    chart01(chartName);
  }
}

function drawChart02(){
  d3.select("#ts-chart02").select("svg").remove();
  var type = $('#cid2').val().split('-');
  var id = type[0].split('_');
  var data = chartData[id[0]][id[1]];  
  console.log(data);
  if(data != undefined) {
    var chartName = '#ts-chart02';    
    chart02 = d3.timeseries()          
      .width($(chartName).parent().width()-25)
      .height(270)      
      .margin.left(0);    
    for(i=0; i<vList[type[1]].length; i++) {
      chart02.addSerie(data,{x:'dtSensed',y:vList[type[1]][i]},{interpolate:'linear'});
    }
    chart02(chartName);
  }
}

function drawChart03(){
  d3.select("#ts-chart03").select("svg").remove();
  var type = $('#cid3').val().split('-');
  var id = type[0].split('_');
  var data = chartData[id[0]][id[1]];
  if(data != undefined) {
    var chartName = '#ts-chart03';  
    chart03 = d3.timeseries()          
      .width($(chartName).parent().width()-25)
      .height(270)      
      .margin.left(0);    
    for(i=0; i<vList[type[1]].length; i++) {
      chart03.addSerie(data,{x:'dtSensed',y:vList[type[1]][i]},{interpolate:'linear'});
    }  
    chart03(chartName);
  }
}

function drawChart04(){
  d3.select("#ts-chart04").select("svg").remove();
  var type = $('#cid4').val().split('-');
  var id = type[0].split('_');  
  var data = chartData[id[0]][id[1]];
  if(data != undefined) {
    var chartName = '#ts-chart04';  
    chart04 = d3.timeseries()          
      .width($(chartName).parent().width()-25)
      .height(270)      
      .margin.left(0);    
    for(i=0; i<vList[type[1]].length; i++) {
      chart04.addSerie(data,{x:'dtSensed',y:vList[type[1]][i]},{interpolate:'linear'});
    }
    chart04(chartName);
  }
}

