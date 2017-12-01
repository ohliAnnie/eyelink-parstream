$(document).ready(function() {                          
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().subtract(2, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));

  // time series char를 그린다.
    drawCheckChart();            
    $('#btn_search').click(function() {
     drawCheckChart();        
    });
}); 

function drawCheckChart() {  
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  var data = { sdate : sdate, edate :edate };
  var in_data = { url : "/reports/restapi/getRangePowerData", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){    
    if (result.rtnCode.code == "0000") {
      console.log(result.rtnData);
      var data = result.rtnData;       
      drawCheckPower(data, sdate, edate);
      integrateindex(data)
    } 
  });
}

function drawCheckPower(data, sdate, edate) {
  var wPoint = new Date(edate).getDay();
  var start = new Date(sdate)
  var week = new Array();
  var weekly = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];    
  var getD = 21+wPoint;

  var dCnt = 21+wPoint+1;
  var apData = new Array();
  var dData = new Array();
  dData[0] = edate;  
  for(var i=0; i<28; i++){    
    dData[i] = moment().subtract(getD--, 'days').format('YYYY-MM-DD');      
    apData[i] = 0;
    if(dCnt-i < 0) {
      apData[i] =  null;
    }
  }
  
  // Data Setting
 
  var max = 0;
  data.forEach(function(d) {                    
    d.day = d.event_time.split(' ')[0];
    
    for(var i = apData.length; i>=0; i--) {
      if(d.day == dData[i]){
        apData[i] = d.active_power;
        if(max < d.active_power){
          max = d.active_power;
        }
      }
    }
  });
    
  var demo = new Vue({
    el: '#table',
    data: {
      people_count: 200,
      lineCategory: ['week0', 'week1', 'week2', 'week3'],
      selectCate: ['week0', 'week3'],
      lineFunc: null
    },
    methods: {
      displayLine: function() {
        var self = this;
        var input = 0;
        var data = [];      
        var edate = moment().subtract(28, 'days').format('YYYY-MM-DD');  
        
        var wPoint = new Date(edate).getDay();
        for(var i=0; i<7; i++) {        
         if(i<=wPoint) {
            data.push({time:weekly[i], week0:apData[i+21], week1:apData[i+14], week2:apData[i+7], week3:apData[i]});      
         }          else {
            data.push({time:weekly[i], week1:apData[i+14], week2:apData[i+7], week3:apData[i]});      
         }
        }
              //generation function
      function generate(data, id, lineType, axisNum) {
        var margin = {top: 14, right: 20, bottom: 60, left: 40},
        width = $(id).width() - margin.left - margin.right, 
        height = $(id).height() - margin.top - margin.bottom;

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
              if(d === 'week0')   {
                var rename = "이번주";
              } else if(d === 'week1') {
                var rename = "1주전";              
              } else if(d === 'week2') {
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
              if(d['category'] === 'week0')   {
                var rename = "이번주";
              } else if(d['category'] === 'week1') {
                var rename = "1주전";              
              } else if(d['category'] === 'week2') {
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
      self.lineFunc = new generate(data, "#LINE", "linear",30);
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
      this.legendRedraw(self.selectCate, "#LINE", self.lineFunc.getSvg()['legend'], self.lineFunc.getSvg()['rect'], self.lineFunc.getOpt()['legendSize'], self.lineFunc.getOpt()['margin'], self.lineFunc.getOpt()['height'], self.lineFunc.getOpt()['width'], self.lineFunc.getSvg()['color']);
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
          if(d === 'week0')   {
            var rename = "이번주";
          } else if(d === 'week1') {
            var rename = "1주전";              
          } else if(d === 'week2') {
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
        if(d === 'week0')   {
          var rename = "이번주";
        } else if(d === 'week1') {
          var rename = "1주전";              
        } else if(d === 'week2') {
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