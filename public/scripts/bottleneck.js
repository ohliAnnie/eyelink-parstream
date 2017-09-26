function getData(server, selected){
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  console.log(server, selected)
  var now = new Date();
  var n = now.toString().split(' ');  
  var yDay = new Date(now.getTime()-24*60*60*1000);
  var y = yDay.toString().split(' ');
  var select = selected['CPU']+selected['MEMORY']+selected['SERVICE'];  
  var slist = select.split(',');  
  var list = '';
  for(i=0; i<slist.length; i++){    
    list = list+' '+slist[i];   
  }
  console.log(list)

  if(server == "test-agent"){
    $.ajax({
    url: "/dashboard/restapi/getBottleneckList" ,
    dataType: "json",
    type: "get",
    data: {
      index : "elagent_test-agent-*", type : "AgentAlarm",     
      id : "timestamp", value : y[3]+"-"+mon[y[1]]+"-"+y[2]+"T15:00:00",
      list : list
    },
    success: function(result) {
      if (result.rtnCode.code == "0000") {              
        drawList(result.rtnData);        
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
}

function drawList(data){
  $('#list').empty();  
  var sb = new StringBuffer();    
  sb.append('<table class="sample_2 table table-striped table-bordered table-hover"><tr>'); 
  if(data.length != 0){
    sb.append('<th>Timestamp</th><th>AlarmType</th></tr>');
    data.forEach(function(d){
      sb.append('<tr onclick="javascript:clickTrEvent('+"'"+d._id+"'"+')"><td>'+d._source.timestamp+'</td><td>'+d._source.alarmType+'</td></tr>');
    });
    sb.append('</table>');
  }else{
    sb.append('<td>데이터가 없습니다.</td></tr></table>');
  }
  console.log(sb.toString());
  TableManaged.init();
  $('#list').append(sb.toString());  
  TableManaged.init(); 
}

function clickTrEvent(id, range){
  console.log(id, range);
  $.ajax({
    url: "/dashboard/restapi/getBottleneck" ,
    dataType: "json",
    type: "get",
    data: {
      index : "elagent_test-agent-*", type : "AgentAlarm",     
      id : "_id", value : id
    },
    success: function(result) {
      if (result.rtnCode.code == "0000") {              
        drawDetail(result.rtnData);        
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

function drawDetail(data){
  $('#detail').empty();  
  var sb = new StringBuffer();    
  sb.append('<table class="table table-striped table-bordered table-hover">'); 
  if(data.length != 0){        
    sb.append('<tr><td>AgentId</td><td>'+data.alarmData.jvmGcBo.agentId+'</td><td>AgentType</td><td>'+data.agentType+'</td></tr>');    
    sb.append('<tr><td>ApplicationType</td><td>'+data.applicationType+'</td><td>timestamp</td><td>'+data.alarmData.jvmGcBo.timestamp+'</td></tr>');    
    sb.append('<tr><td>alarmType</td><td>'+data.alarmType+'</td><td>Message</td><td>'+data.message+'</td></tr>');        
    sb.append('<tr><td>heapMax</td><td>'+data.alarmData.jvmGcBo.heapMax+'</td><td>heapUsed</td><td>'+data.alarmData.jvmGcBo.heapUsed+'</td></tr>');    
    sb.append('</table>');
  }else{
    sb.append('<tr><td>데이터가 없습니다.</td></tr></table>');
  }
  console.log(sb.toString());  
  $('#detail').append(sb.toString());  
  
}