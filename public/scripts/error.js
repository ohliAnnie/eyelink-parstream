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
  rtnData.forEach(function(d){
    console.log(d);
  });

}