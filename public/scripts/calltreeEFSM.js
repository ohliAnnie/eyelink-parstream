function getTransaction(id, date) {  
  var i = date.split('T');
  i = i[0] .split('-');
  var index = 'transactionlist-'+i[0]+'-'+i[1];
  $.ajax({
    url: "/dashboard/restapi/getTransactionDetail" ,
    dataType: "json",
    type: "get",
    data: {
      index : index,
      id : id},
    success: function(result) {
      if (result.rtnCode.code == "0000") {        
        drawDetail(result.rtnData[0]._source);        
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
function drawDetail(detail) {  
  console.log(detail);
  $('#call').empty();
  var sb = new StringBuffer();
  sb.append('<tr><th>Method</th><th>Argument</th><th>Start Time</th><th>Gap(ms)</th>');
  sb.append('<th>Exec(ms)</th><th>Exec(%)</th><th>Self(ms)</th><th>Class</th><th>API</th><th>Agent</th><th>Application</th></tr>');  
  detail.callstack.forEach(function(d){
    if(d.start_time==null) {
      d.start_time = '';
    }
    if(d.gqp_time==null) {
      d.gap_time = '';
    }
    if(d.exec_time==null) {
      d.exec_time = '';
    }
    if(d.self_time==null) {
      d.self_time = '';
    }
    if(d.exec_class==null) {
      d.exec_class = '';
    }
    if(d.exec_time==null) {
      d.exec_time = '';
    }
    if(d.exec_api==null) {
      d.exec_api = '';
    }
    if(d.agent_id==null) {
      d.agent_id = '';
    }
    if(d.applcation_id==null) {
      d.applcation_id = '';
    }
    console.log(d);
    if(d.level == 1){
      sb.append('<tr class="treegrid-'+d.seq+'">');
    } else {
      sb.append('<tr class="treegrid-'+d.seq+' treegrid-parent-'+d.pseq+'">');
    }
    sb.append('<td>'+d.method+'</td><td>'+d.argument+'</td><td>'+d.start_time+'</td><td>'+d.gap_time+'</td>')
    sb.append('<td>'+d.exec_time+'</td><td></td><td>'+d.self_time+'</td><td>'+d.exec_class+'</td>');
    sb.append('<td>'+d.exec_api+'</td><td>'+d.agent_id+'</td><td>'+d.applcation_id+'</td></tr>');

  });
  $('#call').append(sb.toString());
}