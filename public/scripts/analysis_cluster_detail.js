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
  nodeList.forEach(function(d) {  

    var sb = new StringBuffer();
    var a = d.c0.split(':');
    var script = "javascript:getNodePower('"+d.c0+"');";
    sb.append('<tr><td><span class="bold theme-fone"><a href="'+script+'"> Cluster0 </a></span></td><td></td></tr>');
    
    for(var i=0; i < a.length; i++) {
      sb.append('<tr><td></td><td>');
      var script = "javascript:clickNode('"+a[i]+"');";
      sb.append('<a class="primary-link" href="'+script+'">' + a[i] + '</a>');
      sb.append('</td></tr>');
    }
    var a = d.c1.split(':');
    var script = "javascript:getNodePower('"+d.c1+"');";
    sb.append('<tr><td><span class="bold theme-fone"><a href="'+script+'"> Cluster1 </a></span></td><td></td></tr>');    
    for(var i=0; i < a.length; i++) {
      sb.append('<tr><td></td><td>');
      var script = "javascript:clickNode('"+a[i]+"');";      
      sb.append('<a class="primary-link" href="'+script+'">' + a[i] + '</a>');
      sb.append('</td></tr>');
    }
    var a = d.c2.split(':');
    var script = "javascript:getNodePower('"+d.c2+"');";
    sb.append('<tr><td><span class="bold theme-fone"><a href="'+script+'"> Cluster2 </a></span></td><td></td></tr>');
    var a = d.c2.split(':');
    for(var i=0; i < a.length; i++) {
      sb.append('<tr><td></td><td>');
      var script = "javascript:clickNode('"+a[i]+"');";      
      sb.append('<a class="primary-link" href="'+script+'">' + a[i] + '</a>');
      sb.append('</td></tr>');
    }
    var a = d.c3.split(':');
    var script = "javascript:getNodePower('"+d.c0+"');";
    sb.append('<tr><td><span class="bold theme-fone"><a href="'+script+'"> Cluster3 </a></span></td><td></td></tr>');
    var a = d.c3.split(':');
    for(var i=0; i < a.length; i++) {
      sb.append('<tr><td></td><td>');
      var script = "javascript:clickNode('"+a[i]+"');";
      sb.append('<a class="primary-link" href="'+script+'">' + a[i] + '</a>');
      sb.append('</td></tr>');
    }
    console.log('sb : %s', sb.toString());
    $('#tblClusterDir').append(sb.toString());
  });
    

}