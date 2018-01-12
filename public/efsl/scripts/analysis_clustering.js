$(document).ready(function(e) {  
  var dateFormat = 'YYYY-MM-DD';      
  $('#sdate').val(moment().subtract(1, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));
  // time series char를 그린다.
  var interval = $("select[name=interval]").val();
  getMasterList(interval);
  $('#btn_search').click(function() {
    var interval = $("select[name=interval]").val();
    d3.selectAll("svg").remove();
    getMasterList(interval);
  });
  $('#btn_factor').click(function() {
    d3.selectAll("svg").remove();
  });
  $('input[type="radio"]').on('click change', function(e) {
    var factor = $('input[type="radio"]:checked').val();        
    console.log(factor + ' ' + dadate);
    if(dadate != ''){
      d3.selectAll("svg").remove();
      drawCheckChart(factor, dadate);
    }
  });
  clickfunc = function(dadate) {        
    var factor = $('input[type="radio"]:checked').val();    
    console.log(factor + ' ' + dadate);
      d3.selectAll("svg").remove();
      drawCheckChart(factor, dadate);
  };
});
var dadate = '';

function getMasterList(interval) {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  console.log('%s, %s, %s', sdate, edate, interval);
  var data = { sdate:sdate, edate:edate, interval:interval };
  var in_data = { url : "/analysis/restapi/getDaClusterMaster", type : "GET", data : data };  
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {    
      var master = result.rtnData;          
      drawMaster(master);
    }
  });
 }

function drawMaster(master) {  
  var seatvar = document.getElementsByClassName("masterList");
  var cnt = 0
  $('#masterList').empty();
  master.forEach(function(d) {     
    var sb = new StringBuffer();
    if(cnt == 0) {
        sb.append('<tr><th>DA Time</th><th>Start Date-End Date</th><th>Interval</th><th>Clusters</th><th></th></tr>');
      cnt++;
    }
//    sb.append('<tr><td><a href="#" onclick="clickfunc(this)">' + d.da_time+'</td><td> '+sdate[0]+' ~ '+edate[0]+' </td>');
    sb.append('<tr><td><a class="showChart">' + d.da_time + '</a></td><td> ' + d.start_date +' ~ '+ d.end_date +' </td>');
    if (d.time_interval == 180) {
      var interval = '3hours';
    } else if (d.time_interval == 360) {
      var interval = '6hours';
    } else {
      var interval = d.time_interval + 'mins';
    }
    sb.append('<td>'+interval+'</td>');

    // 클러스터 개수 구하기
    console.log(d)
    var factor = $('input[type="radio"]:checked').val();    
    let clusters = Object.keys(d[factor]).length;
    sb.append('<td>' + clusters + '</td>');
    sb.append('<td><a href="#" onclick="javascript_:window.open(');    
    var script = "'clusteringPop?dadate="+d.da_time+"&interval="+interval+"&start="+d.start_date+"&end="+d.end_date+"', '', 'menubar=1,status=no,scrollbars=1,resizable=1 ,width=1200,height=640,top=50,left=50'";
    sb.append(script+');" class="btn red"> Detail </a></td></tr>')
    
    $('#masterList').append(sb.toString());
  });
  $('.showChart').click(function(event){
    $(event.target).closest('tr').siblings('tr').css('background-color','#fff');
    $(event.target).closest('tr').css('background-color','#ddd');
    dadate = $(event.target)[0].innerHTML;
    clickfunc(dadate);
  });
}

function drawCheckChart(factor, dadate) {    
  var data = { factor : factor, dadate : dadate };
  var in_data = { url : "/analysis/restapi/getDaClusterDetail", type : "GET", data : data };  
  ajaxTypeData(in_data, function(result){ 
    if (result.rtnCode.code == "0000") {        
      console.log(result);      
      drawCheckCluster(result.rtnData, dadate, factor);
    }    
  });
}

var checkClusterHeight = 0;
function drawCheckCluster(data, dadate, factor) {
  let clusterCnt = Object.keys(data[0]).length - 1;
  let dynamicClusters = '';
  let lineCategories = [];
  let motorCnt = 0;
  for ( let idx = 0 ; idx < clusterCnt ; idx++ ){
    dynamicClusters += '<div class="checker" id="uniform-c'+idx+'"><span class="checked"><input class="click_checkbox" id="c'+idx+'" type="checkbox" name="c'+idx+'" value="'+(idx+1) + '" checked="true" v-on="click:checkOpt"></span></div>';
    // motorCnt = clusterNames[idx]
    dynamicClusters += '<text> Cluster'+ idx +'</text>';
    // dynamicClusters += '<text> Cluster'+ idx +' (' + motorCnt + ')</text>';
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
