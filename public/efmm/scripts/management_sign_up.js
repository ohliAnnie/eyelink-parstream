 $(document).ready(function() {
  $("#register-submit-btn").click(function() {
    if ($("#userid").val() == "") {
      $("#userid").focus();
      $("#register_tnc_error").html(m.common.check.id);
      $("#register_tnc_error").show();
      return false;
    }
    if ($("#username").val() == "") {
      $("#username").focus();
      $("#register_tnc_error").html(m.common.check.name);
      $("#register_tnc_error").show();
      return false;
    }
    if ($("#register_password").val() == "") {
      $("#register_password").focus();
      $("#register_tnc_error").html(m.user.check.password);
      $("#register_tnc_error").show();
      return false;
    } else if ($("#register_password").val() != $("#register_password_1").val()) {
      $("#register_password").focus();
      $("#register_tnc_error").html(m.user.check.pass_match);
      $("#register_tnc_error").show();
      return false;
    }
    if ($("#email").val() == "") {
      $("#email").focus();
      $("#register_tnc_error").html(m.user.check.email);
      $("#register_tnc_error").show();
      return false;
    } else {
      var a = $("#email").val().split('@');      
      if (a[1] == null) {
        $("#email").focus();
        $("#register_tnc_error").html(m.user.check.email_form);
        $("#register_tnc_error").show();
        return false;
      }
    }

    // TODO 메시지 공통 영역으로
    if (confirm(m.common.confirm.add)) {
      var userid = $("#userid").val();
      var data = $('#create_account').serialize();
      var in_data = { url : "/management/users/"+userid, type : "POST", data : data };
      ajaxTypeData(in_data, function(result){
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D001") {
          location.href = "/management/users";
        }
      });
    }
  });

  $("#userid").keydown(function() {
    $("#register_tnc_error").html("");
    $("#register_tnc_error").hide();
  });
  $("#username").keydown(function() {
    $("#register_tnc_error").html("");
    $("#register_tnc_error").hide();
  });     
});