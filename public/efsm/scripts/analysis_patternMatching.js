$(document).ready(function() {
  var dateFormat = 'YYYY-MM-DD HH:mm';
  $('#baseTime').val(moment().format(dateFormat));
  getMatchingList(); // pattern dataset


  $('#btn_search').click(function() {
    d3.selectAll("svg").remove();        
    getMatchingList(); // pattern dataset
  });

  $('#baseTime').datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
    autoclose: true,
    todayBtn: true,
    pickerPosition: "bottom-left"
  });

  // Metronic.init(); // init metronic core componets
  eyelinkLayout.init(); // init eyelinklayout
  // QuickSidebar.init(); // init quick sidebar
  Layout.init(); // init layout
  ComponentsPickers.init();
  TableManaged.init();
});



// 날짜 변환 함수
function dateConvert(date){ 
  function pad(num) {
    num = num + '';
    return num.length < 2 ? '0' + num : num;
  }
  return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":00"
}


function getMatchingList() {
  var basetime = $('#baseTime').val() + ':59';
  var timeRange = $('select[name=timeRange').val();
  var startDt = new Date(Date.parse(basetime) - (1000*60*timeRange));
  // var endDt = new Date(Date.parse(basetime) + (1000*60*timeRange));
  var stime = String(dateConvert(startDt));
  // var etime = String(dateConvert(endDt));
  console.log('%s, %s', stime, basetime);
  
  var data = { startDate: stime, endDate: basetime };
  var in_data = { url: "/analysis/restapi/getMatchingPattern", type: "GET", data:data};
  ajaxTypeData(in_data, function(result){
    console.log('getPatternList[CODE]:', result.rtnCode.code);
    if (result.rtnCode.code == "0000") {
      var matchingList = result.rtnData;
      console.log(matchingList);
      drawMatchingHistory(matchingList);
    }
  });
}


function drawMatchingHistory(matchingList) {
  $('#tblMatchingList').empty();
  var sb = new StringBuffer();
  sb.append('<div class="portlet-body form"><div class="historyTable" style="height:auto">');
  sb.append('<table class="table table-striped table-bordered table-hover" id="dtPattern">');
  sb.append('<thead><tr><th></th><th></th>');
  sb.append('<th colspan="2"> active_power </th><th colspan="2"> ampere </th><th colspan="2"> power_factor </th><th colspan="2"> voltage </th></tr>');
  sb.append('<tr><th></th><th> Matching Time </th><th>cluster</th><th>status</th><th>cluster</th><th>status</th><th>cluster</th><th>status</th><th>cluster</th><th>status</th></tr>');
  sb.append('</thead><tbody>');

  console.log(matchingList);
  matchingList.forEach(function(d) {
    d = d._source.da_result;
    var matchingTime = d.timestamp.replace('T', ' ');
    console.log(d);
    
    sb.append('<tr><td></td><td>' + matchingTime + '</td>');
    sb.append('<td><a class="clickPattern" group="active_power">' + d.active_power.top_1 + '</td>');
    sb.append('<td>' + d.active_power.status.status + '</td>');
    sb.append('<td><a class="clickPattern" group="ampere">' + d.ampere.top_1 + '</td>');
    sb.append('<td>' + d.ampere.status.status + '</td>');
    sb.append('<td><a class="clickPattern" group="power_factor">' + d.power_factor.top_1 + '</td>');
    sb.append('<td>' + d.power_factor.status.status + '</td>');
    sb.append('<td><a class="clickPattern" group="voltage">' + d.voltage.top_1 + '</td>');
    sb.append('<td>' + d.voltage.status.status + '</td>');
    sb.append('</tr>');
  });
  sb.append("</tbody></table></div></div>");
  $('#tblMatchingList').append(sb.toString());
  TableManaged.init();

  ////////// click event //////////
  $('#dtPattern').on('click', '.clickPattern', function(){
    d3.selectAll("svg").remove();
    $('#dtPattern').DataTable().$('.clickPattern').css({'color':'', 'font-weight': ''});
    $(this).css({'color':'red', 'font-weight': 'bold'});

    var group = $(this).attr("group");
    // var top1 = $(this).attr("top1");
    // var top2 = $(this).attr("top2");
    // var top3 = $(this).attr("top3");
    // var matchingTime = $(this).closest('tr')[0].cells[0].innerText;
    // matchingTime = matchingTime.replace(' ', 'T') + 'Z';

    var rowInd = $('#dtPattern').dataTable().fnGetPosition($(this).closest('tr')[0]);
    var targetData = matchingList[rowInd]._source.da_result[group];
    console.log(targetData);

    var graphData = getGraphData(targetData);
    drawPatternChart(graphData);
  });
}

function getGraphData(targetData) {
  graphData = {};
  var realSet = [];
  var top1Set = [];
  var top2Set = [];
  var top3Set = [];

  for (i=0; i<targetData.realValue.length; i++) {
    realSet.push({ x : i, y : targetData.realValue[i].toFixed(2)});
  }
  for (i=0; i<targetData.top_1_value.length; i++) {
    top1Set.push({ x : i, y : targetData.top_1_value[i].toFixed(2)});
    top2Set.push({ x : i, y : targetData.top_2_value[i].toFixed(2)});
    top3Set.push({ x : i, y : targetData.top_3_value[i].toFixed(2)});
  }

  var array = targetData.top_1_value.concat(targetData.top_2_value, targetData.top_3_value, targetData.realValue);
  var minVal = Math.min.apply(null,array);
  var maxVal = Math.max.apply(null,array);

  graphData.realSet = realSet;
  graphData.top1Set = top1Set;
  graphData.top2Set = top2Set;
  graphData.top3Set = top3Set;
  graphData.minVal = minVal;
  graphData.maxVal = maxVal;

  console.log(graphData);
  return graphData;
}


function drawPatternChart(graphData){

  var margin = {top: 30, right: 60, bottom: 30, left: 55},
                width = (window.innerWidth*0.38) - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;
  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .innerTickSize(-height)
      .outerTickSize(1)
      .tickPadding(10);
  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .innerTickSize(-width)
      .outerTickSize(1)
      .tickPadding(10);

  var svg = d3.select("#patternChart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.left + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  xScale.domain([0, d3.max(graphData.top1Set, function(d){ return d.x; })]);
  yScale.domain([graphData.minVal-(graphData.minVal/4), graphData.maxVal+(graphData.minVal/10)]);

  var top1Line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); });
  var top2Line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); });
  var top3Line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); });
  var realLine = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); });

  // Add the X Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Add the Y Axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);


  svg.append("path")
      .data([graphData.top1Set])
      .attr("fill", "none")
      .attr("stroke", "darkgreen")
      .attr("opacity", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 4)
      .attr("d", top1Line);

  svg.append("path")
      .data([graphData.top2Set])
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("opacity", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 4)
      .attr("d", top2Line);

  svg.append("path")
      .data([graphData.top3Set])
      .attr("fill", "none")
      .attr("stroke", "tan")
      .attr("opacity", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 4)
      .attr("d", top3Line);

  svg.append("path")
      .data([graphData.realSet])
      .attr("fill", "none")
      .attr("stroke", "crimson")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 4)
      .attr("d", realLine);

}

