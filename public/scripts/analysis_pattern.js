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
    sb.append('<tr><td><a href="#" onclick="clickfunc(this)">' + d+'</td>');
    console.log("sb is" + sb);
    $('#patternList').append(sb.toString());
  });

  loadPatternData(createdDate);
}

function loadPatternData(creationDate) {
  "use strict";
  $.ajax({
    url: "/analysis/restapi/getPatterns" ,
    dataType: "json",
    type: "get",
    data: {_id : creationDate},
    success: function(result) {
      if (result.rtnCode.code == "0000") {
        console.log(result);
        var d = result.rtnData.pattern_info;
        var length = Object.keys(d.ampere).length;
        console.log(length);
        console.log(Object.keys(d));

        drawPatternTree(d);

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

function drawPatternTree(TreeData){
  "use strict";
  console.log("treeData ==>");
  console.log(TreeData);
  var treeNode = [];
  for(var group in TreeData){
    var normalCnt = 0;
    var anomalyCnt = 0;
    var undefineCnt = 0;

    // tree node count
    for(var cno in TreeData[group]){
      if (TreeData[group][cno] === "normal") {
        normalCnt += 1;
      }
      else if (TreeData[group][cno] === "anomaly") {
        anomalyCnt += 1;
      }
      if (TreeData[group][cno] === "undefined") {
        undefineCnt += 1;
      }
    }

    var totalCnt = normalCnt + anomalyCnt + undefineCnt;

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

      drawPatterns(parentNode, childNode, TreeData);

      if(nodeText[1] == undefined){
        console.log("zzzzz")
      }


    }
  });
}

function drawPatterns(parentNode, childNode, patternData) {
  d3.selectAll("svg").remove();
  var seatvar = document.getElementsByClassName("tblPatterns");
  var cnt = 0
  $('#tblPatterns').empty();
  console.log(typeof(patternData));
  var sb = new StringBuffer();
  var headTag = '<tr>' +
    '<th style="text-align:center"> Group </th>' +
    '<th style="text-align:center"> Cluster No. </th>' +
    '<th style="text-align:center"> Status </th>' +
    '<th style="text-align:center"> Edit </th>' +
  '</tr>';
  sb.append(headTag);

  // if (childNode == undefined){
  //     for (cno in patternData[parentNode]){
  //       var dataTag = '<tr>' +
  //         '<td>' + parentNode + '</td>' +
  //         '<td>' + cno + '</td>' +
  //         '<td>' + patternData[parentNode].cno + '</td>' +
  //       '</tr>';
  //       sb.append(dataTag);
  // }
  // else {
  //   for (cno in patternData[parentNode]){
  //       var dataTag = '<tr>' +
  //         '<td>' + parentNode + '</td>' +
  //         '<td>' + patternData[parentNode] + '</td>' +
  //         '<td>' + patternData[parentNode].cno + '</td>' +
  //       '</tr>';
  //       sb.append(dataTag);
  // }
  //   }
  for (cno in patternData[parentNode]){

    var dataTag = '<tr>' +
      '<td>' + parentNode + '</td>' +
      '<td>' + cno + '</td>' +
      '<td>' + patternData[parentNode].cno + '</td>' +
    '</tr>';
    sb.append(dataTag);
  }

    //sb.append('<tr><td>' + parentNode + '</td></tr>');
  $('#tblPatterns').append(sb.toString());
}

        // '<select name="interval" class="form-control input-small select2me form-md-line-input">' +
        // '<option value="normal">normal</option>' +
        // '<option value="anomaly">anomaly</option>' +
        // '<option value="undefined">undefined</option>' +
        // '</select>' +
