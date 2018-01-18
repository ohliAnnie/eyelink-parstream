$(document).ready(function() {
  $("#register-submit-btn").click(function() {
    if ($("#rolename").val() == "") {
      $("#rolename").focus();
      $("#register_tnc_error").html(m.common.check.name);
      $("#register_tnc_error").show();
      return false;
    }      

    // TODO 메시지 공통 영역으로
    if (confirm(m.common.confirm.save)) {
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