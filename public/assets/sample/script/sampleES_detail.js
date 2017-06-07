  var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {
        return paramPair.split(/=(.+)?/).slice(0, 2);
    }).reduce(function(obj, pairArray) {
        obj[pairArray[0]] = pairArray[1];
        return obj;
    }, {});

console.log(urlParams);

  $.ajax({
    url: "/sample/restapi/selectScatterSection" ,
    dataType: "json",
    type: "get",    
    data: { start : urlParams.start, end : urlParams.end, min : urlParams.min, max : urlParams.max },
    success: function(result) {
      if (result.rtnCode.code == "0000") {                
        drawScatterList(result.rtnData);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });

function drawScatterList(data) {
  var seatvar = document.getElementsByClassName("List");
  var cnt = 0;
  console.log(data);  
  data.forEach(function(d){
    var sb = new StringBuffer();
    if(cnt == 0){
      //sb.append('<tr><th>Start Time</th><th>Path</th><th>Res.(ms)</th><th>Response</th><th>Client IP</th></tr>');
      cnt++;
    }
    var t = d._source.timestamp.split(' ');
    var r = d._source.request.split('?');
    sb.append('<tr><td>'+t[0]+'</td><td>'+r[0]+'</td><td>'+d._source.responsetime+
      '</td><td>'+d._source.response+'</td><td>'+d._source.clientip+'</td></tr>');
    $('#List').append(sb.toString());
  });
  
}