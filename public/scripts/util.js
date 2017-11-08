// 기준날짜에 일자를 더하거나 빼준다.
function addDays(date, numOfDays) {
  date.setTime(date.getTime() + (86400000 * numOfDays));
  return date;
}

// Java의 StringBuffer 기능 구현.
var StringBuffer = function() {
  this.buffer = new Array();
};
StringBuffer.prototype.append = function(str) {
  this.buffer[this.buffer.length] = str;
};
StringBuffer.prototype.toString = function() {
  return this.buffer.join("");
};

function ajaxTypeData(data, callback) {
  $.ajax({
    url: data.url,
    dataType: "json",
    type: data.type,
    data: data.data,
    success: callback,
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}