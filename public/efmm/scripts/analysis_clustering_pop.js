jQuery(document).ready(function() {
  var sdate = urlParams.start;
  var edate = urlParams.end;
  var interval = urlParams.interval;
  $('#sdate').val(sdate.split('T')[0]);
  $('#edate').val(edate.split('T')[0]);
  $('#interval').val(interval);
  if ($('#factor0').is(':checked') === true) {
    var machine = $('#factor0').val();
  } else if ($('#factor1').is(':checked') === true) {
    var machine = $('#factor1').val();
  }
  // else if ($('#factor2').is(':checked') === true) {
  //   var factor = $('#factor2').val();
  // } else if ($('#factor3').is(':checked') === true) {
  //   var factor = $('#factor3').val();
  // }
  drawCheckChart(machine);
  getMotorList(machine);
  Metronic.init(); // init metronic core componets
  eyelinkLayout.init(); // init layout
  QuickSidebar.init(); // init quick sidebar
  Layout.init(); // init layout
  Tasks.initDashboardWidget(); // init tash dashboard widget
  $('input[type="radio"]').on('click change', function(e) {
    if (e.target.value === '100' || e.target.value === '200') { // || e.target.value === 'voltage' || e.target.value === 'power_factor') {
      console.log(e.target.value);
      d3.selectAll("svg").remove();
      //d3.selectAll("rect").remove();
      drawCheckChart(e.target.value);
      getMotorList(e.target.value);
    }
  });
});

var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {
  return paramPair.split(/=(.+)?/).slice(0, 2);
}).reduce(function(obj, pairArray) {
  obj[pairArray[0]] = pairArray[1];
  return obj;
}, {});

var dadate = urlParams.dadate.replace('%20', ' ');

function drawCheckChart(machine) {
  var data = {
    dadate: dadate,
    machine: machine
  }
  var in_data = {
    url: "/analysis/restapi/getDaClusterDetail",
    type: "GET",
    data: data
  };
  ajaxTypeData(in_data, function(result) {
    if (result.rtnCode.code == "0000") {
      drawClusteringChart(result.rtnData, dadate, machine);
    }
  });
}

function drawClusteringChart(data, dadate, machine) {

  console.log('[drawClusteringChart] data: ', data, '\n,dadate: ', dadate, '\n,machine: ', machine);

  // #panel-cluster-list 에 동적으로 클러스터 목록 넣기
  let clusterCnt = Object.keys(data[0]).length - 1;
  let dynamicClusters = '';
  let lineCategories = [];
  for ( let idx = 0 ; idx < clusterCnt ; idx++ ){
    dynamicClusters += '<div class="checker" id="uniform-c'+idx+'"><span class="checked"><input class="click_checkbox" id="c'+idx+'" type="checkbox" name="c'+idx+'" value="'+(idx+1) + '" checked="true" v-on="click:checkOpt"></span></div>';
    dynamicClusters += '<text> Cluster'+ idx +'</text>';
    if ( idx == clusterCnt-1 ) {
      // do nothing
    } else {
      dynamicClusters += '<br>';
    }
    lineCategories.push('c'+idx);
  }
  $('#panel-cluster-list').html(dynamicClusters);
  $('.checker').click(function(){
    let element = $(this).children('span:nth-child(1)');
    // let status = element.attr('class');
    element.toggleClass('checked unchecked');
  });

  var demo = new Vue({
    el: '#table',
    data: {
      people_count: 200,
      lineCategory: lineCategories,
      selectCate: lineCategories,
      lineFunc: null
    },
    methods: {
      displayLine: function() {
        var self = this;
        var input = 0;

        //generation function
        function generate(data, id, lineType, axisNum) {
          var margin = {
              top: 14,
              right: 10,
              bottom: 60,
              left: 30
            },
            width = $(id).width() - margin.left - margin.right,
            height = $(id).height() - margin.top - margin.bottom;

          var legendSize = 10,
            color = d3.scale.category20();
          var x = d3.time.scale().range([0, width]);
          var y = d3.scale.linear().range([height, 0]);

          var ddata = (function() {
            var temp = {},
              seriesArr = [];

            self.lineCategory.forEach(function(name) {
              temp[name] = {
                category: name,
                values: []
              };
              seriesArr.push(temp[name]);
            });

            data.forEach(function(d) {
              self.lineCategory.map(function(name) {
                temp[name].values.push({
                  'category': name,
                  'time': new Date(d['time']),
                  'num': d[name]
                });
              });
            });

            return seriesArr;
          })();
          x.domain(d3.extent(data, function(d) {
            return new Date(d.time);
          }));

          y.domain([0, 100]);

          //data.length/10 is set for the garantte of timeseries's fitting effect in svg chart
          var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(7)
            .tickSize(-height)
            .tickPadding([7])
            .orient("bottom");

          var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .tickSize(-width)
            .tickPadding([8])
            .orient("left");

          // Define the div for the tooltip
          var div = d3.select("body").append("div")
            .attr("class", "tip")
            .style("opacity", 0);

          d3.select('#svg-path').remove();

          // 레전드 개수에 따라 한줄에 4개씩 출력하면서 height가 변동되도록 변경 (2017/12/24)
          let dynamicHeight = height + margin.top + margin.bottom + Math.floor(clusterCnt/4)*legendSize*2.3;

          var svg = d3.select(id).append("svg")
            .attr("id", "#svg-path")
            .attr("width", width + margin.right + margin.left)
            // height는 클러스터 개수에 따라 동적 적용
            .attr("height", dynamicHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          let clusterOriginHeight = $('#Cluster').outerHeight();
          $('#Cluster').css('height', dynamicHeight);
          let portlet = $('#Cluster').parents('div.portlet');
          let newPortletHeight = portlet.outerHeight() + Math.abs(clusterOriginHeight - dynamicHeight);
          portlet.css('height', newPortletHeight);

          svg.append("g")
            .attr("class", "x axis")
            .attr("id", "line-x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

          var line = d3.svg.line()
            .interpolate(lineType)
            .x(function(d) {
              return x(d['time']);
            })
            .y(function(d) {
              return y(d['num']);
            });

          var path = svg.append("g")
            .attr("class", "click_path");

          path.selectAll(".click_line")
            .data(ddata)
            .enter()
            .append("path")
            .attr("class", function(d) {
              return "click_line click_line_" + d['category'];
            })
            .attr("d", function(d) {
              return line(d['values']);
            })
            .style("display", function(d) {
              //to check if the checkbox has been selected and decide whether to show it out
              //use display:none and display:inherit to control the display of scatter dots
              if ($("#" + d['category']).prop("checked"))
                return 'inherit';
              else
                return 'none';
            })
            .attr("stroke", function(d) {
              return color(d['category']);
            });

          d3.selectAll('.click_legend').remove();

          var legend = svg.append('g')
            .attr('class', 'click_legend');

          var singLegend = legend.selectAll('.path_legend')
            .data(self.selectCate)
            .enter()
            .append('g')
            .attr('class', 'path_legend')
            .attr('transform', function(d, i) {
              // 한 줄에 4개씩만 뿌리도록 수정 (2017-12-24)
              // console.log('258 d: ',d);
              // return 'translate(' + ((5 + (width - 20) / 4) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
              return 'translate(' + ((5 + (width - 20) / 4) * (i%4) + 5) + ',' + ((height + margin.bottom - legendSize - 15) + ( Math.floor(i/4)*legendSize*2.3 )) + ')';
            });

          singLegend.append('g:rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', function(d) {
              return color(d);
            });

          singLegend.append('g:text')
            .attr('x', legendSize * 1.4)
            .attr('y', legendSize / 1.3)
            .attr('font-size', function() {
              if ($(id).width() > 415)
                return '.9em';
              else {
                return '.55em';
              }
            })
            .text(function(d) {
              // TODO : 동적으로 클러스터 개수만큼 적용해야되는 부분
              // if (d === 'c0') {
              //   var rename = "Cluster0";
              // } else if (d === 'c1') {
              //   var rename = "Cluster1";
              // } else if (d === 'c2') {
              //   var rename = "Cluster2"
              // } else {
              //   var rename = "Cluster3";
              // }
              // return rename;
              return d.replace('c','Cluster');
            });

          //draw the rect for legends
          var rect = svg.append('g')
            .attr("class", 'legendOuter');

          rect.selectAll('.legendRect')
            .data(self.selectCate)
            .enter()
            .append('rect')
            .attr('class', 'legendRect')
            .attr('width', (width - 20) / 4)
            .attr('height', legendSize + 10)
            .attr('transform', function(d, i) {
              // 한 줄에 4개씩만 뿌리도록 수정 (2017-12-24)
              // console.log('306 d: ',d);
              // return 'translate(' + (i * (5 + (width - 20) / 4)) + ',' + (height + margin.bottom - legendSize - 20) + ')';
              return 'translate(' + ((5 + (width - 20) / 4) * (i%4)) + ',' + ((height + margin.bottom - legendSize - 20) + ( Math.floor(i/4)*legendSize*2.3 )) + ')';
            });

          var points = svg.selectAll(".seriesPoints")
            .data(ddata)
            .enter().append("g")
            .attr("class", "seriesPoints");

          points.selectAll(".tipNetPoints")
            .data(function(d) {
              return d['values'];
            })
            .enter().append("circle")
            .attr("class", "tipNetPoints")
            .attr("class", function(d) {
              return "tipNetPoints_" + d['category'];
            })
            .attr("cx", function(d) {
              return x(d['time']);
            })
            .attr("cy", function(d) {
              return y(d['num']);
            })
            .text(function(d) {
              return d['num'];
            })
            .attr("r", "6px")
            .style("fill", "transparent")
            .on("mouseover", function(d) {

              var mainCate = (function() {
                if (d['num'] != 0) {
                  // TODO : 동적으로 클러스터 개수만큼 적용해야되는 부분
                  // if (d['category'] === 'c0') {
                  //   var rename = "Cluster0";
                  // } else if (d['category'] === 'c1') {
                  //   var rename = "Cluster1";
                  // } else if (d['category'] === 'c2') {
                  //   var rename = "Cluster2"
                  // } else {
                  //   var rename = "Cluster3";
                  // }
                  // return rename + ' | ';
                  return d['category'].replace('c','Cluster') + ' | ';
                } else
                  return '';
              })();

              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html(' ' + mainCate + d['num'] + ' ')
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

              svg.append("g")
                .attr("class", "tipDot")
                .append("line")
                .attr("class", "tipDot")
                .transition()
                .duration(50)
                .attr("x1", $(this)[0]['cx']['animVal']['value'])
                .attr("x2", $(this)[0]['cx']['animVal']['value'])
                .attr("y2", height);

              svg.append("polyline")
                .attr("class", "tipDot")
                .style("fill", "white")
                .attr("points", ($(this)[0]['cx']['animVal']['value'] - 3.5) + "," + (0 - 2.5) + "," + $(this)[0]['cx']['animVal']['value'] + "," + (0 + 6) + "," + ($(this)[0]['cx']['animVal']['value'] + 3.5) + "," + (0 - 2.5));

              svg.append("polyline")
                .attr("class", "tipDot")
                .style("fill", "white")
                .attr("points", ($(this)[0]['cx']['animVal']['value'] - 3.5) + "," + (y(0) + 2.5) + "," + $(this)[0]['cx']['animVal']['value'] + "," + (y(0) - 6) + "," + ($(this)[0]['cx']['animVal']['value'] + 3.5) + "," + (y(0) + 2.5));
            })
            .on("mouseout", function(d) {

              div.transition()
                .duration(500)
                .style("opacity", 0);

              var currentX = $(this)[0]['cx']['animVal']['value'];

              d3.select(this).transition().duration(100).style("opacity", 0);

              var ret = $('.tipNetPoints').filter(function(index) {
                return ($(this)[0]['cx']['animVal']['value'] === currentX);
              });

              $.each(ret, function(index, val) {
                $(val).animate({
                  opacity: "0"
                }, 100);
              });

              d3.selectAll('.tipDot').transition().duration(100).remove();
            });

          this.getOpt = function() {
            var axisOpt = new Object();
            axisOpt['x'] = x;
            axisOpt['y'] = y;
            axisOpt['xAxis'] = xAxis;
            axisOpt['legendSize'] = legendSize;
            axisOpt['height'] = height;
            axisOpt['width'] = width;
            axisOpt['margin'] = margin;
            return axisOpt;
          }

          this.getSvg = function() {
            var svgD = new Object();
            svgD['svg'] = svg;
            svgD['path'] = path;
            svgD['line'] = line;
            svgD['rect'] = rect;
            svgD['legend'] = legend;
            svgD['color'] = color;
            svgD['points'] = points;
            return svgD;
          }
        }

        //inits chart
        self.lineFunc = new generate(data, "#Cluster", "linear", 30);
      },
      checkOpt: function(e) {
        var self = this;
        //check the Scatter Choice and Refresh the charts
        var count = 0;
        for (var i = 0; i < self.lineCategory.length; i++) {
          if ($("#" + self.lineCategory[i]).prop("checked"))
            count++;
        }

        //judge if the checked checkbox reach the max limitation
        if (count > 10) {
          alert("NOTICE: The MAXIMUM selection should be TEN.");
          e.target.checked = false;
        }

        self.selectCate = [];
        for (var i = 0; i < self.lineCategory.length; i++) {
          if ($("#" + self.lineCategory[i]).prop("checked")) {
            self.selectCate.push(self.lineCategory[i]);
            d3.selectAll(".click_line_" + self.lineCategory[i]).transition().duration(300).style("display", 'inherit');
            d3.selectAll(".tipNetPoints_" + self.lineCategory[i]).transition().duration(300).style("display", 'inherit');
          } else {
            d3.selectAll(".click_line_" + self.lineCategory[i]).transition().duration(300).style("display", 'none');
            d3.selectAll(".tipNetPoints_" + self.lineCategory[i]).transition().duration(300).style("display", 'none');
          }
        }

        //redraw the legend and chart
        this.legendRedraw(self.selectCate, "#Cluster", self.lineFunc.getSvg()['legend'], self.lineFunc.getSvg()['rect'], self.lineFunc.getOpt()['legendSize'], self.lineFunc.getOpt()['margin'], self.lineFunc.getOpt()['height'], self.lineFunc.getOpt()['width'], self.lineFunc.getSvg()['color']);
      },
      legendRedraw: function(selectCate, id, legend, rect, legendSize, margin, height, width, color) {

        //update the scatter plot legend
        legend.selectAll('.path_legend')
          .data(selectCate)
          .transition()
          .duration(200)
          .attr('transform', function(d, i) {
            // 한 줄에 4개씩만 뿌리도록 수정 (2017-12-24)
            // return 'translate(' + ((5 + (width - 20) / 4) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
            return 'translate(' + ((5 + (width - 20) / 4) * (i%4) + 5) + ',' + ((height + margin.bottom - legendSize - 15) + ( Math.floor(i/4)*legendSize*2.3 )) + ')';
          })

        legend.selectAll('rect')
          .data(selectCate)
          .style('fill', function(d) {
            return color(d);
          });

        legend.selectAll('text')
          .data(selectCate)
          .attr('x', legendSize * 1.4)
          .attr('y', legendSize / 1.3)
          .attr('font-size', function() {
            if ($(id).width() > 415)
              return '.9em';
            else {
              return '.55em';
            }
          })
          .text(function(d) {
            // TODO : 동적으로 클러스터 개수만큼 적용해야되는 부분
            // if (d === 'c0') {
            //   var rename = "Cluster0";
            // } else if (d === 'c1') {
            //   var rename = "Cluster1";
            // } else if (d === 'c2') {
            //   var rename = "Cluster2"
            // } else {
            //   var rename = "Cluster3";
            // }
            // return rename;
            return d.replace('c','Cluster');
          });

        //create new legends
        var singLegend = legend.selectAll('.path_legend')
          .data(selectCate)
          .enter()
          .append('g')
          .attr('class', 'path_legend')
          .attr('transform', function(d, i) {
            // 한 줄에 4개씩만 뿌리도록 수정 (2017-12-24)
            // console.log('514 d: ',d);
            // return 'translate(' + ((5 + (width - 20) / 4) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
            return 'translate(' + ((5 + (width - 20) / 4) * (i%4) + 5) + ',' + ((height + margin.bottom - legendSize - 15) + ( Math.floor(i/4)*legendSize*2.3 )) + ')';
          });

        singLegend.append('rect')
          .attr('width', legendSize)
          .attr('height', legendSize)
          .style('fill', function(d) {
            return color(d);
          });

        singLegend.append('text')
          .attr('x', legendSize * 1.4)
          .attr('y', legendSize / 1.3)
          .attr('font-size', function() {
            if ($(id).width() > 415)
              return '.9em';
            else {
              return '.55em';
            }
          })
          .text(function(d) {
           // TODO : 동적으로 클러스터 개수만큼 적용해야되는 부분
            // if (d === 'c0') {
            //   var rename = "Cluster0";
            // } else if (d === 'c1') {
            //   var rename = "Cluster1";
            // } else if (d === 'c2') {
            //   var rename = "Cluster2"
            // } else {
            //   var rename = "Cluster3";
            // }
            // return rename;
            return d.replace('c','Cluster');
          });

        //remove the old legends
        legend.selectAll('.path_legend')
          .data(selectCate)
          .exit()
          .remove();

        //redraw the rect around the legend
        // rect.selectAll('.legendRect')
        //   .data(selectCate)
        //   .attr('transform', function(d, i) {
        //     // 한 줄에 4개씩만 뿌리도록 수정 (2017-12-24)
        //     console.log('561 d: ',d);
        //     // return 'translate(' + ((5 + (width - 20) / 4) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
        //     return 'translate(' + ((5 + (width - 20) / 4) * (i%4)) + ',' + ((height + margin.bottom - legendSize - 20) + ( Math.floor(i/4)*legendSize*2.3 )) + ')';
        //   });

        // rect.selectAll('.legendRect')
        //   .data(selectCate)
        //   .enter()
        //   .append('rect')
        //   .attr('class', 'legendRect')
        //   .attr('width', (width - 20) / 4)
        //   .attr('height', legendSize + 10)
        //   .attr('transform', function(d, i) {
        //     // TODO : 한 줄에 4개씩만 뿌리도록 수정
        //     console.log('573 d: ',d);
        //     // return 'translate(' + ((5 + (width - 20) / 4) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
        //     return 'translate(' + ((5 + (width - 20) / 4) * (i%4)) + ',' + ((height + margin.bottom - legendSize - 20) + ( Math.floor(i/4)*legendSize*2.3 )) + ')';
        //   });

        rect.selectAll('.legendRect')
          .data(selectCate)
          .exit()
          .remove();
      }
    },
    compiled: function() {
      var self = this;
      self.displayLine();
    }
  });
}

function getMotorList(machine) {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  var data = {
    dadate: dadate,
    machine: machine
  };
  var in_data = {
    url: "/analysis/restapi/getDaClusterMasterBydadate",
    type: "GET",
    data: data
  };
  ajaxTypeData(in_data, function(result) {
    console.log('[getMotorList.getDaClusterMasterBydadate] result: ', result);
    if (result.rtnCode.code == "0000") {
      drawClusterTree(result.rtnData[machine]);
    }
  });
}

function drawClusterTree(treeData) {
  console.log('treeData: ', treeData);
  $('#cluster-list').empty();

  var treeNode = [];
  for (let group in treeData) {
    var nodeData = getTreeViewData(treeData[group], group);
    treeNode.push(nodeData);
  }
  treeNode.sort(function(obj1, obj2) {
    if (obj1['text'] > obj2['text']) {
      return 1;
    } else {
      return -1;
    }
  });

  // construct tree-view of cluster-list
  $('#cluster-list').treeview({
    levels: 1,
    color: '#428bca',
    showTags: true,
    data: treeNode
  });

  // if (nodeInfo != null){
  //   var nodeText = nodeInfo.href.replace(/#/g,'').split('-');
  //   drawPatterns(creationDate, nodeText[0], nodeText[1], treeData);
  //   $('#cluster-list').treeview('selectNode', [nodeInfo.nodeId, {silent: true}]);
  //   if (nodeInfo.parentId != undefined){
  //     $('#cluster-list').treeview('expandNode', [nodeInfo.parentId, {levels:2, silent: true}]);
  //   }
  // }

  // TODO : 클릭시 차트 그려주는 로직
  // 노드 선택시 이벤트
  $('#cluster-list').on('nodeSelected', function(event, node) {
    console.log('selected node: ', node.href);
    // var nodeText = node.href.replace(/#/g, '');
    // nodeText = nodeText.split('-');
    // var parentNode = nodeText[0];
    // var childNode = nodeText[1];
    // drawPatterns(creationDate, parentNode, childNode, treeData);
    // $('#sample_2').dataTable().fnPageChange('first');
    if ( node.href.startsWith('#') ){
      // 클러스터 그룹 선택시
      // 해당 클러스터 그룹내 모터 개수가 5개(max값 설정) 이하일 시
      let motorNames = treeData[node.href.replace('#','')];
      getNodePower(motorNames);
      // 이상일 시에는 div창 띄워서 선택하도록

    } else {
      // 모터 이름 선택시
      // 하단의 4개 차트 그려주기
      clickMotorName(node.href);
    }
  });

}
function getTreeViewData(motorNames, group) {
  var clusteredMotorCnt = motorNames.length;

  let nodes = [];
  for (let idx in motorNames) {
    let node = '{ "text": "' + motorNames[idx] + '", "href": "'+ motorNames[idx] +'","color": "#000"}';
    nodes.push(JSON.parse(node));
  }
  var treeViewData = {
    'text': group,
    href: '#' + group,
    icon: 'glyphicon glyphicon-copyright-mark',
    tags: [clusteredMotorCnt],
    nodes: nodes
  };
  return treeViewData;
}

function drawDirectory(data) {
  var seatvar = document.getElementsByClassName("tblClusterDir");
  var cnt = 0;
  $('#tblClusterDir').empty();
  var sb = new StringBuffer();
  if (cnt == 0) {
    sb.append('<tr><th>Cluster</th><th>Motor Name</th></tr>');
    cnt++;
  }
  if (data.cluster_00.length != 0) {
    sb.append(clusterNodeList(data.cluster_00, 'cluster_00'));
  }
  if (data.cluster_01.length != 0) {
    sb.append(clusterNodeList(data.cluster_01, 'cluster_01'));
  }
  if (data.cluster_02.length != 0) {
    sb.append(clusterNodeList(data.cluster_02, 'cluster_02'));
  }
  if (data.cluster_03.length != 0) {
    sb.append(clusterNodeList(data.cluster_03, 'cluster_03'));
  }
  // if(data.cluster_04.length != 0) {
  //   sb.append(clusterNodeList(data.cluster_04, 'cluster_04'));
  // }
  $('#tblClusterDir').append(sb.toString());
}

function clusterNodeList(data, clusterName) {
  var sb = '<tr><td><span class="bold theme-fone">' + clusterName + '</span></td><td></td></tr>';
  for (var i = 0; i < data.length; i++) {
    sb += '<tr><td></td><td>';
    var script = "javascript:getNodePower('" + data[i] + "');"; // data[i] == Motor Name
    sb += '<a class="primary-link" href="' + script + '">' + data[i] + '</a></td></tr>';
  }
  return sb;
  //-----------------------------origin--------------------
  // var sb = '<tr><td><span class="bold theme-fone">' + clusterName + '</span></td><td></td></tr>';
  // for (var i = 0; i < data.length; i++) {
  //   sb += '<tr><td></td><td>';
  //   var script = "javascript:getNodePower('" + data[i] + "');"; // data[i] == Motor Name
  //   sb += '<a class="primary-link" href="' + script + '">' + data[i] + '</a></td></tr>';
  // }
  // return sb;
  //---------------------------efsm-------------------------
  // var script = "javascript:getNodePower('"+data+"',"+data.length+");";
  // var sb = '<tr><td><span class="bold theme-fone"><a href="'+script+'">'+clusterName+'</a></span></td><td></td></tr>';
  // for(var i=0; i < data.length; i++) {
  //   sb +='<tr><td></td><td>';
  //   var script = "javascript:clickMotorName('"+data[i]+"');";
  //   sb +='<a class="primary-link" href="'+script+'">' + data[i] + '</a></td></tr>';
  // }
  // return sb;
}

function getNodePower(motorNames) {
  // TODO : 여러 모터에 대한 차트를 그릴 수 있도록 수정
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();

  // TODO : 장비 번호 동적으로 적용가능하도록 수정 필요
  if ($('#factor0').is(':checked') === true) {
    var factor = $('#factor0').val();
  } else if ($('#factor1').is(':checked') === true) {
    var factor = $('#factor1').val();
  } else if ($('#factor2').is(':checked') === true) {
    var factor = $('#factor2').val();
  } else if ($('#factor3').is(':checked') === true) {
    var factor = $('#factor3').val();
  }
  console.log('factor: ',factor);

  var idCnt = motorNames.length;
  var start = urlParams.start;
  var end = urlParams.end;
  var last, start;

  var data = {
    startDate: start,
    endDate: end,
    motorNames: motorNames,
    machine: factor,
    isForClusterChart: true,
    interval: $('#interval').val()
  };
  var in_data = {
    url: "/analysis/restapi/getClusterRawDataByMotorPop",
    type: "POST",
    data: data
  };
  ajaxTypeData(in_data, function(result) {
    if (result.rtnCode.code == "0000") {
      console.log('[getNodePower.getClusterRawDataByMotorPop] output: ', result.rtnData);
      // drawNode(result.rtnData, motorNames.split(',').length, len);
      drawNode(result.rtnData, motorNames.length);
    } else {
      //- $("#errormsg").html(result.message);
    }
  });
}

var oldL = 0;

function drawNode(rtnData, idCnt) {
  // idCnt = 1; // 1개만 그릴 때
  // len = 1; // 1개만 그릴 때
  console.log('[drawNode] rtnData: ', rtnData);

  var data = rtnData.data;
  var max = rtnData.max + 5;
  for (var i = 0; i <= oldL; i++) {
    d3.select("#clusterChart").select("svg").remove();
  }
  oldL = idCnt;
  var sdate = new Date(data[0].time);
  var edate = new Date(data[data.length - 1].time);

  // Set the dimensions of the canvas / graph
  var margin = {
      top: 5,
      right: 20,
      bottom: 20,
      left: 30
    },
    width = (window.innerWidth * 0.3) - margin.left - margin.right,
    height = 315 - margin.top - margin.bottom - 15 * idCnt / 4;
  //- (20*(idCnt/(width/100)));

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
  var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

  // Define the line
  var priceline = d3.svg.line()
    .x(function(d) {
      return x(new Date(d.time));
    })
    .y(function(d) {
      return y(d.value);
    });


  // Adds the svg canvas
  var svg = d3.select("#clusterChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) {
    return new Date(d.time);
  }));
  y.domain([0, max]);

  // Nest the entries by symbol
  var dataNest = d3.nest()
    .key(function(d) {
      return d.id;
    })
    .entries(data);

  var color = d3.scale.category20();

  // Loop through each symbol / key
  dataNest.forEach(function(d, i) { // ******
    svg.append("path")
      .attr("class", "line")
      .style("stroke", function() { // Add the colours dynamically
        return d.color = color(d.key);
      })
      .attr("d", priceline(d.values));

    var legend = d3.select("#clusterChart").append("svg")
      .attr("class", "legend")
      // .attr("width", 50 + d.key.length*20)
      .attr("width", width/4)
      .attr("height", 15)
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function() { // dynamic colours    // *******
        return d.color = color(d.key);
      });

    legend.append("text")
      // .attr("x", 50)
      .attr("x", 20)
      .attr("y", 7)
      .attr("dy", ".25em")
      .text(d.key);
  });

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
}

function clickMotorName(motorName) {
  // 팝업 하단에 선택된 모터의 전후 2개씩의 모터에 대한 정보 조회 및 차트 그리기
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  let machine = $('.machine-label>label.active>input').val();
  let motorNames = getRelatedMotorNames(motorName);
  var data = {
    startDate: sdate,
    endDate: edate,
    motorNames: motorNames,
    machine: machine,
    isForClusterChart: false,
    interval: $('#interval').val()
  };
  var in_data = {
    url: "/analysis/restapi/getClusterRawDataByMotorPop",
    type: "POST",
    data: data
  };
  ajaxTypeData(in_data, function(result) {
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;
      drawTimeseries(data);
    } else {
      //- $("#errormsg").html(result.message);
    }
  });
}

function getRelatedMotorNames(motorName) {
  let motorNamesArr = ['sepa_unwind', 'sepa_epc', 'feeding_roll', 'an_el_supply_x', 'ca_el_supply_x', 'an_align_y1',
    'an_align_y2', 'an_align_x', 'an_el_supply_z', 'ca_el_supply_z', 'ca_align_y1',
    'ca_align_y2', 'ca_align_x', 'sepa_guide_y', 'sub_epc', 'swing_s', 'swing_an_z',
    'swing_ca_z', 'stack_table_z', 'stack_anode_mandrel_x1', 'stack_anode_mandrel_x2',
    'stack_anode_mandrel_z', 'stack_cathode_mandrel_x1', 'stack_cathode_mandrel_x2',
    'stack_cathode_mandrel_z', 'cutter_y', 'pull_s', 'pull_y', 'winder_x1', 'winder_x2',
    'winder_s1', 'winder_s2', 'bonding_x', 'bonding_z', 'turn_table_x', 'turn_table_s',
    'unloader_y', 'an_mgn_l_z', 'an_el_l_z', 'ca_mgn_l_z', 'ca_el_l_z',
    'unloader_z', 'stack_sepa_guide_z', 'swing_an_z-sub', 'swing_ca_z-sub'
  ];

  let motorNamesResult = ['', '', '', ''];

  for (let i = 0; i < motorNamesArr.length; i++) {
    // console.log('momtorName: ',motorName,', motorNamesArr[i]: ',motorNamesArr[i]);

    if (motorNamesArr[i] == motorName) {
      if (i >= 2)
        motorNamesResult[0] = motorNamesArr[i - 2];
      if (i >= 1)
        motorNamesResult[1] = motorNamesArr[i - 1];
      if (i <= motorNamesArr.length - 1)
        motorNamesResult[2] = motorNamesArr[i + 1];
      if (i <= motorNamesArr.length - 2)
        motorNamesResult[3] = motorNamesArr[i + 2];
      break;
    }
  }
  console.log('[getRelatedMotorNames] : ', motorNamesResult);
  return motorNamesResult;
}

function drawTimeseries(data) {
  console.log('[drawTimeseries] data: ', data);

  // TODO : key에 따라 차트 그리기
  d3.select("#ts-chart01").select("svg").remove();
  d3.select("#ts-chart02").select("svg").remove();
  d3.select("#ts-chart03").select("svg").remove();
  d3.select("#ts-chart04").select("svg").remove();

  let keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    let chartInfo = data[keys[i]];
    console.log('[chartInfo]', chartInfo);
    let chartData = chartInfo.data;
    console.log('[chartData]', chartData);

    if (chartInfo.chartIdx == 0) {
      var chartName = '#ts-chart01';
      chart01 = d3.timeseries()
        .addSerie(chartData, {
          x: 'time',
          y: keys[i]
        }, {
          interpolate: 'linear'
        })
        // .xscale.tickFormat(d3.time.format("%b %d"))
        .width(window.innerWidth * 0.2)
        .height(270)
        // .yscale.tickFormat(french_locale.numberFormat(",f"))
        .margin.left(0);
      chart01(chartName);
      $('#1th-factor').text(keys[i]);
    } else if (chartInfo.chartIdx == 1) {
      var chartName = '#ts-chart02';
      chart02 = d3.timeseries()
        .addSerie(chartData, {
          x: 'time',
          y: keys[i]
        }, {
          interpolate: 'linear'
        })
        // .xscale.tickFormat(french_timeformat)
        .width(window.innerWidth * 0.2)
        .height(270)
        // .yscale.tickFormat(french_locale.numberFormat(",f"))
        .margin.left(0);
      chart02(chartName);
      $('#2th-factor').text(keys[i]);
    } else if (chartInfo.chartIdx == 2) {
      chartName = '#ts-chart03';
      chart03 = d3.timeseries()
        .addSerie(chartData, {
          x: 'time',
          y: keys[i]
        }, {
          interpolate: 'linear'
        })
        // .xscale.tickFormat(french_timeformat)
        .width(window.innerWidth * 0.2)
        .height(270)
        // .yscale.tickFormat(french_locale.numberFormat(",f"))
        .margin.left(0);
      chart03(chartName);
      $('#3th-factor').text(keys[i]);
    } else if (chartInfo.chartIdx == 3) {
      chartName = '#ts-chart04';
      chart04 = d3.timeseries()
        .addSerie(chartData, {
          x: 'time',
          y: keys[i]
        }, {
          interpolate: 'linear'
        })
        // .xscale.tickFormat(french_timeformat)
        .width(window.innerWidth * 0.2)
        .height(270)
        // .yscale.tickFormat(french_locale.numberFormat(",f"))
        .margin.left(0);
      chart04(chartName);
      $('#4th-factor').text(keys[i]);
    } else {
      // do nothing
    }
  }

}