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
        //console.log(rtnData);
      //  drawScatterList(rtnDate);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });

