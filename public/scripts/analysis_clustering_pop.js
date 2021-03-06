jQuery(document).ready(function() {
  var sdate = urlParams.start;
  var edate = urlParams.end;
  var interval = urlParams.interval;
  $('#sdate').val(sdate.split('T')[0]);
  $('#edate').val(edate.split('T')[0]);
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

var dadate = urlParams.dadate;
function drawCheckChart() {  
  if ($('#factor0').is(':checked') === true) {
    var factor = $('#factor0').val();
  } else if ($('#factor1').is(':checked') === true) {
    var factor = $('#factor1').val();
  } else if ($('#factor2').is(':checked') === true) {
    var factor = $('#factor2').val();
  } else if ($('#factor3').is(':checked') === true) {
    var factor = $('#factor3').val();
  }
  
  var in_data = { url : "/analysis/restapi/getDaClusterDetail", type : "GET", data : { daDate : dadate } };  
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {                
      var d = result.rtnData;        
      var set = [];
      for(i=0; i<d['c0_ampere'].length; i++){
        var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');          
        var event_time = new Date(d['event_time'][i]);          
        //console.log(df.parse(new Date(d['event_time'][i])));
        if(factor === 'ampere') {
          set.push({ time : event_time, c0:d['c0_ampere'][i], c1:d['c1_ampere'][i], c2:d['c2_ampere'][i], c3:d['c3_ampere'][i]});
        } else if(factor === 'voltage') {
          set.push({ time : event_time, c0:d['c0_voltage'][i], c1:d['c1_voltage'][i], c2:d['c2_voltage'][i], c3:d['c3_voltage'][i]});
        } else if(factor === 'active_power') {
          set.push({ time : event_time, c0:d['c0_active_power'][i], c1:d['c1_active_power'][i], c2:d['c2_active_power'][i], c3:d['c3_active_power'][i]});
        } else if(factor === 'power_factor') {
          set.push({ time : event_time, c0:d['c0_power_factor'][i], c1:d['c1_power_factor'][i], c2:d['c2_power_factor'][i], c3:d['c3_power_factor'][i]});
        }
      };        
      console.log(set);
      drawCheckCluster(set, dadate, factor);
    }     
  });
}

function drawCheckCluster(data, dadate, factor) {
  var cate = new Array();
  var idx = 0;
  if($('input[name="c0"]').prop('checked')) 
    cate[idx++] = 'c0';
  if($('input[name="c1"]').prop('checked'))
    cate[idx++] = 'c1';
  if($('input[name="c2"]').prop('checked'))
    cate[idx++] = 'c2';
  if($('input[name="c3"]').prop('checked'))
    cate[idx++] = 'c3';    
  var demo = new Vue({
    el: '#table',
    data: {
      people_count: 200,
      lineCategory: ['c0', 'c1', 'c2', 'c3'],
      selectCate: cate,
      lineFunc: null
    },
    methods: {
      displayLine: function() {
        var self = this;
        var input = 0;

     //generation function
     function generate(data, id, lineType, axisNum) {
      var margin = {top: 14, right: 10, bottom: 60, left: 30},
      width = $(id).width() - margin.left - margin.right,
      height = $(id).height() - margin.top - margin.bottom;

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
          temp[name].values.push({'category': name, 'time': d['time'], 'num': d[name]});
        });
      });

      return seriesArr;
    })();
    x.domain(d3.extent(data, function(d) {
     return d.time; }));
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

    var svg = d3.select(id).append("svg")
    .attr("id", "#svg-path")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
      return 'translate(' + ((5 + (width-20) / 4) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
    });

    singLegend.append('g:rect')
    .attr('width', legendSize)
    .attr('height', legendSize)
    .style('fill', function(d) {            return color(d);          });

    singLegend.append('g:text')
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
      if(d === 'c0')   {
        var rename = "Cluster0";
      } else if(d === 'c1') {
        var rename = "Cluster1";
      } else if(d === 'c2') {
        var rename = "Cluster2"
      } else {
        var rename = "Cluster3";
      }
      return rename;          });

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
          return 'translate(' + (i * (5 + (width-20) / 4)) + ',' + (height + margin.bottom - legendSize - 20) + ')';
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
            if (d['num'] != 0){
              if(d['category'] === 'c0')   {
                var rename = "Cluster0";
              } else if(d['category'] === 'c1') {
                var rename = "Cluster1";
              } else if(d['category'] === 'c2') {
                var rename = "Cluster2"
              } else {
                var rename = "Cluster3";
              }
              return rename + ' | ';
            } else
            return '';
          })();

          div.transition()
          .duration(200)
          .style("opacity", .9);
          div .html(' ' + mainCate + d['num'] + ' ')
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
          return 'translate(' + ((5 + (width-20) / 4) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
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
          if(d === 'c0')   {
            var rename = "Cluster0";
          } else if(d === 'c1') {
            var rename = "Cluster1";
          } else if(d === 'c2') {
            var rename = "Cluster2"
          } else {
            var rename = "Cluster3";
          }
          return rename;          });

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
        if(d === 'c0')   {
          var rename = "Cluster0";
        } else if(d === 'c1') {
          var rename = "Cluster1";
        } else if(d === 'c2') {
          var rename = "Cluster2"
        } else {
          var rename = "Cluster3";
        }
        return rename;          });

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

function getNodeList(type) {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();  
  if ($('#factor0').is(':checked') === true) {
    var factor = $('#factor0').val();
  } else if ($('#factor1').is(':checked') === true) {
    var factor = $('#factor1').val();
  } else if ($('#factor2').is(':checked') === true) {
    var factor = $('#factor2').val();
  } else if ($('#factor3').is(':checked') === true) {
    var factor = $('#factor3').val();
  }    
   $.ajax({
    url: "/analysis/restapi/getDaClusterMasterByDadate" ,
    dataType: "json",
    type: "get",
    data: {dadate : dadate},
    success: function(result) {
      if (result.rtnCode.code == "0000") {
        var d = result.rtnData;        
        console.log(d);
        var nodeList = [];       
        if(factor === 'voltage') {
          nodeList.push({ c0 : d['c0_voltage'], c1 : d['c1_voltage'], c2 : d['c2_voltage'], c3 : d['c3_voltage'] })
        } else if(factor === 'ampere') {
          nodeList.push({ c0 : d['c0_ampere'], c1 : d['c1_ampere'], c2 : d['c2_ampere'], c3 : d['c3_ampere'] })
        } else if(factor === 'active_power') {
          nodeList.push({ c0 : d['c0_active_power'], c1 : d['c1_active_power'], c2 : d['c2_active_power'], c3 : d['c3_active_power'] })
        } else if(factor === 'power_factor') {
          nodeList.push({ c0 : d['c0_power_factor'], c1 : d['c1_power_factor'], c2 : d['c2_power_factor'], c3 : d['c3_power_factor'] })
        }      
          drawDirectory(nodeList);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawDirectory(nodeList) { 
    if ($('#factor0').is(':checked') === true) {
    var factor = $('#factor0').val();
  } else if ($('#factor1').is(':checked') === true) {
    var factor = $('#factor1').val();
  } else if ($('#factor2').is(':checked') === true) {
    var factor = $('#factor2').val();
  } else if ($('#factor3').is(':checked') === true) {
    var factor = $('#factor3').val();
  }
  var seatvar = document.getElementsByClassName("tblClusterDir");                   
  var cnt = 0;
  $('#tblClusterDir').empty();
  console.log(nodeList);
  nodeList.forEach(function(d) {  
    console.log(d);
    var sb = new StringBuffer();
    if(cnt == 0) {
      sb.append('<tr><th>Cluster</th><th>Node_id</th></tr>');
      cnt++;
   }       
    if(d.c0 != null) {
      var script = "javascript:getNodePower('"+d.c0+"',"+d.c0.length+");"; 
      sb.append('<tr><td><span class="bold theme-fone"><a href="'+script+'"> Cluster0 </a></span></td><td></td></tr>');
      for(var i=0; i < d.c0.length; i++) {
        sb.append('<tr><td></td><td>');
        var script = "javascript:clickNode('"+d.c0[i]+"');";
        sb.append('<a class="primary-link" href="'+script+'">' + d.c0[i] + '</a>');
        sb.append('</td></tr>');
      }    
    }
    if(d.c1 != null) {
      var script = "javascript:getNodePower('"+d.c1+"',"+d.c1.length+");";
      sb.append('<tr><td><span class="bold theme-fone"><a href="'+script+'"> Cluster1 </a></span></td><td></td></tr>');    
      for(var i=0; i < d.c1.length; i++) {
        sb.append('<tr><td></td><td>');
        var script = "javascript:clickNode('"+d.c1[i]+"');";      
        sb.append('<a class="primary-link" href="'+script+'">' + d.c1[i] + '</a>');
        sb.append('</td></tr>');
      }  
    }  
    var script = "javascript:getNodePower('"+d.c2+"',"+d.c2.length+");";
    sb.append('<tr><td><span class="bold theme-fone"><a href="'+script+'"> Cluster2 </a></span></td><td></td></tr>');
    for(var i=0; i < d.c2.length; i++) {
      sb.append('<tr><td></td><td>');
      var script = "javascript:clickNode('"+d.c2[i]+"');";      
      sb.append('<a class="primary-link" href="'+script+'">' + d.c2[i] + '</a>');
      sb.append('</td></tr>');
    }    
    var script = "javascript:getNodePower('"+d.c3+"',"+d.c3.length+");";
    console.log(script);
    sb.append('<tr><td><span class="bold theme-fone"><a href="'+script+'"> Cluster3 </a></span></td><td></td></tr>');
    for(var i=0; i < d.c3.length; i++) {
      sb.append('<tr><td></td><td>');
      var script = "javascript:clickNode('"+d.c3[i]+"');";
      sb.append('<a class="primary-link" href="'+script+'">' + d.c3[i] + '</a>');
      sb.append('</td></tr>');
    }
    $('#tblClusterDir').append(sb.toString());
  });
    

}

function getNodePower(nodeList, len){  
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  if ($('#factor0').is(':checked') === true) {
    var factor = $('#factor0').val();
  } else if ($('#factor1').is(':checked') === true) {
    var factor = $('#factor1').val();
  } else if ($('#factor2').is(':checked') === true) {
    var factor = $('#factor2').val();
  } else if ($('#factor3').is(':checked') === true) {
    var factor = $('#factor3').val();
  }
  var node = nodeList;
  var idCnt = node.length;
  var start = urlParams.start;
  var end = urlParams.end;
  var last, start;
   $.ajax({
    url: "/analysis/restapi/getClusterNodePower" ,
    dataType: "json",
    type: "get",
    data: {startDate:start, endDate:end, nodeId: node},
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;
        var set = [];
        var max = 0;       
        var cnt = 0;
        data.forEach(function(d){                    
          d.event_time = new Date(d.event_time);                 
         if(factor === 'ampere') {          
          set.push({ time:d.event_time, id: d.node_id, value: parseFloat(d.ampere)});
          if(d.ampere > max)
            max = parseFloat(d.ampere);
         } else if(factor === 'voltage') {
          set.push({ time:d.event_time, id: d.node_id, value: parseFloat(d.voltage)});
          if(d.voltage > max)
            max = parseFloat(d.voltage);
        } else if(factor === 'active_power') {
          set.push({ time:d.event_time, id: d.node_id, value: parseFloat(d.active_power) });
          if(d.active_power > max) {            
            max = parseFloat(d.active_power);
          }
        } else if(factor === 'power_factor') {
          set.push({ time:d.event_time, id: d.node_id, value: parseFloat(d.power_factor) });
          if(d.power_factor > max)
            max =  parseFloat(d.power_factor);
        }   
          var format = d3.time.format("%Y-%m-%d");
          last = format(d.event_time);
          if(cnt++ === 0) {
           start= format(d.event_time);
          }                              
        });                        
        drawNode(set, max, node.split(',').length, last, start, len);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}
var oldL = 0;
function drawNode(data, maxValue, idCnt, last, start, len) {    
  console.log(oldL);
  var max = parseInt(maxValue) + 5;  
  for(var i = 0; i <= oldL; i++) {
    d3.select("#nodeChart").select("svg").remove();
  }
  oldL = len;
var sdate = start;
var edate = last;

  // Set the dimensions of the canvas / graph
var margin = {top: 5, right: 20, bottom: 20, left: 30},
    width = (window.innerWidth*0.3) - margin.left - margin.right,       
    height = 315 - margin.top - margin.bottom - 15*idCnt/4;
    //- (20*(idCnt/(width/100)));
    console.log(idCnt);
console.log(height);
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
    .x(function(d) { return x(d.time); })
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
         return d.time; }));
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
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("width", 10)
          .attr("height", 10)
           .style("fill", function() { // dynamic colours    // *******
                return d.color = color(d.key); });

      legend.append("text")
          .attr("x", 50)
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

  $.ajax({
    url: "/analysis/restapi/getClusterRawDataByNode" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate, node:nodeId},
    success: function(result) {
      if (result.rtnCode.code == "0000") {        
        var data = result.rtnData;           
         drawTimeseries(data);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawTimeseries(data) {
  console.log(data);
   d3.select("#ts-chart01").select("svg").remove();
   d3.select("#ts-chart02").select("svg").remove();
   d3.select("#ts-chart03").select("svg").remove();
   d3.select("#ts-chart04").select("svg").remove();
  // 데이터 가공
  var df = d3.time.format('%Y-%m-%dT%H:%M:%S');
  var power = [], vib = [], noise = [], als = [];
  data.forEach(function(d) {
    d.event_time = df.parse(d.event_time);    
    if(d.event_type == "1"){
      power.push({ "time" : d.event_time, "active_power" : d.active_power, "ampere" : d.ampere, "amount_active_power" : d.amount_of_active_power });
    } else if(d.event_type =="33")   {
      vib.push({ "time" : d.event_time,  "vibration_x" : d.vibration_x, "vibration_y" : d.vibration_y, "vibration_z" : d.vibration_z, "vibration" : (d.vibration_x+d.vibration_y+d.vibration_z)/3 });
    } else if(d.event_type == "49"){
      noise.push({ "time" : d.event_time, "decibel" : d.noise_decibel, "frequency" : d.noise_frequency });
    } else if(d.event_type == "17") {
      als.push({ "time" : d.event_time, "dimming_level" : d.dimming_level, "als_level" : d.als_level });
    }
    
    d.als_level = d.als_level === ''? 0:d.als_level;
    d.dimming_level = d.dimming_level === ''? 0:d.dimming_level;
    d.noise_frequency = d.noise_frequency === ''? 0:d.noise_frequency;
   
  });


  console.log(data);

  var chartName = '#ts-chart01';
  chart01 = d3.timeseries()
    .addSerie(power,{x:'time',y:'active_power'},{interpolate:'linear'})
    .addSerie(power,{x:'time',y:'ampere'},{interpolate:'step-before'})
    .addSerie(power,{x:'time',y:'amount_active_power'},{interpolate:'linear'})
    // .xscale.tickFormat(d3.time.format("%b %d"))
    .width(window.innerWidth*0.2)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart01(chartName);

  var chartName = '#ts-chart02';
  chart02 = d3.timeseries()
    .addSerie(als,{x:'time',y:'als_level'},{interpolate:'step-before'})
    .addSerie(als,{x:'time',y:'dimming_level'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width(window.innerWidth*0.2)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart02(chartName);

  chartName = '#ts-chart03';
  chart03 = d3.timeseries()
    .addSerie(noise,{x:'time',y:'decibel'},{interpolate:'step-before'})
    .addSerie(noise,{x:'time',y:'frequency'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width(window.innerWidth*0.2)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart03(chartName);

  chartName = '#ts-chart04';
  chart04 = d3.timeseries()
    .addSerie(vib,{x:'time',y:'vibration_x'},{interpolate:'linear'})
    .addSerie(vib,{x:'time',y:'vibration_y'},{interpolate:'step-before'})
    .addSerie(vib,{x:'time',y:'vibration_z'},{interpolate:'linear'})
    .addSerie(vib,{x:'time',y:'vibration'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width(window.innerWidth*0.2)
    .height(270)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart04(chartName);
}

