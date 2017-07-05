function getData(){
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var sindex =new Date(new Date(sdate).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  var index = [], cnt = 0;
  for(i=sindex.getTime(); i <= new Date(edate).getTime(); i+=24*60*60*1000){    
    var day = new Date(i).toString().split(' ');    
    index[cnt++] = "filebeat_jira_access-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }  
  var s = sindex.toString().split(' ');
  var gte = s[2]+'/'+s[1]+'/'+s[3]+':15:00:00 +0000';
  var e = new Date(edate).toString().split(' ' );
  var lte = e[2]+'/'+e[1]+'/'+e[3]+':15:00:00 +0000';
  $.ajax({
    url: "/reports/restapi/getAccessError" ,
    dataType: "json",
    type: "get",
    data: { index : index, gte : gte , lte : lte},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {        
        drawChart(result.rtnData, sdate, edate);
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
function drawChart(rtnData, sdate, edate) {
  var minDate = new Date(sdate+' 00:00:00');
  var maxDate = new Date(edate+' 24:00:00');
  
  var countBar = dc.barChart("#countBar");
  var typePie = dc.pieChart("#typePie");
  var timeLine = dc.lineChart("#timeLine");
  var weekLine = dc.lineChart("#weekLine");  
  var data = [];
  var mon = {'Jan' : 0, 'Feb' : 1, 'Mar' : 2, 'Apr' : 3, 'May' : 4, 'Jun' : 5, 'Jul' : 6, 'Aug' : 7, 'Sep' : 8, 'Oct' : 9, 'Nov' : 10, 'Dec' : 11 };    
  rtnData.forEach(function(d){    
    console.log(d);
    console.log(d._source.timestamp);
    var t = d._source.timestamp.split(' ');
    var d = t[0].split(':');        
    var dd = d[0].split('/');     
    var time = new Date(dd[2], mon[dd[1]], dd[0], d[1], d[2], d[3]);    
    data.push({ timestamp : time, response : d._source.response });
  });

  console.log(data);

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var typeDim = nyx.dimension(function(d) {
    return d.response;
  });
  var pieGroup = typeDim.group().reduceCount(function(d) {
    return 1;
  });


  var timeDim = nyx.dimension(function(d) {    
    return d.timestamp; 
  });


  typePie
    .width(window.innerWidth*0.45)
    .height(400)
    .radius(160)
    .dimension(typeDim)
    .group(pieGroup)    
    .drawPaths(true)
    .legend(dc.legend())
    .label(function (d){
      if(pieChart.hasFilter() && !pieChart.hasFilter(d.key)) {
        return '0(0%)';
      }
      var label = d.key;
      if(all.value()) {
        label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
      }
      return label;
    })
    .renderLabel(true)
    .colors(d3.scale.ordinal().range(["#EDC951",  "#31a354", "#00A0B0", "#FFB2F5" , "#CC333F"]));



  dc.renderAll();
}