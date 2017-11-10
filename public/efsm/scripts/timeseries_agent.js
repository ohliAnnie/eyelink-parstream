$(document).ready(function() {
  var date = $('#date').val();
  if(date == ''){
    var dateFormat = 'YYYY-MM-DD';
    $('#sdate').val(moment().format(dateFormat));    
  } else {
    $('#sdate').val(date);
  }         
  // time series char를 그린다.
  drawCountChart();
  $('#btn_search').click(function() {        
    var server = $('#server').val().split('&');        
    var date = $('#sdate').val();
    location.href='/timeseries/timeseries'+server[0]+'?server='+server[1]+'&date='+date;    
  });
});

function drawCountChart() {  
  var data = { date : $('#sdate').val(), type : 'normal' };

  var in_data = { url : "/timeseries/restapi/getHeapData", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){
    if (result.rtnCode.code == "0000") {        
      drawHeap(result.heap);
      drawPermgen(result.perm);
    }
  });

  var in_data = { url : "/timeseries/restapi/getJvmSysData", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){
    if (result.rtnCode.code == "0000") {                
        drawJvmSys(result.rtnData);
    } 
  });

  var in_data = { url : "/timeseries/restapi/getStatTransaction", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {        
      drawTransaction(result.rtnData);
    }
  });

  var in_data = { url : "/timeseries/restapi/getActiveTrace", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {        
      drawActiveTrace(result.rtnData);
    }
  });
}

function drawHeap(data) {    
  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'max'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'used'},{interpolate:'linear'})        
    .xscale.tickFormat(d3.time.format("%H:%M:%S"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart01(chartName);
}

function drawPermgen(data) {  
  var chartName = '#ts-chart02';
  chart02 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'max'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'used'},{interpolate:'linear'})        
    .xscale.tickFormat(d3.time.format("%H:%M:%S"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart02(chartName);
}

function drawJvmSys(data) {
  var chartName = '#ts-chart03';
  chart03 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'jvm'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'system'},{interpolate:'linear'})        
    .xscale.tickFormat(d3.time.format("%H:%M:%S"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart03(chartName);
}

function drawTransaction(data) {
  var chartName = '#ts-chart04';
  chart04 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'S.C'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'S.N'},{interpolate:'linear'})        
    .addSerie(data,{x:'timestamp',y:'U.C'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'U.N'},{interpolate:'linear'})        
    .addSerie(data,{x:'timestamp',y:'Total'},{interpolate:'linear'})    
    .xscale.tickFormat(d3.time.format("%H:%M:%S"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart04(chartName);
}

function drawActiveTrace(data) {  
  var chartName = '#ts-chart05';
  chart05 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'Fast'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'Normal'},{interpolate:'linear'})        
    .addSerie(data,{x:'timestamp',y:'Slow'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'Very Slow'},{interpolate:'linear'})            
    .xscale.tickFormat(d3.time.format("%H:%M:%S"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart05(chartName);
}