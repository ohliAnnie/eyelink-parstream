const maxClusterChartItemCnt = 4;

jQuery(document).ready(function() {
  var sdate = urlParams.start.replace('%20', ' ');
  var edate = urlParams.end.replace('%20', ' ');
  var interval = urlParams.interval;
  $('#sdate').val(sdate);
  $('#edate').val(edate);
  $('#interval').val(interval);  
  drawCheckChart();
  getNodeList();
  Metronic.init(); // init metronic core componets
  eyelinkLayout.init(); // init layout
  QuickSidebar.init(); // init quick sidebar
  Layout.init(); // init layout
  Tasks.initDashboardWidget(); // init tash dashboard widget      
  $('input[type="radio"]').on('click change', function(e) { 
    if(e.target.value === 'ampere' || e.target.value === 'active_power' || e.target.value === 'voltage' || e.target.value === 'power_factor') {
     console.log(e.target.value);
     d3.selectAll("svg").remove();
      //d3.selectAll("rect").remove();
      drawCheckChart();
      getNodeList();
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

function drawCheckChart() {  
  var factor = $('input[type="radio"]:checked').val();  
  var data = { dadate : dadate, factor : factor };
  var in_data = { url : "/analysis/restapi/getDaClusterDetail", type : "GET", data : data };  
  ajaxTypeData(in_data, function(result){      
    if (result.rtnCode.code == "0000") {                    
      drawCheckCluster(result.rtnData, dadate, factor);
    }     
  });
}

var checkClusterHeight = 0;
function drawCheckCluster(data, dadate, factor) {
  let clusterCnt = Object.keys(data[0]).length - 1;
  let dynamicClusters = '';
  let lineCategories = [];
  let nodeCnt = 0;
  for ( let idx = 0 ; idx < clusterCnt ; idx++ ){
    dynamicClusters += '<div class="checker" id="uniform-c'+idx+'"><span class="checked"><input class="click_checkbox" id="c'+idx+'" type="checkbox" name="c'+idx+'" value="'+(idx+1) + '" checked="true" v-on="click:checkOpt"></span></div>';
    // nodeCnt = clusterNames[idx]
    dynamicClusters += '<text> Cluster'+ idx +'</text>';
    // dynamicClusters += '<text> Cluster'+ idx +' (' + nodeCnt + ')</text>';
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
        let width = 0;
        let height = 0;
     //generation function
     function generate(data, id, lineType, axisNum) {
      var margin = {top: 14, right: 10, bottom: 60, left: 30};
      width = $(id).width() - margin.left - margin.right;
      if ( checkClusterHeight == 0 ) {
        checkClusterHeight = $(id).height() - margin.top - margin.bottom;
      }
      height = checkClusterHeight;

      var legendSize = 10,
      color = d3.scale.category20();
      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      var ddata = (function() {
        var temp = {}, seriesArr = [];

        self.lineCategory.forEach(function (name) {
          temp[name] = {category: name, values:[]};
          seriesArr.push(temp[name]);
        });

        data.forEach(function (d) {
          self.lineCategory.map(function (name) {
            temp[name].values.push({'category': name, 'time': new Date(d['time']), 'num': d[name]});
          });
        });
        return seriesArr;
      })();

      x.domain(d3.extent(data, function(d) {
       return new Date(d.time); }));

      if(factor === 'active_power') {
       y.domain([0, 200]);
     } else if(factor === 'ampere') {
       y.domain([0, 1]);
     } else if(factor === 'voltage') {
       y.domain([0, 240]);
     } else if(factor === 'power_factor') {
       y.domain([0, 1.5]);
     }

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

    let dynamicHeight = height + margin.top + margin.bottom + Math.floor(clusterCnt/4)*legendSize*2.3;
    let dynamicWidth = $('#Cluster').width();

    var svg = d3.select(id).append("svg")
    .attr("id", "#svg-path")
    // .attr("width", width + margin.right + margin.left)
    .attr("width", dynamicWidth)
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
    .x(function(d) { return x(d['time']); })
    .y(function(d) { return y(d['num']); });

    var path = svg.append("g")
    .attr("class", "click_path");

    path.selectAll(".click_line")
    .data(ddata)
    .enter()
    .append("path")
    .attr("class", function (d) {
      return "click_line click_line_" + d['category']; })
    .attr("d", function(d) {
     return line(d['values']); })
    .style("display", function (d) {
              //to check if the checkbox has been selected and decide whether to show it out
              //use display:none and display:inherit to control the display of scatter dots
              if ($("#"+d['category']).prop("checked"))
                return 'inherit';
              else
                return 'none';
            })
    .attr("stroke",function (d) { return color(d['category']); });

    d3.selectAll('.click_legend').remove();

    var legend = svg.append('g')
    .attr('class', 'click_legend');

    var singLegend = legend.selectAll('.path_legend')
    .data(self.selectCate)
    .enter()
    .append('g')
    .attr('class', 'path_legend')
    .attr('transform', function(d, i) {
        // 한 줄에 4개씩만 뿌리도록 수정 (2017-12-28)
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
        return 'translate(' + ((5 + (width - 20) / 4) * (i%4)) + ',' + ((height + margin.bottom - legendSize - 20) + ( Math.floor(i/4)*legendSize*2.3 )) + ')';
      });

       var points = svg.selectAll(".seriesPoints")
       .data(ddata)
       .enter().append("g")
       .attr("class", "seriesPoints");

       points.selectAll(".tipNetPoints")
       .data(function (d) { return d['values']; })
       .enter().append("circle")
       .attr("class", "tipNetPoints")
       .attr("class", function(d) { return "tipNetPoints_"+d['category']; })
       .attr("cx", function (d) { return x(d['time']); })
       .attr("cy", function (d) { return y(d['num']); })
       .text(function (d) { return d['num']; })
       .attr("r", "6px")
       .style("fill", "transparent")
       .on("mouseover", function (d) {
        var mainCate = (function() {
          if (d['num'] != 0) {
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
        .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(0-2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(0+6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(0-2.5));

        svg.append("polyline")
        .attr("class", "tipDot")
        .style("fill", "white")
        .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(y(0)+2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(y(0)-6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(y(0)+2.5));
      })
       .on("mouseout",  function (d) {

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
        svgD['color']= color;
        svgD['points'] = points;
        return svgD;
      }
    }

      //inits chart
      self.lineFunc = new generate(data, "#Cluster", "linear",30);
    },
    checkOpt: function (e) {
      var self = this;
      //check the Scatter Choice and Refresh the charts
      var count = 0;
      for (var i=0; i < self.lineCategory.length; i++) {
        if ($("#" + self.lineCategory[i]).prop("checked"))
          count++;
      }

      //judge if the checked checkbox reach the max limitation
      if (count>10) {
        alert("NOTICE: The MAXIMUM selection should be TEN.");
        e.target.checked = false;
      }

      self.selectCate = [];
      for (var i=0; i<self.lineCategory.length; i++) {
        if ($("#"+self.lineCategory[i]).prop("checked")) {          
          self.selectCate.push(self.lineCategory[i]);
          d3.selectAll(".click_line_"+self.lineCategory[i]).transition().duration(300).style("display", 'inherit');
          d3.selectAll(".tipNetPoints_"+self.lineCategory[i]).transition().duration(300).style("display", 'inherit');
        } else {
          d3.selectAll(".click_line_"+self.lineCategory[i]).transition().duration(300).style("display", 'none');
          d3.selectAll(".tipNetPoints_"+self.lineCategory[i]).transition().duration(300).style("display", 'none');
        }          
      }

      //redraw the legend and chart
      this.legendRedraw(self.selectCate, "#Cluster", self.lineFunc.getSvg()['legend'], self.lineFunc.getSvg()['rect'], self.lineFunc.getOpt()['legendSize'], self.lineFunc.getOpt()['margin'], self.lineFunc.getOpt()['height'], self.lineFunc.getOpt()['width'], self.lineFunc.getSvg()['color']);
    },
    legendRedraw: function (selectCate, id, legend, rect, legendSize, margin, height, width, color) {

      //update the scatter plot legend
      legend.selectAll('.path_legend')
      .data(selectCate)
      .transition()
      .duration(200)
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 4) * i + 5) + ',' + ((height + margin.bottom - legendSize - 15)+ ( Math.floor(i/4)*legendSize*2.3 )) + ')';
      })

      legend.selectAll('rect')
      .data(selectCate)
      .style('fill', function(d) {          return color(d);        });

      legend.selectAll('text')
      .data(selectCate)
      .attr('x', legendSize*1.4)
      .attr('y', legendSize/1.3)
      .attr('font-size', function() {
        if ($(id).width() > 415)
          return '.9em';
        else {
          return '.55em';
        }
      })
      .text(function(d) {
        return d.replace('c','Cluster');
      });

      //create new legends
      var singLegend = legend.selectAll('.path_legend')
      .data(selectCate)
      .enter()
      .append('g')
      .attr('class', 'path_legend')
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 4) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
      });

      singLegend.append('rect')
      .attr('width', legendSize)
      .attr('height', legendSize)
      .style('fill', function(d) {
        return color(d);
      });

      singLegend.append('text')
      .attr('x', legendSize*1.4)
      .attr('y', legendSize/1.3)
      .attr('font-size', function() {
        if ($(id).width() > 415)
          return '.9em';
        else {
          return '.55em';
        }
      })
      .text(function(d) {
        return d.replace('c','Cluster');
      });

      //remove the old legends
      legend.selectAll('.path_legend')
      .data(selectCate)
      .exit()
      .remove();

      //redraw the rect around the legend
      rect.selectAll('.legendRect')
      .data(selectCate)
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 4) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
      });

      rect.selectAll('.legendRect')
      .data(selectCate)
      .enter()
      .append('rect')
      .attr('class', 'legendRect')
      .attr('width', (width - 20) / 4)
      .attr('height', legendSize + 10)
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 4) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
      });

      rect.selectAll('.legendRect')
      .data(selectCate)
      .exit()
      .remove();
    }
  },
  compiled: function () {
    var self = this;
    self.displayLine();
  }
});
}

function getNodeList() {      
  var factor = $('input[type="radio"]:checked').val();
  var data = { dadate : dadate, factor : factor };
  var in_data = { url : "/analysis/restapi/getDaClusterMasterByDadate", type : "GET", data : data };  
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {    
      var d = result.rtnData;            
      drawDirectory(d);
    }
  });
}

function drawDirectory(treeData) { 
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

  // 노드 선택시 이벤트
  $('#cluster-list').on('nodeSelected', function(event, node) {
    if ( node.href.startsWith('#') ){
      // 클러스터 그룹 선택시
      let nodeNames = treeData[node.href.replace('#','')];
      getNodePower(nodeNames);

    } else {
      // 모터 이름 선택시
      // 하단의 4개 차트 그려주기
      clickNode(node.href);
    }
  });
}

function getTreeViewData(nodeNames, group) {
  var clusteredNodeCnt = nodeNames.length;

  let nodes = [];
  for (let idx in nodeNames) {
    let node = '{ "text": "' + nodeNames[idx] + '", "href": "'+ nodeNames[idx] +'","color": "#000"}';
    nodes.push(JSON.parse(node));
  }
  var treeViewData = {
    'text': group,
    href: '#' + group,
    icon: 'glyphicon glyphicon-copyright-mark',
    tags: [clusteredNodeCnt],
    nodes: nodes
  };
  return treeViewData;
}

function getNodePower(nodeList){  
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  var factor = $('input[type="radio"]:checked').val();
  var start = urlParams.start.replace('%20', ' ');
  var end = urlParams.end.replace('%20', ' ');
  var data = { startDate:start, endDate:end, nodeId: nodeList, factor : factor };
  var in_data = { url : "/analysis/restapi/getClusterNodePower", type : "GET", data : data };  
  ajaxTypeData(in_data, function(result){ 
    if (result.rtnCode.code == "0000") {              
      drawNode(result.rtnData, result.max, nodeList.length);
    }    
  });  
}
var oldL = 0;
function drawNode(data, maxValue, idCnt) {    
  var max = parseInt(maxValue) + 5;  
  for(var i = 0; i <= oldL; i++) {
    d3.select("#nodeChart").select("svg").remove();
  }
  oldL = idCnt;

  var format = d3.time.format("%Y-%m-%d");
  var sdate = format(new Date(data[0].time));
  var edate = format(new Date(data[data.length-1].time));
  
  // Set the dimensions of the canvas / graph
  var margin = {top: 5, right: 20, bottom: 20, left: 30},
  width = (window.innerWidth*0.3) - margin.left - margin.right,       
  height = 315 - margin.top - margin.bottom - 15*idCnt/4;
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
  .x(function(d) { return x(new Date(d.time)); })
  .y(function(d) { return y(d.value); });


  // Adds the svg canvas
  var svg = d3.select("#nodeChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
    "translate(" + margin.left + "," + margin.top + ")");

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) {
       return new Date(d.time); }));
      y.domain([0, max]); 

  // Nest the entries by symbol
  var dataNest = d3.nest()
  .key(function(d) {return d.id;})
  .entries(data);

  var color = d3.scale.category20();

    legendSpace = width/dataNest.length; // spacing for legend // ******

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) {                           // ******      
      svg.append("path")
      .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
              return d.color = color(d.key); })
            .attr("d", priceline(d.values));

            var legend = d3.select("#nodeChart").append("svg")
            .attr("class", "legend")          
            .attr("width", width/4)
            .attr("height", 15)
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(5," + i * 20 + ")"; });

            legend.append("rect")
            .attr("width", 10)
            .attr("height", 10)
           .style("fill", function() { // dynamic colours    // *******
            return d.color = color(d.key); });

           legend.append("text")
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

  function clickNode(nodeId) {
    var sdate = $('#sdate').val();
    var edate = $('#edate').val();

    var data = {startDate:sdate, endDate:edate, node:nodeId};    
    var in_data = { url : "/analysis/restapi/getClusterRawDataByNode", type : "GET", data : data };  
    ajaxTypeData(in_data, function(result){ 
      if (result.rtnCode.code == "0000") {        
        var data = result.rtnData;           
        drawTimeseries(data);
      }    
    });
  }

  function drawTimeseries(data) {  
   d3.select("#ts-chart01").select("svg").remove();
   d3.select("#ts-chart02").select("svg").remove();
   d3.select("#ts-chart03").select("svg").remove();
   d3.select("#ts-chart04").select("svg").remove();

   var chartName = '#ts-chart01';
   chart01 = d3.timeseries()
   .addSerie(data.power,{x:'time',y:'active_power'},{interpolate:'linear'})
   .addSerie(data.power,{x:'time',y:'ampere'},{interpolate:'step-before'})
   .addSerie(data.power,{x:'time',y:'amount_active_power'},{interpolate:'linear'})
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width(window.innerWidth*0.2)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    chart01(chartName);

    var chartName = '#ts-chart02';
    chart02 = d3.timeseries()
    .addSerie(data.als,{x:'time',y:'als_level'},{interpolate:'step-before'})
    .addSerie(data.als,{x:'time',y:'dimming_level'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width(window.innerWidth*0.2)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    chart02(chartName);

    chartName = '#ts-chart03';
    chart03 = d3.timeseries()
    .addSerie(data.noise,{x:'time',y:'decibel'},{interpolate:'step-before'})
    .addSerie(data.noise,{x:'time',y:'frequency'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width(window.innerWidth*0.2)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    chart03(chartName);

    chartName = '#ts-chart04';
    chart04 = d3.timeseries()
    .addSerie(data.vib,{x:'time',y:'vibration_x'},{interpolate:'linear'})
    .addSerie(data.vib,{x:'time',y:'vibration_y'},{interpolate:'step-before'})
    .addSerie(data.vib,{x:'time',y:'vibration_z'},{interpolate:'linear'})
    .addSerie(data.vib,{x:'time',y:'vibration'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width(window.innerWidth*0.2)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    chart04(chartName);
  }

