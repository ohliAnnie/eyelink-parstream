$(document).ready(function() {
  TableManaged.init();
  $('a').click(function(event){
    //- event.preventDefault();
    if ('deleteRole' != $(this).attr('flag')) return;

    var roleid = $(this).attr('roleid');
    var id = $(this).attr('id');
    if (id == "") {
      return false;
    }        
    // TODO 메시지 공통 영역으로
    if (confirm("삭제 하시겠습니까? ")) {
      var in_data = { url : "/management/role/"+roleid, type : "DELETE", data : { id : id } };
      ajaxGetData(in_data, function(result){
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D003") {
          location.href = "/management/role";
        }
      });
    }
  });
});