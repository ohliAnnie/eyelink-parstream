 $(document).ready(function() {
  $('a').click(function(event){
    //- event.preventDefault();
    if ('deleteUser' != $(this).attr('flag')) return;     
    var userid = $(this).attr('userid');
    if (userid == "") { return false; }
    // TODO 메시지 공통 영역으로
    if (confirm("삭제 하시겠습니까? ")) {
      var in_data = { url : "/management/users/"+userid, type : "DELETE", data : { userid : userid } };
      ajaxTypeData(in_data, function(result){
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D003") {
          location.href = "/management/users";
        }
      });
    }
  });


});
