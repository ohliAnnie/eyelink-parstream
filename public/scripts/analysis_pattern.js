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
  var createdDate = patternLists[0]._id
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
    console.log("sb is" + sb)
    $('#patternList').append(sb.toString());
  });

  drawPatternTree(createdDate)
}

function drawPatterns(creationDate) {
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
        var length = Object.keys(d).length;
        console.log(length);

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

function drawPatternTree(tttt){
  "use strict";
  var test = 222;

  var defaultData = [
    {
      text: 'Voltage',
      href: '#voltage',
      icon: "glyphicon glyphicon-copyright-mark",
      tags: [test],
      nodes: [
        {
          text: 'Normal',
          href: '#v_normal',
          color: 'green',
          tags: ['0']
        },
        {
          text: 'Anomaly',
          href: '#v_anomaly',
          color: 'red',
          tags: ['0']
        },
        {
          text: 'Undefined',
          href: '#v_undefined',
          color: 'gray',
          tags: ['0']
        }
      ]
    },
    {
      text: 'Ampere',
      href: '#ampere',
      icon: "glyphicon glyphicon-copyright-mark",
      tags: ['120'],
      nodes: [
        {
          text: 'Normal',
          href: '#a_normal',
          color: 'green',
          tags: ['0']
        },
        {
          text: 'Anomaly',
          href: '#a_anomaly',
          color: 'red',
          tags: ['0']
        },
        {
          text: 'Undefined',
          href: '#a_undefined',
          color: 'gray',
          tags: ['0']
        }
      ]
    },
    {
      text: 'Active Power',
      href: '#active_power',
      icon: "glyphicon glyphicon-copyright-mark",
      tags: ['120'],
      nodes: [
        {
          text: 'Normal',
          href: '#ap_normal',
          color: 'green',
          tags: ['0']
        },
        {
          text: 'Anomaly',
          href: '#ap_anomaly',
          color: 'red',
          tags: ['0']
        },
        {
          text: 'Undefined',
          href: '#ap_undefined',
          color: 'gray',
          tags: ['0']
        }
      ]
    },
    {
      text: 'Power Factor',
      href: '#power_factor',
      icon: "glyphicon glyphicon-copyright-mark",
      tags: ['120'],
      nodes: [
        {
          text: 'Normal',
          href: '#pf_normal',
          color: 'green',
          tags: ['0']
        },
        {
          text: 'Anomaly',
          href: '#pf_anomaly',
          color: 'red',
          tags: ['0']
        },
        {
          text: 'Undefined',
          href: '#pf_undefined',
          color: 'gray',
          tags: ['0']
        }
      ]
    },
  ];
        $('#patternTree').treeview({
          levels: 1,
          color: '#428bca',
          showTags: true,
          data: defaultData,
          onNodeSelected: function(event, node) {
            console.log(node.text + 'selected')
          },
          onNodeUnselected: function (event, node) {
            console.log(node.text + 'unselected')
          }
        });
      };