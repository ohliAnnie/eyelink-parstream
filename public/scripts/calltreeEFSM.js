function getTransaction(id, date) {    
  console.log(id, date);
  var point = new Date(parseInt(date)).toString().split(' ')
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  $.ajax({
    url: "/dashboard/restapi/getTransactionDetail" ,
    dataType: "json",
    type: "get",
    data: {
      index : "elagent_test-agent-2017.09.07",
      type : "TraceDetail",      id : "transactionId",
      value : id
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

function drawDetail(data) {      

  $('#call').empty();
  var sb = new StringBuffer();
  sb.append('<div class="row"><div class="col-md-12"><div class="portlet light bordered"><div class="portlet-body form">');
  sb.append('<table class="table table-striped table-bordered table-hover"><tr>');  
  sb.append('<th>Application : '+data[0]._source.rpc+'</th><th>TransactionId : '+data[0]._source.transactionId+'</th><th>AgentId : '+data[0]._source.agentId+'</th><th>ApplicationName : '+data[0]._source.applicationId+'</th></tr></table>')
  sb.append('<table class="table tree-2 table-bordered table-striped table-condensed">');
  sb.append('<tr><th>Method</th><th>Argument</th><th>Start Time</th><th>Gap(ms)</th>');
  sb.append('<th>Exec(ms)</th><th>Exec(%)</th><th>Self(ms)</th><th>Class</th><th>API</th><th>Agent</th><th>Application</th></tr>');    
  data.forEach(function(d){    
    d = d._source;
    console.log(d);
    //d.depth += 1;
  var tree = d.depth;
  sb.append('<tr class="treegrid-'+ ++tree +'">');        
    sb.append('<td>'+d.method+'</td><td>'+d.rpc+'</td><td>'+d.startTime+'</td><td>'+d.gap+'</td>')
    sb.append('<td>'+d.exectionTime+'</td><td></td><td>'+d.self_time+'</td><td>'+d.execeptionClass+'</td>');
    sb.append('<td>'+d.apiId+'</td><td>'+d.agentId+'</td><td>'+d.applicationId+'</td></tr>');  
  
    for(i=0; i <d.spanEventBoList.length; i++){
      sb.append('<tr class="treegrid-'+ ++tree +' treegrid-parent-'+d.spanEventBoList[i].depth+'">');        
      sb.append('<td>'+d.method+'</td><td>'+d.spanEventBoList[i].rpc+'</td><td>'+d.startTime+'</td><td>'+d.gap+'</td>')
      sb.append('<td>'+d.exectionTime+'</td><td></td><td>'+d.self_time+'</td><td>'+d.spanEventBoList[i].execeptionClass+'</td>');
     sb.append('<td>'+d.spanEventBoList[i].apiId+'</td><td>'+d.agentId+'</td><td>'+d.applicationId+'</td></tr>');  
    }
    
  });
  sb.append('</table></dir></dir></dir></dir>');  
  $('#call').append(sb.toString());  
    $('.tree-2').treegrid({
    expanderExpandedClass: 'glyphicon glyphicon-minus',
    expanderCollapsedClass: 'glyphicon glyphicon-plus'
  }); 
}