function getTransaction(id, date) {    
  console.log(id, date);
  var s = new Date().toString().split(' ');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  $.ajax({
    url: "/dashboard/restapi/getTransactionDetail" ,
    dataType: "json",
    type: "get",
    data: {
      index : "elagent_test-agent-"+s[3]+'.'+mon[s[1]]+'.'+s[2],
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
  var ano = 0, grid = 1, tree = 1;
  data.forEach(function(d){    
    d = d._source;
    console.log(d);
    var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
    var s =new Date(new Date(d.startTime).getTime()+9*60*60*1000).toString().split(' ');
    var sTime = s[3]+'-'+mon[s[1]]+'-'+s[2]+'T'+s[4];    
   if(d.annotationBoList[0] != null){
    for(i=0; i <d.annotationBoList.length;i++){              
      var z = d.annotationBoList[i];      
      if(z.key === 10000014){
        var a = z.value.split('\n');
        console.log(a);
        var b = a[1].split(':');
        console.log(a[1]);
        if(i==0 && tree==1){          
          sb.append('<tr class="treegrid-'+ grid +'">');        
        } else {                    
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
        }
        console.log(grid, tree);
        sb.append('<td>'+b[0]+'</td><td>'+d.rpc+'</td><td>'+sTime+'</td><td>'+d.gap+'</td>')
        sb.append('<td>'+d.exectionTime+'</td><td></td><td>'+d.self_time+'</td><td>'+d.execeptionClass+'</td>');
        sb.append('<td>'+d.serviceType+'</td><td>'+d.agentId+'</td><td>'+d.applicationId+'</td></tr>');  
        if(d.acceptorHost != null) {          
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
          console.log(grid, tree);
          sb.append('<td>'+'REMOTE ADDRESS'+'</td><td>'+d.acceptorHost+'</td><td>'+'</td><td>'+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+'</td>');
          sb.append('<td>'+'</td><td>'+'</td><td>'+'</td></tr>');     
        } else {
          tree =grid;
        }
      }
    }
    for(i=0; i <d.spanEventBoList.length; i++){
      var z = d.spanEventBoList[i];  
      for(j=0; j<z.annotationBoList.length;j++){                     
        var y =  z.annotationBoList[j];        
        if( y.key === 10000014){          
          var a = y.value.split('\n');      
          var e = a[1].split('(');
          var b = e[0].split('.');
          var c = a[1].split(b[b.length-2]);      
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
          sb.append('<td>'+c[1].substring(1)+'</td><td>'+'</td><td>'+sTime+'</td><td>'+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+b[4]+'</td>');
          sb.append('<td>'+z.serviceType+'</td><td>'+d.agentId+'</td><td>'+d.applicationId+'</td></tr>');  
           tree = grid;  
        } else if( y.key === 40){
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
          sb.append('<td>'+'</td><td>'+y.value+'</td><td>'+'</td><td>'+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+'</td>');
          sb.append('<td>'+'</td><td>'+'</td><td>'+'</td></tr>');  
        } else if(y.key === 46){
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
          sb.append('<td>'+'http.status.code'+'</td><td>'+y.value+'</td><td>'+'</td><td>'+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+'</td>');
          sb.append('<td>'+'</td><td>'+'</td><td>'+'</td></tr>');  
        } else if( y.key === 49){
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
          sb.append('<td>'+'http.info'+'</td><td>'+y.value+'</td><td>'+'</td><td>'+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+'</td>');
          sb.append('<td>'+'</td><td>'+'</td><td>'+'</td></tr>');  
        }       
      }
    }
  }
    
    
  });
  sb.append('</table></dir></dir></dir></dir>');  
  $('#call').append(sb.toString());  
    $('.tree-2').treegrid({
    expanderExpandedClass: 'glyphicon glyphicon-minus',
    expanderCollapsedClass: 'glyphicon glyphicon-plus'
  }); 
}