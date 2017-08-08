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
  var gte = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T15:00:00.000Z';  
  var lte = edate+'T15:00:00.000Z';

  $.ajax({
    url: "/dashboard/restapi/getRestimeCount" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte , lte : lte},
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
    console.log(d);
    data.push({ "timestamp" : d.key, "1s" : d.group_by_time.buckets.s1.doc_count , "3s" : d.group_by_time.buckets.s3.doc_count, "5s" : d.group_by_time.buckets.s5.doc_count, "slow" : d.group_by_time.buckets.slow.doc_count });
      
  }); 

  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
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
  chart01(chartName);
}