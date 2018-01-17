$(document).ready(function() {
  TableManaged.init();
  $('a').click(function(event){         
    if ('deleteUser' != $(this).attr('flag')) return;        
    var id = $(this).attr('id');
    var userid = $(this).attr('userid');
    if (id == "") {
      return false;
    }
    var data = { "id" : id };      
    // TODO 메시지 공통 영역으로    
    if (confirm("삭제 하시겠습니까? ")) {
      var in_data = { url : "/management/users/" + userid, type : "DELETE", data : data };
      ajaxTypeData(in_data, function(result){
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D003") {
          location.href = "/management/users";
        }
      });
    }
  });
});