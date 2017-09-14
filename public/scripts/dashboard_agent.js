function getAgentData(){
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
 var yDay = new Date(new Date().getTime() - 24*60*60*1000);
 var y = yDay.toString().split(' ');
 var data = { index : "elagent_test-agent-*", type : "ApplicationLinkData",
 			  start : y[3]+"-"+mon[y[1]]+"-"+y[2]+"T15:00:00", id : "startTime" };
 $.ajax({
    url: "/dashboard/restapi/getAgentData" ,
    dataType: "json",
    type: "get",
    data: data,
    success: function(result) {            
      if (result.rtnCode.code == "0000") {          
      	console.log(result);
       drawAgentServerMap(result);
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

function drawAgentServerMap(data){

}