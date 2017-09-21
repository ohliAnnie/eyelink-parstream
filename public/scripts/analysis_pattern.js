function getPatternList() {
  "use strict";
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();

  console.log('%s, %s', sdate, edate);
  $.ajax({
    url: "/analysis/restapi/getAnomalyPatternList" ,
    dataType: "json",
    type: "get",
    data: { startDate:sdate, endDate:edate },
    success: function(result) {
      if (result.rtnCode.code == "0000") {
        console.log(result);
        var patternLists = result.rtnData;
        drawPatternList(patternLists);
      }
    },
    error: function(req, status, err) {
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawPatternList(patternLists) {
  "use strict";
  console.log(patternLists);
  var seatvar = document.getElementsByClassName("patternList");
  var cnt = 0;
  $('#patternList').empty();
  var createdDate = patternLists[0]._id;
  patternLists.forEach(function(d) {
    //d = d._source.pattern_data;
    d = d._id;
    console.log("d is " + d);
    var sb = new StringBuffer();

    if(cnt == 0) {
      //sb.append('<tr><th>Creation Date</th><th></th></tr>');
      cnt++;
    }
    sb.append('<tr><td><a onclick="clickLinkFunc(this)">' + d+'</td>');
    console.log("sb is" + sb);
    $('#patternList').append(sb.toString());
  });

  $("#lblCreatedDate").empty();
  $("#lblCreatedDate").append(createdDate);
  loadPatternData(createdDate);
}

function loadPatternData(creationDate) {
  "use strict";
  $.ajax({
    url: "/analysis/restapi/getPatterns" ,
    dataType: "json",
    type: "get",
    data: {id : creationDate},
    success: function(result) {
      if (result.rtnCode.code == "0000") {
        console.log(result);
        var d = result.rtnData.pattern_info;
        var length = Object.keys(d.ampere).length;
        console.log(length);
        console.log(Object.keys(d));

        drawPatternTree(creationDate, d);

        // for (var key in d){
        //   console.log(key + '==>' + d[key]);
        // }
        //console.log(d);
        //drawCheckCluster(set, daDate, factor);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawPatternTree(creationDate, TreeData){
  "use strict";
  console.log("treeData ==>");
  console.log(TreeData);
  var treeNode = [];
  for(var group in TreeData){
    var normalCnt = 0;
    var cautionCnt =0;
    var anomalyCnt = 0;
    var undefineCnt = 0;

    // tree node count
    for(var cno in TreeData[group]){
      if (TreeData[group][cno] === "normal") {
        normalCnt += 1;
      }
      else if (TreeData[group][cno] === "caution") {
        cautionCnt += 1;
      }
      else if (TreeData[group][cno] === "anomaly") {
        anomalyCnt += 1;
      }
      if (TreeData[group][cno] === "undefined") {
        undefineCnt += 1;
      }
    }

    var totalCnt = normalCnt + cautionCnt + anomalyCnt + undefineCnt;

    var nodeData = {'text': group,
      href: '#'+ group,
      icon: "glyphicon glyphicon-copyright-mark",
      tags: [totalCnt],
      nodes: [
        {
          text: "normal",
          href: '#' + group + '-normal',
          color: "green",
          tags: [normalCnt]
        },
        {
          text: "caution",
          href: '#' + group + '-caution',
          color: "blue",
          tags: [cautionCnt]
        },
        {
          text: "anomaly",
          href: '#' + group + '-anomaly',
          color: "red",
          tags: [anomalyCnt]
        },
        {
          text: "undefined",
          href: '#' + group + '-undefined',
          color: "gray",
          tags: [undefineCnt]
        }
      ]
    };

    treeNode.push(nodeData);
  }
  console.log(treeNode)
  // construct patternTree
  $('#patternTree').treeview({
    levels: 1,
    color: '#428bca',
    showTags: true,
    data: treeNode,

    onNodeSelected: function(event, node) {
      console.log(node.href + ' is selected');
      var nodeText = node.href.replace(/\#/g,'');
      var nodeText = nodeText.split('-');
      console.log(nodeText[0]);
      console.log(nodeText[1]);
      var parentNode = nodeText[0];
      var childNode = nodeText[1];

      drawPatterns(creationDate, parentNode, childNode, TreeData);

      if(nodeText[1] == undefined){
        console.log("zzzzz")
      }


    }
  });
}

function drawPatterns(creationDate, parentNode, childNode, patternData) {
  d3.selectAll("svg").remove();
  var seatvar = document.getElementsByClassName("tblPatterns");
  var cnt = 0
  $('#tblPatterns').empty();
  console.log(typeof(patternData));
  var sb = new StringBuffer();
  var headTag = '<thead><tr>' +
    '<th style="text-align:center"></th>' +
    '<th style="text-align:center"> Group </th>' +
    '<th style="text-align:center"> Cluster No. </th>' +
    '<th width=0 style="text-align:center"> Status </th>' +
    '<th style="text-align:center"></th>' +
  '</tr></thead>';
  sb.append(headTag);
  sb.append('<tbody class="patternBody">');

  if(childNode == undefined) {
    for (cno in patternData[parentNode]){
      var selectTag = statusCheck(patternData[parentNode][cno]);
      var dataTag = '<tr>' +
        '<td><input type="checkbox" name="patternChk" ></td>'+
        '<td>' + parentNode + '</td>' +
        '<td><a href="#" class="clickPattern">' + cno + '</td>' +
        '<td><select name="status" class="form-control input-small select2me form-md-line-input">' +
        selectTag + '</td>' +
        '<td><input type="button" class="updateBtn" value="update" /></td>' +
      '</tr>';
      sb.append(dataTag);
    }
    sb.append("</tbody>");
  }
  else{
    for (cno in patternData[parentNode]){
      if (patternData[parentNode][cno] == childNode) {
        var selectTag = statusCheck(patternData[parentNode][cno]);
        var dataTag = '<tr>' +
          '<td><input type="checkbox" name="patternChk" ></td>'+
          '<td>' + parentNode + '</td>' +
          '<td><a href="#" class="clickPattern">' + cno + '</td>' +
          '<td><select name="status" class="form-control input-small select2me form-md-line-input">' +
          selectTag + '</td>' +
          '<td><input type="button" class="updateBtn" value="update" /></td>' +
        '</tr>';
        sb.append(dataTag);
      }
    }
    sb.append("</tbody>");
  }


    //sb.append('<tr><td>' + parentNode + '</td></tr>');
  $('#tblPatterns').append(sb.toString());

  $(".updateBtn").click(function(){
    var updateBtn = $(this);
    var td = updateBtn.parent().parent().children();
    console.log(td.eq(1).text());

    if(confirm("저장 하시겠습니까?")) {
      var id = creationDate;
      var queryBody = {};
      var fG = td.eq(1).text();
      var cN = td.eq(2).text();
      var sV = td.eq(3).children().val();
      queryBody[cN] = sV;
      queryBody = JSON.stringify(queryBody);
      console.log(queryBody);
      $.ajax({
        url: "/analysis/pattern_info/" + id + "/_update",
        dataType: "json",
        type: "POST",
        data:{ factorGroup : fG, qBody : queryBody},
        success: function(result) {
          alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
          if (result.rtnCode.code == "D002") {
            //location.href = "/analysis/pattern";
            // pattern tree data reload
            loadPatternData(id);
          }
        },
        error: function(req, status, err) {

          //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
          $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
        }
      });
    }
  });

  $('.clickPattern').click(function(){
    var id = creationDate;
    var clickPattern = $(this);
    var td = clickPattern.parent().parent().children();

    var factGroup = td.eq(1).text();
    var clusterNo = td.eq(2).text();
    var target = "pattern_data." + factGroup + ".center." + clusterNo;

    //var state = td.eq(3).text();
    console.log(target);

    $.ajax({
      url: "/analysis/restapi/getClusterPattern" ,
      dataType: "json",
      type: "get",
      data: {id : creationDate, target : target},
      success: function(result) {
        if (result.rtnCode.code == "0000") {
          console.log(result);
          var d = result.rtnData.pattern_data;
          var graphData = d[factGroup]["center"][clusterNo];
          var set = [];
          var maxval = 0;
          var minval = 1000;

          console.log(graphData);
          for(i=0; i<graphData.length; i++){
            set.push({ x : i, y : graphData[i]});
            if(graphData[i] > maxval){
              maxval = graphData[i];
            }
            else if(graphData[i] < minval){
              minval = graphData[i];
            }
          };
          console.log(set);
          console.log(minval, maxval);

          d3.selectAll("svg").remove();
          drawPatternChart(set, minval, maxval);
        } else {

        }
      },
      error: function(req, status, err) {
        //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
      }
    });
  });
}

function updateCheckedAll() {
  
}

function drawPatternChart(dataset, minval, maxval) {
  // 그래프를 그려야 함!!!!!
  var margin = {top: 10, right: 20, bottom: 20, left: 40},
    width = (window.innerWidth*0.3) - margin.left - margin.right,
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

  var svg = d3.select("#patternChart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.left + margin.bottom)
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    xScale.domain([0, d3.max(dataset, function(d){ return d.x; })]);
    yScale.domain([0, d3.max(dataset, function(d){ return d.y; })]);

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
        .data([dataset])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line);
}

///// status select option //////
function statusCheck(statechk) {
  var optionTag;
  if (statechk === 'normal'){
    optionTag = '<option value="normal" selected>normal</option>' +
      '<option value="caution">caution</option>' +
      '<option value="anomaly">anomaly</option>' +
      '<option value="undefined">undefined</option></select>'
  }
  else if (statechk === 'caution') {
    optionTag = '<option value="normal">normal</option>' +
      '<option value="caution" selected>caution</option>' +
      '<option value="anomaly">anomaly</option>' +
      '<option value="undefined">undefined</option></select>'
  }
  else if (statechk === 'anomaly') {
    optionTag = '<option value="normal">normal</option>' +
      '<option value="caution">caution</option>' +
      '<option value="anomaly" selected>anomaly</option>' +
      '<option value="undefined">undefined</option></select>'
  }
  else {
    optionTag = '<option value="normal">normal</option>' +
      '<option value="caution">caution</option>' +
      '<option value="anomaly">anomaly</option>' +
      '<option value="undefined" selected>undefined</option></select>'
  }
  return optionTag;
}
