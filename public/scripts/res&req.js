function getData(){  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var minDate = new Date(s[0], parseInt(s[1])-1, s[2], 0, 0, 0);
  var edate = $('#edate').val();
  var e = edate.split('-');
  var maxDate = new Date(e[0], parseInt(e[1])-1, e[2], 0, 0, 0);
  var indexD = [], cnt = 0;  
  console.log(sdate, edate);
  for(i=minDate.getTime(); i < maxDate.getTime()+24*60*60*1000; i+=24*60*60*1000){    
    var day = new Date(i).toString().split(' ');    
    indexD[cnt++] = "filebeat_jira_access-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }    
  getDay(indexD);  
 
  var indexW = [];
  var wStart = maxDate.getTime()-27*24*60*60*1000;
  for(i=0; i<4; i++) {
    var week = [];
    for(j=0; j<7; j++){
      var day = new Date(wStart).toString().split(' ');    
      week[j] = "filebeat_jira_access-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
      wStart += 24*60*60*1000;
    }
    indexW[i] = week;
  }
  console.log(indexW);
  var indexM = [], eYear = parseInt(e[0]), eMon = parseInt(e[1]);  
  for(i=5; i>=0; i--){
    indexM[i] = "filebeat_jira_access-"+eYear+'.'+(eMon--)+'.*'
    if(eMon == 0){
      eMon = 12;
      eYear--;
    }
  }
  console.log(indexM);  
}
var cntDE = [], cntD1 = [], cntD3 = [], cntD5 = [], cntDs = [], Di = 0;
function getDay(indexD) {  
  cntDE = [], Di = 0;  
  for(i=0; i<indexD.length; i++){
     $.ajax({
      url: "/reports/restapi/getDay1sCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                  
          cntD1[Di] = result.rtnData;  
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
      url: "/reports/restapi/getDay3sCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                  
          cntD3[Di] = result.rtnData;  
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
      url: "/reports/restapi/getDaySlowCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                  
          cntDs[Di] = result.rtnData;  
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
      url: "/reports/restapi/getDayErrorCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                  
          cntDE[Di++] = result.rtnData;  
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
  dayChart(cntD1, cntD3, cntD5, cntDs, cntDE);
}
function dayChart(cntD1, cntD3, cntD5, cntDs, cntDE) {
  console.log(cntD1);
  console.log(cntD3);
  console.log(cntD5);
  console.log(cntDs);
  console.log(cntDE);
}