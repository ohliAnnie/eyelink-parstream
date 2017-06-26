function drawAccChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();   
  var index = 'filebeat_jira_access-'+sdate;  
  console.log(index);
  $.ajax({
    url: "/dashboard/restapi/getAccTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index },
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;            
      
        drawAccTimeseries(data);

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

function drawCpuChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();   
  var index = 'metricbeat-'+sdate;  
  console.log(index);
  $.ajax({
    url: "/dashboard/restapi/getCpuTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index },
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;                    
        drawCpuTimeseries(data);
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

function drawMetricChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();   
  var index = 'metricbeat-'+sdate;  
  console.log(index);
  $.ajax({
    url: "/dashboard/restapi/getMetricTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index },
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;            
        console.log(data);
        drawMericTimeseries(data);

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


function drawAccTimeseries(out_data) {
  // 데이터 가공
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var data = [];
  out_data.forEach(function(d) {
    var t = d._source.timestamp.split(' ');
      t = t[0].split(':');
      var s = t[0].split('/');      
      d._source.timestamp = new Date(s[2], mon[s[1]], s[0], t[1], t[2], t[3]);               
      d._source.responsetime = parseInt(d._source.responsetime);                
      data.push(d._source);
  });

  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'responsetime'},{interpolate:'linear'})    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart01(chartName);
}
function drawCpuTimeseries(out_data) {
  // 데이터 가공
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var data = [];
  out_data.forEach(function(d) {      
      data.push({ timestamp : new Date(d._source.timestamp), idle : d._source.system.cpu.idle.pct, system : d._source.system.cpu.system.pct, user : d._source.system.cpu.user.pct } );
  });

console.log(data);
    var chartName = '#ts-chart02';
  chart02 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'idle'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'user'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'system'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart02(chartName);
}
function drawMetricTimeseries(data){
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



