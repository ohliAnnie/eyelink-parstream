$(document).ready(function() {
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().format(dateFormat));1      

  // time series char를 그린다.
  getData();

  $('#btn_search').click(function() {        
    var server = $('#server').val().split('&');
    console.log(server)
    console.log('/dashboard/timeseries'+server[0]+'?server='+server[1]);
    location.href='/dashboard/timeseries'+server[0]+'?server='+server[1];    
  });
});

function getData() {
  var sdate = $('#sdate').val();  

  var data = { date : sdate, interval : '10m' };
  var in_data = { url : "/dashboard/restapi/getAccTimeseries", type : "GET", data : data };
  ajaxGetData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {        
      drawAccTimeseries(result.rtnData);
    }
  });

  var data = { date : sdate };
  var in_data = { url : "/dashboard/restapi/getProcessTimeseries", type : "GET", data : data };
  ajaxGetData(in_data, function(result){    
    if (result.rtnCode.code == "0000") {        
      drawProcessTimeseries(result.rtnData);
    }
  });

  var in_data = { url : "/dashboard/restapi/getTopTimeseries", type : "GET", data : data };
  ajaxGetData(in_data, function(result){      
    if (result.rtnCode.code == "0000") {        
      drawTopTimeseries(result.rtnData);
    }
  });

  var in_data = { url : "/dashboard/restapi/getTotalTimeseries", type : "GET", data : data };
  ajaxGetData(in_data, function(result){        
    if (result.rtnCode.code == "0000") {
      drawTotalTimeseries(result.rtnData);
    }
  });
}

function drawAccTimeseries(data) {
  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'res_time'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'error'},{interpolate:'linear'})    
    .addSerie(data,{x:'timestamp',y:'slow'},{interpolate:'linear'})    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart01(chartName);
}

function drawProcessTimeseries(data){  
  var chartName = '#ts-chart02';
  chart02 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'cpu_total'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'memory_rss'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart02(chartName);
}

function drawTopTimeseries(data) { 
  var chartName = '#ts-chart03';
  chart03 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'top1'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'top2'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'top3'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'top4'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'top5'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'top6'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'top7'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'top8'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'top9'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'top10'},{interpolate:'linear'})

    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart03(chartName);
}

function drawTotalTimeseries(data) {
  var chartName = '#ts-chart04';
  chart04 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'memory_used'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'memory_actual_used'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'memory_swap_used'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'cpu_user'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'cpu_system'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'cpu_idle'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart04(chartName);
}