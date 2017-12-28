$(document).ready(function() {
  initRuleList();

  $('#list-add-btn').click(function() {
    gotViewAddRule();
  })

  $('#new-save-rule-btn').click(function() {
    addNewRuleBtn();
  })

  $('#edit-save-rule-btn').click(function() {
    saveEditRuleBtn();
  })

  $('#edit-delete-rule-btn').click(function() {
    deleteEditRuleBtn();
  })

  $('#cancel-rule-btn').click(function() {
    window.history.back()
  })

  $('#history-rule-btn').click(function() {
    showHistoryView();
  })


  // Check ID 버튼을 클릭한 경우
  $('#check_id').click(function() {
    checkId();
  })

  $('#id').change(function() {
    $('#checked_id').val('');
    changeErrMsg(false, '');
  });

  $('#type').change(function() {
    makeSelectOption($('#rule_name'), commoncode.rulename[$('#type').val()]);
  });
});

function initRuleList() {
}

function gotViewAddRule() {
  location.href = '/management/rule/NEW';
}

function goViewEditRule(vId) {
  location.href = '/management/rule/'+ vId;
}

function addNewRuleBtn() {
  if(checkInvalidInput()) return false;

  // TODO 메시지 공통 영역으로
  if (confirm(m.common.confirm.save)) {
    var id = $("#id").val();
    var data = $('#add_rule').serialize();
    var in_data = { url : "/management/rule/"+id, type : "POST", data : data };
    ajaxTypeData(in_data, function(result){
      alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
      if (result.rtnCode.code == "D001") {
        goRuleListPage();
      }
    });
  }
}

function saveEditRuleBtn() {
  if(checkInvalidInput()) return false;

  // TODO 메시지 공통 영역으로
  if (confirm(m.common.confirm.save)) {
    var id = $("#_id").val();
    var data = $('#update_rule').serialize();
    var in_data = { url : "/management/rule/"+id, type : "PUT", data : data };
    ajaxTypeData(in_data, function(result){
      alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
      if (result.rtnCode.code == "D002") {
        goRuleListPage();
      }
    });
  }
}

function deleteEditRuleBtn() {
  // TODO 메시지 공통 영역으로
  if (confirm(m.common.confirm.delete)) {
    var id = $("#_id").val();
    var data = $('#update_rule').serialize();
    var in_data = { url : "/management/rule/"+id, type : "DELETE", data : data };
    ajaxTypeData(in_data, function(result){
      alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
      if (result.rtnCode.code == "D003") {
        goRuleListPage();
      }
    });
  }
}

function goRuleListPage() {
  location.href = "/management/rule";
}

function changeErrMsg(isShow, msg) {
  $("#register_tnc_error").html(msg);
  if (isShow)
    $("#register_tnc_error").show();
  else
    $("#register_tnc_error").hide();
}

function checkInvalidInput() {
  if (checkInputValue($("#type"), m.rule.check.type)) return true;
  if (checkInputValue($("#rule_name"), m.rule.check.rule_name)) return true;
  if (checkInputValue($("#user_group"), m.rule.check.user_group)) return true;
  if (checkInputValue($("#condition"), m.rule.check.condition)) return true;
  if (checkInputValue($("#threshold"), m.rule.check.threshold)) return true;
  return false;
}

function checkInputValue(obj, msg) {
  if (obj.val() == "") {
    obj.focus();
    changeErrMsg(true, msg);
    return true;
  }
  return false;
}

