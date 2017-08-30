function drawCountChart() {
  var indexs = $('#indexs').val();  
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
    index[cnt++] =indexs+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  console.log(index);
  var s = sindex.toString().split(' ');
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2];  
  var lte = edate;

  $.ajax({
    url: "/dashboard/restapi/getRestimeCount" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte+'T15:00:00.000Z' , lte : lte+'T15:00:00.000Z'},
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "0000") {        
        drawCountTimeseries(result.rtnData);

      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });

   $.ajax({
    url: "/dashboard/restapi/getHeapData" ,
    dataType: "json",
    type: "get",
    data: { index : "elagent_test-agent-*", type : "AgentStatJvmGc", gte : sdate+'T00:00:00' , lte : edate+'T23:59:59'},
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "0000") {        
        drawHeap(result.rtnData);

      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });


   $.ajax({
    url: "/dashboard/restapi/getJvmSysData" ,
    dataType: "json",
    type: "get",
    data: { index : "elagent_test-agent-*", type : "AgentStatCpuLoad", gte : sdate+'T00:00:00' , lte : edate+'T23:59:59'},
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "0000") {        
        drawJvmSys(result.rtnData);

      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });

   $.ajax({
    url: "/dashboard/restapi/getStatTransaction" ,
    dataType: "json",
    type: "get",
    data: { index : "elagent_test-agent-*", type : "AgentStatTransaction", gte : sdate+'T00:00:00' , lte : edate+'T23:59:59'},
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "0000") {        
        drawTransaction(result.rtnData);
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

function drawCountTimeseries(out_data) {
  // 데이터 가공
  console.log(out_data);
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var data = [];  
  var min = null;
  var sCnt = 0, eCnt = 0, rCnt = 0;
  out_data.forEach(function(d) {        
    data.push({ "timestamp" : d.key, "1s" : d.group_by_time.buckets.s1.doc_count , "3s" : d.group_by_time.buckets.s3.doc_count, "5s" : d.group_by_time.buckets.s5.doc_count, "slow" : d.group_by_time.buckets.slow.doc_count });
      
  }); 

  var chartName = '#ts-chart05';
  chart05 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'1s'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'3s'},{interpolate:'linear'})    
    .addSerie(data,{x:'timestamp',y:'5s'},{interpolate:'linear'})    
    .addSerie(data,{x:'timestamp',y:'slow'},{interpolate:'linear'})    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart05(chartName);
}

function drawHeap(out_data) {
  // 데이터 가공
  console.log(out_data);
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var data = [];  
  var min = null;
  var sCnt = 0, eCnt = 0, rCnt = 0;
  out_data.forEach(function(d) {
    d = d._source;
    console.log(d);
    data.push({ "timestamp" : new Date(d.timestamp), "max" : d.heapMax, "used" : d.heapUsed, "nonUsed" : d.nonHeapUsed });
      
  }); 

  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'max'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'used'},{interpolate:'linear'})    
    .addSerie(data,{x:'timestamp',y:'nonUsed'},{interpolate:'linear'})        
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart01(chartName);
}

function drawJvmSys(out_data) {
  // 데이터 가공
  console.log(out_data);
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var data = [];  
  var min = null;
  var sCnt = 0, eCnt = 0, rCnt = 0;
  out_data.forEach(function(d) {
    d = d._source;    
    data.push({ "timestamp" : new Date(d.timestamp), "jvm" : d.jvmCpuLoad, "system" : d.systemCpuLoad });
      
  }); 

  var chartName = '#ts-chart03';
  chart03 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'jvm'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'system'},{interpolate:'linear'})        
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart03(chartName);
}

function drawTransaction(out_data) {
  // 데이터 가공
  console.log(out_data);
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var data = [];  
  var min = null;
  var sCnt = 0, eCnt = 0, rCnt = 0;
  out_data.forEach(function(d) {
    d = d._source;    
    data.push({ "timestamp" : new Date(d.timestamp), "S.C" : d.sampledContinuationCount, "S.N" : d.sampledNewCount, "U.C" : d.unsampledContinuationCount, "U.N" : d.unsampledNewCount, "Total" : d.sampledContinuationCount+d.sampledNewCount+d.unsampledContinuationCount+d.unsampledNewCount });
  }); 

  var chartName = '#ts-chart04';
  chart04 = d3.timeseries()
    .addSerie(data,{x:'timestamp',y:'S.C'},{interpolate:'step-before'})
    .addSerie(data,{x:'timestamp',y:'S.N'},{interpolate:'linear'})        
    .addSerie(data,{x:'timestamp',y:'U.C'},{interpolate:'linear'})
    .addSerie(data,{x:'timestamp',y:'U.N'},{interpolate:'linear'})        
    .addSerie(data,{x:'timestamp',y:'Total'},{interpolate:'linear'})    
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width($(chartName).parent().width()-10)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    // console.log(chart01);
  chart04(chartName);
}