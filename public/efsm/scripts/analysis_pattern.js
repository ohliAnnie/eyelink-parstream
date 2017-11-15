$(document).ready(function() {
  var dateFormat = 'YYYY-MM-DD';      
  $('#sdate').val(moment().format(dateFormat));
  $('#edate').val(moment().format(dateFormat));
  getPatternList() // pattern dataset

  $('#btn_search').on('click', function(){
    d3.selectAll("svg").remove();
    getPatternList(); // pattern dataset
  });
});


function getPatternList() {
  var sdate = $('#sdate').val() + "T00:00:00";
  var edate = $('#edate').val() + "T23:59:59";
  var masterId = "master";
  var nodeInfo = null;
  console.log("sDate : %s, eDate : %s", sdate, edate);
  var data = { startDate: sdate, endDate: edate, masterId: masterId };
  var in_data = {url: "/analysis/restapi/getAnomalyPatternList", type: "GET", data: data};
  ajaxTypeData(in_data, function(result){
    console.log('getPatternList[CODE]:', result.rtnCode.code);
    if (result.rtnCode.code == "0000") {
      drawPatternList(result.rtnData, nodeInfo);
    }
  });
}

///// draw pattern lists /////
function drawPatternList(patternLists, nodeInfo) {
  console.log("patternLists : ", patternLists);
  $('#patternList').empty();
  var createdDate = patternLists[0]._id;
  patternLists.forEach(function(d) {
    d = d._id;
    var sb = new StringBuffer();
    if (d == 'master'){
      sb.append('<tr><th style="font-weight:bold"><a class="clickPatternId">' + d + '</th></tr>');
    } else {
      sb.append('<tr><td><a class="clickPatternId">' + d +'</td>');
    }
    $('#patternList').append(sb.toString());
  });

  loadPatternData(createdDate, nodeInfo);

  // 생성된 패턴ID 클릭 이벤트
  $('.clickPatternId').on('click', function(){
    var creationDate = $(this)[0].innerText || $(this)[0].textContent;
    loadPatternData(creationDate, nodeInfo);
  });
}


function loadPatternData(createdDate, nodeInfo) {
  console.log('nodeInfo',nodeInfo);
  $("#lblCreatedDate").empty();
  $("#lblCreatedDate").append(createdDate);
  $("#lblCreatedDate").hide();
  $("#lblGroup").empty();
  $("#lblGroup").append('parent - child node');
  d3.selectAll("svg").remove();
  $("#sample_2").dataTable().fnClearTable();

  var data = {id : createdDate};
  var in_data = {url: "/analysis/restapi/getPatterns", type: "GET", data: data};
  ajaxTypeData(in_data, function(result){
    console.log('loadPatternData[CODE]:', result.rtnCode.code);
    if (result.rtnCode.code == "0000") {
      var d = result.patternData;
      var treeData = sortObject(d);
      drawPatternTree(createdDate, treeData, nodeInfo);
    }
  });
}


function sortObject(obj) {
  var sorted = {};
  Object.keys(obj).sort().forEach(function(key) { sorted[key] = obj[key]; });
  return sorted;
}


function drawPatternTree(creationDate, treeData, nodeInfo) {
  var treeNode = [];
  for(var group in treeData){
    var nodeData = getNodeData(treeData[group], group);
    treeNode.push(nodeData);
  }
  // construct patternTree
  $('#patternTree').treeview({
    levels: 1,
    color: '#428bca',
    showTags: true,
    data: treeNode
  });

  if (nodeInfo != null){
    var nodeText = nodeInfo.href.replace(/#/g,'').split('-');
    drawPatterns(creationDate, nodeText[0], nodeText[1], treeData);
    $('#patternTree').treeview('selectNode', [nodeInfo.nodeId, {silent: true}]);
    if (nodeInfo.parentId != undefined){
      $('#patternTree').treeview('expandNode', [nodeInfo.parentId, {levels:2, silent: true}]);
    }
  }

  /// 노드 선택시 이벤트
  $('#patternTree').on('nodeSelected', function(event, node){
    console.log('selected node: ', node.href);
    var nodeText = node.href.replace(/#/g,'');
    nodeText = nodeText.split('-');
    var parentNode = nodeText[0];
    var childNode = nodeText[1];
    drawPatterns(creationDate, parentNode, childNode, treeData);
    $("#sample_2").dataTable().fnPageChange('first');
  });
}


function getNodeData(treeData, group){
  var normalCnt = 0;
  var cautionCnt =0;
  var anomalyCnt = 0;
  var undefineCnt = 0;
  for(var cno in treeData){
    if (treeData[cno]['status'] === "normal")       { normalCnt += 1; }
    else if (treeData[cno]['status'] === "caution") { cautionCnt += 1; }
    else if (treeData[cno]['status'] === "anomaly") { anomalyCnt += 1; }
    else { undefineCnt += 1; } //undefined
  }
  var totalCnt = normalCnt + cautionCnt + anomalyCnt + undefineCnt;
  var nodeData = {'text': group, href: '#'+ group,
    icon: "glyphicon glyphicon-copyright-mark",
    tags: [totalCnt],
    nodes: [
      { text: "normal", href: '#' + group + '-normal', color: "green", tags: [normalCnt]},
      { text: "caution", href: '#' + group + '-caution', color: "blue", tags: [cautionCnt]},
      { text: "anomaly", href: '#' + group + '-anomaly', color: "red", tags: [anomalyCnt]},
      { text: "undefined", href: '#' + group + '-undefined', color: "gray", tags: [undefineCnt]}
    ]
  };
  return nodeData;
}


function drawPatterns(creationDate, parentNode, childNode, patternData){
  d3.selectAll("svg").remove();
  $("#sample").empty();
  $('#lblGroup').empty();
  $('#lblGroup').append(parentNode);
  if (childNode != undefined) {
    $('#lblGroup').append(' - ', childNode);
  }
  console.log("patternData : ", patternData[parentNode]);
  var selectedNodeData = sortObject(patternData[parentNode]);
  var tableTag = getPatternsData(creationDate, parentNode, childNode, selectedNodeData);

  $('#sample').append(tableTag.toString());
  TableManaged.init();


  ///// Event /////
  // Checkbox event
  $('input[name=chkAll]').click(function(){
    $('input:checkbox').not(this).prop('checked', this.checked); });

  // click event about cluster number in patterns table
  $('#sample_2').on('click', '.clickClustNo', function(){
    d3.selectAll("svg").remove();
    var row = $(this).closest('tr');
    var CN = row[0].cells[1].innerText;
    var masterCN = row[0].cells[2].innerText;
    var tgtCluster = "da_result." + parentNode + "." + CN + ".center"; 
    var tgtMaster = "da_result." + parentNode + "." + masterCN + ".center";
    console.log('[cluster]', CN, '| [master]', masterCN);

    var data = {id : creationDate, targetCluster : tgtCluster, targetMaster: tgtMaster};
    var in_data = {url: "/analysis/restapi/getClusterPattern", type: "GET", data: data};

    ajaxTypeData(in_data, function(result) {
      console.log('clusterClick[CODE]: ', result.rtnCode.code);
      if (result.rtnCode.code == "0000") {
        var patternGraph = result.patternData[parentNode][CN]["center"];
        var masterGraph;
        if (result.masterData == null) { masterGraph = null; }
        else { masterGraph = result.masterData[parentNode][masterCN]["center"]; }
        var graphData = getGraphData(patternGraph, masterGraph);
        drawPatternChart(graphData);
      }
    });
  });

  /// update button click event ///
  $('#sample_2').on('click', '.updateBtn', function(){
    var row = $(this).closest('tr');
    console.log(row);
    var cN = row[0].cells[1].innerText;
    var sV = row.find("option:selected").text(); // status Value
    var queryBody = {};
    queryBody[parentNode] = {};
    queryBody[parentNode][cN] = {};
    queryBody[parentNode][cN].status = sV;
    var updateDate = moment().format('YYYY-MM-DD');
    queryBody[parentNode][cN].updateDate = updateDate;

    var pageNo = ($('#sample_2').dataTable().fnPagingInfo().iPage);
    console.log(pageNo);
    console.log(queryBody);

    if (creationDate == 'master') {
      if (confirm("Do you want to update ?")) {
        modifyPattern(creationDate, queryBody);
      }
    } else {
      if (confirm("Do you want to register as a new pattern ?")) {
        insertNewPattern(creationDate, queryBody);
      }
    }
  });

  $('#btnBatchUpdate').click(function() {
    //updateCheckedAll();
    var nodes =  $('#sample_2').dataTable().fnGetNodes();
    var checkbox = $("input[name=patternChk]:checked", nodes).closest('tr');
    // var numOfCheck = $("input[name=patternChk]:checked", nodes).length;
    var numOfCheck = checkbox.length;

    console.log(checkbox);
    console.log("num of checked:",numOfCheck);

    if(numOfCheck == 0) {
      console.log("There is no checked item");
    } else {
      if(confirm(numOfCheck + "개 항목에 대해 일괄저장 하시겠습니까?")){
        var id = $('#lblCreatedDate').text();
        var queryBody = {};
        var fG = parentNode;
        var updateDate = moment().format('YYYY-MM-DD');
        console.log('id: ', id);
        console.log("fG: ", fG);
        queryBody[fG] = {};

        console.log(checkbox);
        checkbox.each(function(i) {
          
          var cN = checkbox[i].cells[1].innerText;
          var sV = checkbox[i]; // status Value
          console.log(sV);
          queryBody[fG][cN] = {};
          queryBody[fG][cN].status = sV;
          queryBody[fG][cN].updateDate = updateDate;
        });

        console.log(queryBody);


        // var data = queryBody;
        // var in_data = {url: "/analysis/restapi/pattern_info/" + id + "/_update", type: "POST", data: data};
        // ajaxTypeData(in_data, function(result){
        //   if (result.rtnCode.code == "0000") {
        //     var nodeInfo = $('#patternTree').treeview('getSelected');
        //     loadPatternData(id, nodeInfo[0]);
        //   }
        // });
      }
    }
  });



}

function modifyPattern(id, data){
  console.log("modifyPattern start");
  var in_data = {url: "/analysis/restapi/pattern_info/" + id + "/_update", type: "POST", data: data};
  ajaxTypeData(in_data, function(result) {
    alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
    if (result.rtnCode.code == "D002") {
      var nodeInfo = $('#patternTree').treeview('getSelected');
      loadPatternData(id, nodeInfo[0]);
    }
  });
}

//// 선택된 패턴그룹에 대한 패턴 리스트를 보여준다.
function getPatternsData(patternId, pNode, cNode, nodeData) {
  var sb = new StringBuffer();
  sb.append('<div class="portlet-body form"><div class="chart" style="height:auto">');
  sb.append('<table class="table table-striped table-bordered table-hover" id="sample_2">');
  sb.append('<thead><tr><th><input type="checkbox" name="chkAll"></th>');
  sb.append('<th>Cluster #</th><th>Master C#</th><th>Status</th><th></th></tr></thead><tbody>');
  if(cNode == undefined) {
    for (var cno in nodeData){
      var tbTag = statusCheck(patternId, cno, nodeData[cno].masterCN, nodeData[cno].status);
      sb.append(tbTag);
    }
    sb.append("</tbody>");
  } else{
    for (var cno in nodeData){
      if (nodeData[cno].status == cNode) {
        var tbTag = statusCheck(patternId, cno, nodeData[cno].masterCN, nodeData[cno].status);
        sb.append(tbTag);
      }
    }
    sb.append("</tbody>");
  }
  sb.append('</table></div></div>');

  return sb;
}

///// status select option //////
function statusCheck(patternId, cno, masterCN, status) {
  var tag = new StringBuffer();
  var opt = '';

  if (patternId == 'master' || masterCN == 'unknown'){
    tag.append('<tr><td><input type="checkbox" name="patternChk" ></td>');
    tag.append('<td><a class="clickClustNo">' + cno + '</td>');
    tag.append('<td>' + masterCN + '</td>');
    if (status == 'normal'){
      opt = '<option selected>normal</option><option>caution</option><option>anomaly</option><option>undefined</option></select>';
    } else if (status == 'caution'){
      opt = '<option>normal</option><option selected>caution</option><option>anomaly</option><option>undefined</option></select>';
    } else if (status == 'anomaly') {
      opt = '<option>normal</option><option>caution</option><option selected>anomaly</option><option>undefined</option></select>';
    } else if (status == 'undefined') {
      opt = '<option>normal</option><option>caution</option><option>anomaly</option><option selected>undefined</option></select>';
    }
    tag.append('<td><select name="status">' + opt + '</td>');
    tag.append('<td><input type="button" class="updateBtn" value="Update"/></td></tr>');
  } else {
    tag.append('<tr><td></td>');
    tag.append('<td><a class="clickClustNo">' + cno + '</td>');
    tag.append('<td>' + masterCN + '</td>');    
    tag.append('<td>' + status + '</td>');
    tag.append('<td></td></tr>');
  }
  return tag;
}


function getGraphData(pData, mData) {
  graphData = {};
  var pSet = [];
  var mSet = [];

  if (mData == null ){
    for (i=0; i<pData.length; i++) {
      pSet.push({ x : i, y : pData[i]});
    }  
  } else {
    for (i=0; i<pData.length; i++) {
      pSet.push({ x : i, y : pData[i]});
      mSet.push({ x : i, y : mData[i]});
    }
  }
  var minVal = Math.min.apply(null,pData, mData);
  var maxVal = Math.max.apply(null,pData, mData);
  //var graphData = {};
  graphData['pSet'] = pSet;
  graphData['mSet'] = mSet;
  graphData['minVal'] = minVal;
  graphData['maxVal'] = maxVal;

  return graphData;
}


function drawPatternChart(graphData) {
  var margin = {top: 10, right: 90, bottom: 10, left: 55},
                width = (window.innerWidth*0.32) - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;
  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .innerTickSize(-height)
      .outerTickSize(0)
      .tickPadding(10);
  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .innerTickSize(-width)
      .outerTickSize(0)
      .tickPadding(10);

  var line = d3.svg.line()
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); });
  var line2 = d3.svg.line()
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); });

  var svg = d3.select("#patternChart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.left + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  xScale.domain([0, d3.max(graphData.pSet, function(d){ return d.x; })]);
  yScale.domain([graphData.minVal, graphData.maxVal]);

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
      .data([graphData['pSet']])
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", line);

  svg.append("path")
      .data([graphData['mSet']])
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", line2);
}
