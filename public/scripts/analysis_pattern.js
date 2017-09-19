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
    sb.append('<tr><td><a href="#" onclick="clickLinkFunc(this)">' + d+'</td>');
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

  for (cno in patternData[parentNode]){
    var selectTag = statusCheck(patternData[parentNode].cno)
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
    //sb.append('<tr><td>' + parentNode + '</td></tr>');
  $('#tblPatterns').append(sb.toString());

  $(".updateBtn").click(function(){
    var updateBtn = $(this);
    var tr = updateBtn.parent().parent();
    var td = tr.children();
    console.log(td.eq(1).text());
  });

  // $('.patternBody tr').click(function(obj) {
  //   if(obj.target.type == 'status') return;
  //   var tr = $(this);
  //   var td = tr.children();

  //   console.log("모든데이터 : " + creationDate + td.eq(0).text());
  // });

  $('.clickPattern').click(function(){
    var id = creationDate;
    var clickPattern = $(this);
    //var tr = clickPattern.parent().parent();
    //var td = tr.children();
    var td = clickPattern.parent().parent().children()
    var target = "pattern_data." + td.eq(1).text() + ".center." + td.eq(2).text();

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
          // var d = result.rtnData.pattern_info;
          // var length = Object.keys(d.ampere).length;
          // console.log(length);
          // console.log(Object.keys(d));

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



  });
}


      


///// status select option //////
function statusCheck(status) {
  var optionTag;
  if (status == 'normal'){
    optionTag = '<option value="normal" selected>normal</option>' +
      '<option value="caution">caution</option>' +
      '<option value="anomaly">anomaly</option>' +
      '<option value="undefined">undefined</option></select>'
  }
  else if (status == 'caution') {
    optionTag = '<option value="normal">normal</option>' +
      '<option value="caution" selected>caution</option>' +
      '<option value="anomaly">anomaly</option>' +
      '<option value="undefined">undefined</option></select>'
  }
  else if (status == 'anomaly') {
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
