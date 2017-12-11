$(document).ready(function() {
  $('#btn_search').click(function() {

  })

  $('#add-recipe-btn').click(function() {
    if ($("#id").val() == "") {
      $("#id").focus();
      $("#register_tnc_error").html("ID를 입력하세요.");
      $("#register_tnc_error").show();
      return false;
    }

    // TODO 메시지 공통 영역으로
    if (confirm("저장 하시겠습니까? ")) {
      var id = $("#id").val();
      var data = $('#add_recipe').serialize();
      var in_data = { url : "/management/recipe/"+id, type : "PUT", data : data };
      ajaxTypeData(in_data, function(result){
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D002") {
          location.href = "/management/recipe";
        }
      });
    }
  })

  // Check ID 버튼을 클릭한 경우
  $('#check_id').click(function() {
    console.log('check_id click');
    if ($("#id").val() == "") {
      $("#id").focus();
      $("#register_tnc_error").html("ID를 입력하세요.");
      $("#register_tnc_error").show();
      return false;
    }
    var id = $("#id").val();
    var in_data = { url : "/management/restapi/checkId/"+id, type : "GET", data : null };
    ajaxTypeData(in_data, function(result) {
      $('#modal-message').html('(' + result.rtnCode.code + ')' +result.rtnCode.message)
      $('#modal_check_id').modal("show");
    });
  })
});

function showHistoryView() {
  document.getElementById("historyDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
