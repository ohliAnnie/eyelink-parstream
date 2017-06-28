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
        drawAccTimeseries(result.rtnData);

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

function drawProcessChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();   
  var index = 'metricbeat-'+sdate;  
  console.log(index);
  $.ajax({
    url: "/dashboard/restapi/getProcessTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index },
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {        
        drawProcessTimeseries(result.rtnData);
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

function drawTopChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();   
  var index = 'metricbeat-'+sdate;  
  console.log(index);
  $.ajax({
    url: "/dashboard/restapi/getTopTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index },
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        drawTopTimeseries(result.rtnData);
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

function drawTotalChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();   
  var index = 'metricbeat-'+sdate;  
  console.log(index);
  $.ajax({
    url: "/dashboard/restapi/getTotalTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index },
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        drawTotalTimeseries(result.rtnData);
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
      var time  = new Date(s[2], mon[s[1]], s[0], t[1], t[2], t[3]).getTime() + 9*60*60*1000;
      d._source.timestamp = new Date(time);               
      d._source.response = parseInt(d._source.response);     
      d._source.responsetime = parseInt(d._source.responsetime);
      if(d._source.response >= 400) {
        data.push({ timestamp : d._source.timestamp, error : d._source.responsetime, responsetime : 0, slow : 0 });
      } else if(d._source.responsetime > 5000){
        data.push({ timestamp : d._source.timestamp, error : 0, responsetime : 0, slow : d._source.responsetime });
      } else {
        data.push({ timestamp : d._source.timestamp, error : 0, responsetime : d._source.responsetime, slow : 0 });
      }
  }); 

  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'responsetime'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'error'},{interpolate:'linear'})    
    .addSerie(data,{x:'timestamp',y:'slow'},{interpolate:'linear'})    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart01(chartName);
}

function drawProcessTimeseries(out_data){
  var data = [];
  out_data.forEach(function(d) {      
      data.push({ timestamp : new Date(d._source.timestamp), cpu_total : d._source.system.process.cpu.total.pct, memory_rss : d._source.system.process.memory.rss.pct } );
  });  
  var chartName = '#ts-chart02';
  chart02 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'cpu_total'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'memory_rss'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart02(chartName);
}

function drawTopTimeseries(out_data) {
  // 데이터 가공
  var data = [];
  out_data.forEach(function(d) {      
    if(d._source.metricset.name == "memory") {      
      data.push({ timestamp : new Date(d._source.timestamp), cpu_user : 0, cpu_system : 0, cpu_idle : 0, memory_used : d._source.system.memory.used.pct, memory_actual_used: d._source.system.memory.actual.used.pct, memory_swap_used : d._source.system.memory.swap.used.pct } );
    } else if(d._source.metricset.name == "cpu") {
      data.push({ timestamp : new Date(d._source.timestamp), cpu_user : d._source.system.cpu.user.pct, cpu_system : d._source.system.cpu.system.pct, cpu_idle : d._source.system.cpu.idle.pct, memory_used : 0, memory_actual_used : 0, memory_swap_used : 0 } );
    }
  });

    var chartName = '#ts-chart03';
  chart03 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'idle'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'user'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'system'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart03(chartName);
}

function drawTotalTimeseries(out_data) {
  // 데이터 가공
 var data = [];
  out_data.forEach(function(d) {      
    if(d._source.metricset.name == "memory") {      
      data.push({ timestamp : new Date(d._source.timestamp), cpu_user : 0, cpu_system : 0, cpu_idle : 0, memory_used : d._source.system.memory.used.pct, memory_actual_used: d._source.system.memory.actual.used.pct, memory_swap_used : d._source.system.memory.swap.used.pct } );
    } else if(d._source.metricset.name == "cpu") {
      data.push({ timestamp : new Date(d._source.timestamp), cpu_user : d._source.system.cpu.user.pct, cpu_system : d._source.system.cpu.system.pct, cpu_idle : d._source.system.cpu.idle.pct, memory_used : 0, memory_actual_used : 0, memory_swap_used : 0 } );
    }
  });

  console.log(data);

    var chartName = '#ts-chart04';
  chart04 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'cpu_user'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'cpu_system'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'cpu_idle'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'memory_used'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'memory_actual_used'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'memory_swap_used'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width($(chartName).parent().width()-100)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart04(chartName);
}