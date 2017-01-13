function drawCheckChart() {  
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  console.log('%s, %s', sdate, edate);
  $.ajax({
    url: "/analysis/restapi/getDaClusterDetail" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {     
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;       
        data.forEach(function(d){
          time[index]  = d.event_time;
          ampere[index] = [d.c0_ampere, d.c1_ampere, d.c2_ampere, d.c3_ampere];
          voltage[index] = [d.c0_voltage, d.c1_voltage, d.c2_voltage, d.c3_voltage];
          active_power[index] = [d.c0_active_power, d.c1_active_power, d.c2_active_power, d.c3_active_power];
          power_factor[index++] = [d.c0_power_factor, d.c1_power_factor, d.c2_power_factor, d.c3_power_factor];
        });
        console.log(voltage);

        drawCheckPower(data, sdate, edate);
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

function drawCheckPower(data, sdate, edate) { 
  var ampere = new Array();
  var voltage = new Array();
  var active_power = new Array();
  var power_factor = new Array();
  var time = new Array();
  var index = 0;

  var demo = new Vue({
    el: '#table',
    data: {
      people_count: 200,
      lineCategory: ['c0', 'c1', 'c2', 'c3'],
      selectCate: ['c0', 'c3'],
      set: data,
/*      dataCategory: ['voltage', 'ampere', 'active_power', 'power_factor'],
      selectData: ['voltage'],*/
      lineFunc: null
    },
    methods: {
      displayLine: function() {
        var self = this;
        var input = 0;   
        console.log('check : '+time[0]);
        for(var i=0; i < data.length; i++) {
          data.push({ })
        }
            //generation function
      function generate(data, id, lineType, axisNum) {
        var margin = {top: 14, right: 20, bottom: 60, left: 40},
        width = $(id).width() - margin.left - margin.right, 
        height = $(id).height() - margin.top - margin.bottom;

        console.log(set);

        var legendSize = 10,
         color = d3.scale.category20();

        var x = d3.scale.ordinal().rangePoints([0, width]);
        var y = d3.scale.linear().rangeRound([height, 0]);

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

        x.domain(weekly);
        y.domain([0, max]);

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
            return 'translate(' + ((5 + (width-20) / 6) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
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
                var rename = "이번주";
              } else if(d === 'c1') {
                var rename = "1주전";              
              } else if(d === 'c2') {
                var rename = "2주전"
              } else {
                var rename = "3주전";
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
        .attr('width', (width - 20) / 6)
        .attr('height', legendSize + 10)
        .attr('transform', function(d, i) {
          return 'translate(' + (i * (5 + (width-20) / 6)) + ',' + (height + margin.bottom - legendSize - 20) + ')';
        });

      var points = svg.selectAll(".seriesPoints")
        .data(ddata)
        .enter().append("g")
        .attr("class", "seriesPoints");

        points.selectAll(".tipNetPoints")
        .data(function (d) { return d['values']; })
        .enter().append("circle")
        .attr("class", "tipNetPoints")
        .attr("cx", function (d) { return x(d['time']); })
        .attr("cy", function (d) { return y(d['num']); })
        .text(function (d) { return d['num']; })
        .attr("r", "6px")
        .style("fill", "transparent")
        .on("mouseover", function (d) {
        
          var mainCate = (function() {
            if (d['num'] != 0){
              if(d['category'] === 'c0')   {
                var rename = "이번주";
              } else if(d['category'] === 'c1') {
                var rename = "1주전";              
              } else if(d['category'] === 'c2') {
                var rename = "2주전"
              } else {
                var rename = "3주전";
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
        }
        else
          d3.selectAll(".click_line_"+self.lineCategory[i]).transition().duration(300).style("display", 'none');
      }

      //redraw the legend and chart
      this.legendRedraw(self.selectCate, "#Cluster", self.lineFunc.getSvg()['legend'], self.lineFunc.getSvg()['rect'], self.lineFunc.getOpt()['legendSize'], self.lineFunc.getOpt()['margin'], self.lineFunc.getOpt()['height'], self.lineFunc.getOpt()['width'], self.lineFunc.getSvg()['color']);
    },
    legendRedraw: function (selectCate, id, legend, rect, legendSize, margin, height, width, color) {
      //update the scatter plot legend
      legend.selectAll('.path_legend')
      .data(selectCate)
        // .transition()
        // .duration(200)
        .attr('transform', function(d, i) {
          return 'translate(' + ((5 + (width-20) / 6) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
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
            var rename = "이번주";
          } else if(d === 'c1') {
            var rename = "1주전";              
          } else if(d === 'c2') {
            var rename = "2주전"
          } else {
            var rename = "3주전";
          }
              return rename;          });
        

      //create new legends
      var singLegend = legend.selectAll('.path_legend')
      .data(selectCate)
      .enter()
      .append('g')
      .attr('class', 'path_legend')
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 6) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
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
          var rename = "이번주";
        } else if(d === 'c1') {
          var rename = "1주전";              
        } else if(d === 'c2') {
          var rename = "2주전"
        } else {
          var rename = "3주전";
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
        return 'translate(' + ((5 + (width-20) / 6) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
      });

      rect.selectAll('.legendRect')
      .data(selectCate)
      .enter()
      .append('rect')
      .attr('class', 'legendRect')
      .attr('width', (width - 20) / 6)
      .attr('height', legendSize + 10)
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 6) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
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