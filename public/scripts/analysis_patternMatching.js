// 날짜 변환 함수
function dateConvert(date){
  "use strict";
  function pad(num) {
    num = num + '';
    return num.length < 2 ? '0' + num : num;
  }
  return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":00"
}

function getMatchingList() {
  "use strict";
  var basetime = $('#baseTime').val() + ':59';
  var timeRange = $('select[name=timeRange').val();
  var startDt = new Date(Date.parse(basetime) - (1000*60*timeRange));
  var endDt = new Date(Date.parse(basetime) + (1000*60*timeRange));
  var stime = dateConvert(startDt)
  var etime = dateConvert(endDt)
  console.log('%s, %s', stime, etime);

  $.ajax({
    url: "/analysis/restapi/getAnomaly_Pattern",
    dataType: "json",
    type: "get",
    data: { startTime:stime, endTime:etime },
    success: function(result) {
      if (result.rtnCode.code == "0000") {
        var matchingList = result.rtnData;
        console.log(matchingList);
        drawMatchingHistory(matchingList);
        //test(matchingList);
      }
    },
    error: function (req, status, err) {
      $("#errormsg").html("code:" + status + "\n" + "message:" + req.responseText + "\n" + "error:" + err);
    }
  });
}

function test(matchingList){
  var testdata = [];

  matchingList.forEach(function(d) {
    d = d._source.analysis;
    testdata.push(d);
  });
  console.log("tetset");
  console.log(testdata);

  //$('#matchingList').empty();
  $('#matchingList').DataTable({
    data : testdata,
    "columns" : [
      {title: "matching time", data: "timestamp"},
      {title: "voltage", data: "voltage_status",
        render: function(data, type, row, meta){
          if(type == 'display'){
            data = '<a href="#" class="clickV">' + data + '</a>';
          }
          return data;
        }
      },
      {title: "ampere", data: "ampere_status",
        render: function(data, type, row, meta){
          if(type == 'display'){
            data = '<a href="#" class="clickA">' + data + '</a>';
          }
          return data;
        }
      },
      {title: "active_power", data: "active_power_status",
        render: function(data, type, row, meta){
          if(type == 'display'){
            data = '<a href="#" class="clickAP">' + data + '</a>';
          }
          return data;
        }
      },
      {title: "power_factor", data: "power_factor_status",
        render: function(data, type, row, meta){
          if(type == 'display'){
            data = '<a href="#" class="clickPF">' + data + '</a>';
          }
          return data;
        }
      },
      {title: "v_cluster", data: "voltage"},
      {title: "a_cluster", data: "ampere"},
      {title: "ap_cluster", data: "active_power"},
      {title: "pf_cluster", data: "power_factor"}
    ],
    "columnDefs": [
      {"targets": [5,6,7,8], "visible": false}
    ]
  });
}

function clickPattern(factor,timestamp,clusterNo){
  console.log(factor, timestamp, clusterNo);
}

function drawMatchingHistory(matchingList) {
  "use strict";
  var seatvar = document.getElementsByClassName("matchingList");
  var cnt = 0;
  $('#matchingList').empty();
  var sb = new StringBuffer();
  matchingList.forEach(function(d) {
    d = d._source.analysis;
    var listkey = d.timestamp.replace('T', ' ');
    if(cnt == 0) {
      var headTag = '<thead><tr>' +
        '<th style="text-align:center"> Matching time </th>' +
        '<th style="text-align:center"> voltage </th>' +
        '<th style="text-align:center"> ampere </th>' +
        '<th style="text-align:center"> active_power </th>' +
        '<th style="text-align:center"> power_factor </th>' +
        // '<th style="display:none;"> v_status </th>' +
        // '<th style="display:none;"> a_status </th>' +
        // '<th style="display:none;"> ap_status </th>' +
        // '<th style="display:none;"> pf_status </th>' +
        '</tr></thead>';
      sb.append(headTag);
      sb.append('<tbody class="matchingListBody">');
      cnt++;
    }
    var preTag = '<td style="text-align:center"><a onclick="javascript_:clickPattern('
    var dataTag = '<tr><td style="text-align:center">' + listkey +'</td>' +
      preTag + "'voltage'," + "'" + d.timestamp + "','" + d.voltage+ "'" + ')">' + d.voltage_status +'</td>' +
      preTag + "'ampere'," + "'" + d.timestamp + "','" + d.ampere+ "'" + ')">' + d.ampere_status +'</td>' +
      preTag + "'active_power'," + "'" + d.timestamp + "','" + d.active_power+ "'" + ')">' + d.active_power_status +'</td>' +
      preTag + "'power_factor'," + "'" + d.timestamp + "','" + d.power_factor+ "'" + ')">' + d.power_factor_status +'</td>' +
      '</tr>';
    sb.append(dataTag);
  });
  sb.append("</tbody>");
  $('#matchingList').append(sb.toString());

  $('.clickStatus').click(function(){
      // var th = $('#matchingList th').eq($(this).index());

      // console.log(th.text());
      // console.log($(this).index())

      var clickStatus = $(this);
      var col = clickStatus.parent().children().index($(this));
      var row = clickStatus.parent().parent().children().index($(this).parent());
      var title = clickStatus.closest("table").find("th").eq(row).text();

//      var name = clickStatus.html()
      console.log(col);
      console.log(row);
      console.log(title);

      //console.log(col)

      // var td0 = td.eq(0).text();
      // var td1 = td.eq(1).text();
      // var td2 = td.eq(2).text();
      // var td3 = td.eq(3).text();
      // var td4 = td.eq(4).text();
      // var td5 = td.eq(5).text();
      // var td6 = td.eq(6).text();
      // //var state = td.eq(3).text();
      // console.log(td0, td1, td2, td3, td4, td5, td6);
  });

}

