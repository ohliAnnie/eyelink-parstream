function getPatternList() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();

  console.log('%s, %s', sdate, edate);
  $.ajax({
    url: "/analysis/restapi/getAnomalyPatternList" ,
    dataType: "json",
    type: "get",
    data: { startDate:sdate, endDate:edate },
    success: function(result) {
      if (result.rtnCode.code == "0000") {
        console.log(result);
        var patternList = result.rtnData;          
        drawPatternList(patternList);
      }
    },
    error: function(req, status, err) {
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawPatternList(patternList) {
  console.log(patternList)
  var seatvar = document.getElementsByClassName("patternHistory");
  var cnt = 0
  $('#patternHistory').empty();
  patternList.forEach(function(d) { 
    d = d._source.pattern_data;  
    console.log(d);
    var sb = new StringBuffer();
    if(cnt == 0) {
      sb.append('<tr><th>Creation Date</th><th></th></tr>');
      cnt++;
    }
    sb.append('<tr><td><a href="#" onclick="clickfunc(this)">' + d.creation_Date+'</td>');

    $('#patternHistory').append(sb.toString());
  });
}

function drawPatterns(creationDate) {  
  $.ajax({
    url: "/analysis/restapi/getPatterns" ,
    dataType: "json",
    type: "get",
    data: {_id : creationDate},
    success: function(result) {
      if (result.rtnCode.code == "0000") {        
        console.log(result);
        var d = result.rtnData;
        console.log(d);
        
        //drawCheckCluster(set, daDate, factor);
      } else {
        //- $("#errormsg")[html(result[message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}