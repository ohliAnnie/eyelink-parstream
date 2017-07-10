function drawAccChart() {
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var sindex =new Date(new Date(s[0], parseInt(s[1])-1, s[2]).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  var index = [], cnt = 0;
  var e = edate.split('-');
  for(i=sindex.getTime(); i < new Date(e[0], parseInt(e[1])-1, e[2]).getTime()+24*60*60*1000; i+=24*60*60*1000){    
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = "filebeat_jira_access-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  console.log(index);
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';  
  var lte = edate+'T15:00:00.000Z';

  $.ajax({
    url: "/dashboard/restapi/getAccTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte , lte : lte},
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
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var sindex =new Date(new Date(s[0], parseInt(s[1])-1, s[2]).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  var index = [], cnt = 0;
  var e = edate.split('-');
  for(i=sindex.getTime(); i < new Date(e[0], parseInt(e[1])-1, e[2]).getTime()+24*60*60*1000; i+=24*60*60*1000){       
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = "metricbeat-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';
  var e = edate.split('-');
  var lte = e[0]+'-'+e[1]+'-'+e[2]+'T15:00:00.000Z';
  console.log(index, gte, lte);
  $.ajax({
    url: "/dashboard/restapi/getProcessTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte , lte : lte},
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
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var sindex =new Date(new Date(s[0], parseInt(s[1])-1, s[2]).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  var index = [], cnt = 0;
  var e = edate.split('-');
  for(i=sindex.getTime(); i < new Date(e[0], parseInt(e[1])-1, e[2]).getTime()+24*60*60*1000; i+=24*60*60*1000){       
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = "metricbeat-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';
  var e = edate.split('-');
  var lte = e[0]+'-'+e[1]+'-'+e[2]+'T15:00:00.000Z';
   console.log(index, gte, lte);
  $.ajax({
    url: "/dashboard/restapi/getTopTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte , lte : lte},
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
   var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var sindex =new Date(new Date(s[0], parseInt(s[1])-1, s[2]).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  var index = [], cnt = 0;
  var e = edate.split('-');
  for(i=sindex.getTime(); i < new Date(e[0], parseInt(e[1])-1, e[2]).getTime()+24*60*60*1000; i+=24*60*60*1000){       
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = "metricbeat-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';
  var e = edate.split('-');
  var lte = e[0]+'-'+e[1]+'-'+e[2]+'T15:00:00.000Z';
   console.log(index, gte, lte);
  $.ajax({
    url: "/dashboard/restapi/getTotalTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte , lte : lte},
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
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var sindex =new Date(new Date(s[0], parseInt(s[1])-1, s[2]).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  var index = [], cnt = 0;
  var e = edate.split('-');
  for(i=sindex.getTime(); i < new Date(e[0], parseInt(e[1])-1, e[2]).getTime()+24*60*60*1000; i+=24*60*60*1000){       
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = "metricbeat-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';
  var e = edate.split('-');
  var lte = e[0]+'-'+e[1]+'-'+e[2]+'T15:00:00.000Z';
  console.log(index);
  $.ajax({
    url: "/dashboard/restapi/getMetricTimeseries" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte , lte : lte},
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
  var min = null;
  var sCnt = 0, eCnt = 0, rCnt = 0;
  out_data.forEach(function(d) {
    d._source.response = parseInt(d._source.response);     
    d._source.responsetime = parseInt(d._source.responsetime);
    if(d._source.timestamp.substring(0,17) == min){
      if(d._source.response >= 400) {
        eCnt++;
      } else if(d._source.responsetime > 5000){
        sCnt++;
      } else {
        rCnt++;
      }
    } else if (d._source.timestamp.substring(0,17) != min){
      if(min != null){      
       var t = d._source.timestamp.split(' ');            
        t = t[0].split(':');
        var s = t[0].split('/');   
        var time  = new Date(new Date(s[2]+'-'+mon[s[1]]+'-'+s[0]+'T'+t[1]+':'+t[2]+':'+t[3]).getTime() + 9*60*60*1000);        
        data.push({ timestamp : time, res_time : rCnt, error : eCnt, slow : sCnt });
        sCnt = 0, eCnt = 0, rCnt = 0;
      } 
      min = d._source.timestamp.substring(0,17);   
    }  
      
  }); 

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
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart02(chartName);
}

function drawTopTimeseries(out_data) {
  // 데이터 가공
 
  var data = [];
  /*var top = [{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0}];  */
  var top = [0,0,0,0,0,0,0,0,0,0]
  var time = new Date();
  var cnt = 0;
  out_data.forEach(function(d) {          
    d._source.timestamp = new Date(d._source.timestamp);    
    if(time.getTime() != d._source.timestamp.getTime()){      
      if(time.getTime() < d._source.timestamp.getTime()) {
        data.push({ timestamp : time, top1 : top[0], top2 : top[1], top3 : top[2], top4 : top[3], top5 : top[4], top6 : top[5], top7 : top[6], top8 : top[7], top9 : top[8], top10 : top[9] });
      }
      time = d._source.timestamp;
      cnt = 0;
      top = [0,0,0,0,0,0,0,0,0,0];
      //top = [['null', 0],['null', 0],['null', 0],['null', 0],['null', 0],['null', 0],['null', 0],['null', 0],['null', 0],['null', 0]];
      //top = [{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0},{name:'null',value:0}];
    } else {
      top[cnt++] = d._source.system.process.cpu.total.pct;
    }
  });


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

function drawTotalTimeseries(out_data) {
  // 데이터 가공
 var data = [];
 var m_used = 0, m_actual_used = 0, m_swap_used = 0, c_user = 0, c_system = 0, c_idle = 0;
  out_data.forEach(function(d) {      
    if(d._source.metricset.name == "memory") {      
      m_used = d._source.system.memory.used.pct;
      m_actual_used = d._source.system.memory.actual.used.pct;
      m_swap_used = d._source.system.memory.swap.used.pct;
      data.push({ timestamp : new Date(d._source.timestamp), memory_used : m_used, memory_actual_used : m_actual_used, memory_swap_used : m_swap_used, cpu_user : c_user, cpu_system : c_system, cpu_idle : c_idle } );
    } else if(d._source.metricset.name == "cpu") {
      c_user = d._source.system.cpu.user.pct;
      c_system = d._source.system.cpu.system.pct;
      c_idle = d._source.system.cpu.idle.pct;
      data.push({ timestamp : new Date(d._source.timestamp), cpu_user : d._source.system.cpu.user.pct, cpu_system : d._source.system.cpu.system.pct, cpu_idle : d._source.system.cpu.idle.pct } );
    }
  });

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