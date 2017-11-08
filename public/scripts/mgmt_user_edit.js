$(document).ready(function() {
  $("#register-submit-btn").click(function() {
    if ($("#username").val() == "") {
      $("#username").focus();
      $("#register_tnc_error").html("User Name를 입력하세요.");
      $("#register_tnc_error").show();
      return false;
    }
    if ($("#register_password").val() == "") {
      $("#register_password").focus();
      $("#register_tnc_error").html("Password 를 입력하세요.");
      $("#register_tnc_error").show();
      return false;
    } else if ($("#register_password").val() != $("#register_password_1").val()) {
      $("#register_password").focus();
      $("#register_tnc_error").html("Password가 다릅니다. 다시 입력하세요.");
      $("#register_tnc_error").show();
      return false;
    }
    if ($("#email").val() == "") {
      $("#email").focus();
      $("#register_tnc_error").html("Email을 입력하세요.");
      $("#register_tnc_error").show();
      return false;
    } else {
      var a = $("#email").val().split('@');
      console.log(a);
      if (a[1] == null) {
        $("#email").focus();
        $("#register_tnc_error").html("Email주소를 정확히 입력하세요");
        $("#register_tnc_error").show();
        return false;
      }
    }

    // TODO 메시지 공통 영역으로
    if (confirm("저장 하시겠습니까? ")) {
      var userid = $("#userid").val();
      var data = $('#update_account').serialize();
      var in_data = { url : "/management/users/"+userid, type : "PUT", data : data };
      ajaxTypeData(in_data, function(result){      
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D002") {
          location.href = "/management/users";
        }
      });
    }
  });

  $("#username").keydown(function() {
    $("#register_tnc_error").html("");
    $("#register_tnc_error").hide();
  });

  $('a').click(function(event){
    //- event.preventDefault();
    if ('deleteMem' != $(this).attr('flag')) return;
    var userid = $('#userid').val();
    var memid = $(this).attr('memid');
    if (memid == "") { return false; }        

    // TODO 메시지 공통 영역으로
    if (confirm("삭제 하시겠습니까? ")) {
      var in_data = { url : "/management/mem/"+memid, type : "DELETE", data : { memid : memid } };;
      ajaxTypeData(in_data, function(result){
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D003") {
          location.href = "/management/users/"+userid;
        }
      });
    }        
  });
});