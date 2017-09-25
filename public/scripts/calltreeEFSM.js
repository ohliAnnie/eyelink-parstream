function getTransaction(id, date) {      
  var t = date.split('T');
  var d = t[0].split('-');  
  var s = new Date().toString().split(' ');
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
  $.ajax({
    url: "/dashboard/restapi/getTransactionDetail" ,
    dataType: "json",
    type: "get",
    data: {
      index : "elagent_test-agent-"+s[3]+'.'+mon[s[1]]+'.'+s[2],
//      index : "elagent_test-agent-"+d[0]+"."+d[1]+"."+d[2],
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
  if(data.length != 0){
    sb.append('<th>Application : '+data[0]._source.rpc+'</th><th>TransactionId : '+data[0]._source.transactionId+'</th><th>AgentId : '+data[0]._source.agentId+'</th><th>ApplicationName : '+data[0]._source.applicationId+'</th></tr></table>')
  } else {
    sb.append('<th>Application : </th><th>TransactionId : </th><th>AgentId : </th><th>ApplicationName : </th></tr></table>')  
  }
  sb.append('<table class="table tree-2 table-bordered table-striped table-condensed">');
  sb.append('<tr><th>Method</th><th>Argument</th><th>Start Time</th><th>Gap(ms)</th>');
  sb.append('<th>Exec(ms)</th><th>Exec(%)</th><th>Self(ms)</th><th>Class</th><th>API</th><th>Agent</th><th>Application</th></tr>');    
  var ano = 0, grid = 1, tree = 1;
  data.forEach(function(d){    
    d = d._source;    
    console.log(d);
    var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
    var stime = new Date(d.startTime).getTime()+18*60*60*1000;      
    var ftime = msToTime(stime);
    console.log(ftime);
   if(d.annotationBoList[0] != null){
    for(i=0; i <d.annotationBoList.length;i++){                    
      var z = d.annotationBoList[i];      
      console.log(z);
      if(z.key === 10000014){
        var a = z.value.split('\n');        
        var b = a[1].split(':');       
        if(i==0 && tree==1){          
          sb.append('<tr class="treegrid-'+ grid +'">');        
        } else {                    
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
        }        
        sb.append('<td>'+b[0]+'</td><td>'+d.rpc+'</td><td>'+applicationId+'</td><td>'+d.gap+'</td>')
        sb.append('<td>'+d.elapsed+'</td><td>'+Math.round(d.executionTime/d.elapsed*100)+'%</td><td>'+d.executionTime+'</td><td>'+d.execeptionClass+'</td>');
        sb.append('<td>'+d.serviceTypeName+'</td><td>'+d.agentId+'</td><td>'+d.applicationId+'</td></tr>');  
        if(d.acceptorHost != null) {          
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');                 
          sb.append('<td>'+'REMOTE ADDRESS'+'</td><td>'+d.acceptorHost+'</td><td>'+'</td><td>'+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+'</td>');
          sb.append('<td>'+'</td><td>'+'</td><td>'+'</td></tr>');     
        } else {
          tree =grid;
        }
      } else if(z.key === 10000013){        
        if(i==0 && tree==1){          
          sb.append('<tr class="treegrid-'+ grid +'">');        
        } else {                    
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
        }        
        stime += d.gap;
        ftime = msToTime(stime);
        sb.append('<td>'+z.value+'</td><td>'+d.rpc+'</td><td>'+ftime+'</td><td>'+d.gap+'</td>')
        sb.append('<td>'+d.elapsed+'</td><td>'+Math.round(d.executionTime/d.elapsed*100)+'%</td><td>'+d.executionTime+'</td><td></td>');
        sb.append('<td>'+d.serviceTypeName+'</td><td>'+d.agentId+'</td><td>'+d.applicationId+'</td></tr>');  
        if(d.remoteAddr != null) {          
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');                 
          sb.append('<td>'+'REMOTE ADDRESS'+'</td><td>'+d.remoteAddr+'</td><td>'+'</td><td>'+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+'</td>');
          sb.append('<td>'+'</td><td>'+'</td><td>'+'</td></tr>');     
        } else {
          tree =grid;
        }
      } else {
        console.log(z.key)
      }
    }
    for(i=0; i <d.spanEventBoList.length; i++){      
      var z = d.spanEventBoList[i];  
      console.log(z);
      for(j=0; j<z.annotationBoList.length;j++){                     
        var y =  z.annotationBoList[j];        
        if( y.key === 10000014){          
          var a = y.value.split('\n');      
          var e = a[1].split('(');
          var b = e[0].split('.');  
          var c = a[1].split(b[b.length-2]);  
          var t = c[1].substring(1).split(':')          
          stime += z.gap;          
          ftime = msToTime(stime);
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
          sb.append('<td>'+t[0]+'</td><td>'+'</td><td>'+ftime+'</td><td>'+z.gap+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+b[4]+'</td>');
          sb.append('<td>'+z.serviceTypeName+'</td><td>'+d.agentId+'</td><td>'+d.applicationId+'</td></tr>');  
           tree = grid;  
        } else if( y.key === 10000013){
          stime += z.gap;
          ftime = msToTime(stime);
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
          sb.append('<td>'+y.value+'</td><td>'+'</td><td>'+ftime+'</td><td>'+z.gap+'</td>')
          sb.append('<td>'+z.elapsed+'</td><td>'+Math.round(z.executionTime/d.elapsed*100)+'%</td><td>'+z.executionTime+'</td><td></td>');
          sb.append('<td>'+z.serviceTypeName+'</td><td>'+d.agentId+'</td><td>'+d.applicationId+'</td></tr>');  
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
        } else if( y.key === 48){
          sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'">');        
          sb.append('<td>'+'REMOTE_ADDRESS'+'</td><td>'+y.value+'</td><td>'+'</td><td>'+'</td>')
          sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+'</td>');
          sb.append('<td>'+'</td><td>'+'</td><td>'+'</td></tr>');  
        }        

      }      
      if(z.hasException === true){
        console.log(z);
        var x = z.exceptionMessage.split(':');
        sb.append('<tr class="treegrid-'+ ++grid +' treegrid-parent-'+tree+'" style="background-color:#FFA7A7">');        
        sb.append('<td><i class="fa fa-bolt"></i>  '+z.exceptionClass+'</td><td>'+z.exceptionMessage+'</td><td>'+'</td><td>'+'</td>')
        sb.append('<td>'+'</td><td></td><td>'+'</td><td>'+'</td>');
        sb.append('<td>'+'</td><td>'+'</td><td>'+'</td></tr>');  
        console.log(z.exceptionMessage)
      }
    }
  }  
    
  });
  sb.append('</table></div></div></div></div>');  
  $('#call').append(sb.toString());  
    $('.tree-2').treegrid({
    expanderExpandedClass: 'glyphicon glyphicon-minus',
    expanderCollapsedClass: 'glyphicon glyphicon-plus'
  }); 
}

function msToTime(duration) {
    var milliseconds = parseInt(duration%1000)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}