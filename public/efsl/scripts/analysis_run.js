$(document).ready(function(e) {
  var dateFormat = 'YYYY-MM-DD';
  var dateFormat = 'YYYY-MM-DD';
  var daDate = '';
  $('#sdate').val(moment().format(dateFormat));
  $('#edate').val(moment().format(dateFormat));
  $('#btn_runanalysis').click(function() {
    var interval = $("select[name=interval]").val();
    runAnalysis(interval);
  });
});

function runAnalysis(interval) {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();    
  // TO-DO message config로 처리함.
  if (confirm("분석에 시간이 걸릴수 있어 Background로 작업이 수행됩니다.\n 진행하시겠습니까? ")) {
    var data = { startDate:sdate, endDate:edate , interval:interval };
    var in_data = { url : "/analysis/restapi/runAnalysis", type : "POST", data : data };  
    ajaxTypeData(in_data, function(result){
      if (result.rtnCode.code == "0000") {
        var master = result.rtnData;        
      }
    });
  }
}
