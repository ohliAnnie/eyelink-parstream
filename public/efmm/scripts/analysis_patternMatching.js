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

  $('#step, #machine').change(function(){
    // TODO : 전체 차트 refresh
    d3.selectAll("svg").remove();
    getMatchingList();
  });
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
  var stime = String(dateConvert(startDt));

  // let step = $('#step option:selected').text();
  // let machine = $('#machine option:selected').text();
  let step_machine = $('#step_machine option:selected').text();
  let step = step_machine.split('_')[0];
  let machine = step_machine.split('_')[1];
  var data = { startDate: stime, endDate: basetime, step:step, machine:machine };
  var in_data = { url: "/analysis/restapi/getMatchingPattern", type: "POST", data:data};
  ajaxTypeData(in_data, function(result){
    // console.log('getPatternList[CODE]:', result.rtnCode.code);
    if (result.rtnCode.code == "0000") {
      var matchingList = result.rtnData;
      console.log('[getMatchingPattern] result: ',matchingList);
      drawMatchingHistory(matchingList, machine);
    }
  });
}


function drawMatchingHistory(matchingList, machine) {
  $('#tblMatchingList').empty();
  var sb = new StringBuffer();
  sb.append('<div class="portlet-body form"><div class="historyTable" style="height:auto">');
  sb.append('<table class="table table-striped table-bordered table-hover" id="dtPattern">');
  sb.append('<thead><tr><th></th>');
  sb.append('<th colspan="2"> Availability </th><th colspan="2"> Overall OEE </th><th colspan="2"> Performance </th><th colspan="2"> Quality </th></tr>');
  sb.append('<tr><th> Matching Time </th><th>cluster</th><th>status</th><th>cluster</th><th>status</th><th>cluster</th><th>status</th><th>cluster</th><th>status</th></tr>');
  sb.append('</thead><tbody>');

  console.log(matchingList);
  matchingList.forEach(function(d) {
    d = d._source[machine];
    var matchingTime = d.timestamp.replace('T', ' ');
    console.log(d);

    sb.append('<tr><td>' + matchingTime + '</td>');
    sb.append('<td><a class="clickPattern" factor="availability">' + d.availability.top_1 + '</td>');
    sb.append('<td>' + d.availability.status.status + '</td>');
    sb.append('<td><a class="clickPattern" factor="overall_oee">' + d.overall_oee.top_1 + '</td>');
    sb.append('<td>' + d.overall_oee.status.status + '</td>');
    sb.append('<td><a class="clickPattern" factor="performance">' + d.performance.top_1 + '</td>');
    sb.append('<td>' + d.performance.status.status + '</td>');
    sb.append('<td><a class="clickPattern" factor="quality">' + d.quality.top_1 + '</td>');
    sb.append('<td>' + d.quality.status.status + '</td>');
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

    var factor = $(this).attr("factor");
    var rowIdx = $('#dtPattern').dataTable().fnGetPosition($(this).closest('tr')[0]);
    var targetData = matchingList[rowIdx]._source[machine][factor];
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
    realSet.push({ x : i, y : (targetData.realValue[i] * 100).toFixed(2)});
  }
  for (i=0; i<targetData.top_1_value.length; i++) {
    top1Set.push({ x : i, y : (targetData.top_1_value[i] * 100).toFixed(2)});
    top2Set.push({ x : i, y : (targetData.top_2_value[i] * 100).toFixed(2)});
    top3Set.push({ x : i, y : (targetData.top_3_value[i] * 100).toFixed(2)});
  }

  var array = targetData.top_1_value.concat(targetData.top_2_value, targetData.top_3_value, targetData.realValue);
  var minVal = Math.min.apply(null,array) * 100;
  var maxVal = Math.max.apply(null,array) * 100;

  graphData.realSet = realSet;
  graphData.top1Set = top1Set;
  graphData.top1rate = targetData.top_1_rate;
  graphData.top2Set = top2Set;
  graphData.top2rate = targetData.top_2_rate;
  graphData.top3Set = top3Set;
  graphData.top3rate = targetData.top_3_rate;
  graphData.minVal = minVal;
  graphData.maxVal = maxVal;

  console.log(graphData);
  return graphData;
}


function drawPatternChart(graphData){

  var margin = {top: 30, right: 65, bottom: 30, left: 55},
                // width = (window.innerWidth*0.37) - margin.left - margin.right,
                width = $('#patternChart').parent().width() - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

  let legendMarginTop = 0;
  let legendMarginLeft = 55;
  let legendWidth  = 380, legendHeight = 25;
  var svgLegend = d3.select("#patternChart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", 25)
      .append("g")
          .attr("transform", "translate(" + legendMarginLeft + "," + legendMarginTop + ")");

  var legend = svgSet(svgLegend, 'g', 'legend', 0 , 0);

  rectLegendBG(legend, 'legend-bg', legendWidth, legendHeight);

  pathLegend(legend, 'realLine', 'M15,13L40,13');
  textLegend(legend, 48, 17, 'Real');

  pathLegend(legend, 'top1Line', 'M90,13L115,13');
  textLegend(legend, 123, 17, 'Top1 ('+graphData.top1rate.toFixed(1)+')');

  pathLegend(legend, 'top2Line', 'M185,13L210,13');
  textLegend(legend, 218, 17, 'Top2 ('+graphData.top2rate.toFixed(1)+')');

  pathLegend(legend, 'top3Line', 'M280,13L305,13');
  textLegend(legend, 313, 17, 'Top3 ('+graphData.top3rate.toFixed(1)+')');

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.linear().range([height, 0]);

  var svg = d3.select("#patternChart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.left + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  xScale.domain([0, d3.max(graphData.top1Set, function(d){ return d.x; })]);
  yScale.domain([graphData.minVal-(graphData.minVal/4), graphData.maxVal+(graphData.minVal/10)]);


  // Add the X Axis
  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .innerTickSize(-height)
      .outerTickSize(1)
      .tickPadding(10);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Add the Y Axis
  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .innerTickSize(-width)
      .outerTickSize(1)
      .tickPadding(10);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Add Lines
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

  svg.append("path")
      .data([graphData.top1Set])
      .attr("fill", "none")
      // .attr("stroke", "darkgreen")
      .attr('class', 'top1Line')
      .attr("opacity", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", top1Line);

  // svg.append("text")
  //     .data([graphData.top1Set[graphData.top1Set.length-1]])
  //     .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
  //     .attr("x", 3)
  //     .attr("dy", "0.35em")
  //     .style("font", "10px sans-serif")
  //     .text(graphData.top1rate);

  svg.append("path")
      .data([graphData.top2Set])
      .attr("fill", "none")
      // .attr("stroke", "steelblue")
      .attr('class', 'top2Line')
      .attr("opacity", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", top2Line);

  // svg.append("text")
  //     .data([graphData.top2Set[graphData.top2Set.length-1]])
  //     .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
  //     .attr("x", 3)
  //     .attr("dy", "0.35em")
  //     .style("font", "10px sans-serif")
  //     .text(graphData.top2rate);

  svg.append("path")
      .data([graphData.top3Set])
      .attr("fill", "none")
      // .attr("stroke", "tan")
      .attr('class', 'top3Line')
      .attr("opacity", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", top3Line);

  // svg.append("text")
  //     .data([graphData.top3Set[graphData.top3Set.length-1]])
  //     .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
  //     .attr("x", 3)
  //     .attr("dy", "0.35em")
  //     .style("font", "10px sans-serif")
  //     .text(graphData.top3rate);

  svg.append("path")
      .data([graphData.realSet])
      .attr("fill", "none")
      // .attr("stroke", "crimson")
      .attr('class', 'realLine')
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", realLine);
}

function rectLegendBG(legend, className, width, height) {
  return legend
    .append('rect')
    .attr('class', className)
    .attr('width', width)
    .attr('height', height)
}

function textLegend(legend, x, y, text){
  return legend
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .text(text)
}

function pathLegend(legend, className, d) {
  return legend
    .append('path')
    .attr('class', className)
    .attr('d', d);
}

function svgSet(svg, append, className, tX, tY){
  return svg
    .append(append)
    .attr('class', className)
    .attr('transform', 'translate('+tX+','+tY+')');
}