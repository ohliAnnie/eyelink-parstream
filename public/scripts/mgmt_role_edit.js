$(document).ready(function() {
  $("#register-submit-btn").click(function() {
    if ($("#rolename").val() == "") {
      $("#rolename").focus();
      $("#register_tnc_error").html("Role Name를 입력하세요.");
      $("#register_tnc_error").show();
      return false;
    }      

    // TODO 메시지 공통 영역으로
    if (confirm("저장 하시겠습니까? ")) {
      var roleid = $("#roleid").val();
      var data = $('#update_account').serialize();
      var in_data = { url : "/management/role/"+roleid, type : "PUT", data : data };
      ajaxTypeData(in_data, function(result){            
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D002") {
          location.href = "/management/role";
        }        
      });
    }
  });
  $("#rolename").keydown(function() {
    $("#register_tnc_error").html("");
    $("#register_tnc_error").hide();
  });
});