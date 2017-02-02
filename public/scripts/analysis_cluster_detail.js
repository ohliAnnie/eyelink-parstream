function getMasterList() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();  
   console.log('%s, %s', sdate, edate);
   $.ajax({
    url: "/analysis/restapi/getDaClusterMaster" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var master = result.rtnData;
        console.log(master);
        drawMaster(master);
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

function drawMaster(master) { 
  var seatvar = document.getElementsByClassName("masterList");           
        console.log(seatvar);
        console.log(master);
  master.forEach(function(d) {  
    var sb = new StringBuffer();        
    sb.append('<li><div class="col1"><div class="cont"><div class="cont-col1"> ');
    sb.append('<div class="label label-sm label-info"> <i class="fa fa-bullhorn"></i> </div>');
    sb.append('</div><div class="cont-col2"><div class="desc">');
    sb.append('<a href="javascript:drawCheckChart();">'+d.da_date+'</a> : [ '+d.start_date+' - '+d.end_date+' ]</div></div></div></div>');
    sb.append('<div class="col2"><div class="date">'+d.time_interval+'mins</div></div></li>');
    console.log('sb : %s', sb.toString());
    $('#masterList').append(sb.toString());
  });
    

}