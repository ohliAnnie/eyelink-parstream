d3.json("/reports/restapi/testData", function(err, data) {
  if (err) throw error;
  var numberFormat = d3.format('.2f');

  var first = 0;
// Data Setting
  data.rtnData.forEach(function(d) {            
    var a = d.event_time.split(" ");
    var b = a[1].split(".");
    d.time = b[0];                 
    var c = d.time.split(":");            
    d.hAxis  = c[0];
    d.mAxis = c[1];
    d.sAxis = c[2];
    d.ampere = numberFormat(d.ampere);
    d.voltage = numberFormat(d.voltage);
    d.active_power = numberFormat(d.active_power);
    d.apparent_power = numberFormat(d.apparent_power);
    d.reactive_power = numberFormat(d.reactive_power);
    d.power_factor = numberFormat(d.power_factor);
  });
  var pData = data.rtnData;

  // Vue component define
  var demo = new Vue({
    el: '#table',
    data: {
      people_count: 200,
      lineCategory: ['ampere', 'voltage', 'active_power', 'apparent_power', 'reactive_power', 'power_factor'],
      selectCate: ['ampere', 'voltage', 'apparent_power'],
      lineFunc: null
    },
    methods: {
      displayLine: function() {
        var self = this;
        var input = 0;
        var data = [];
        var hAxis = pData[input]['hAxis'], mAxis = pData[input]['mAxis'], sAxis = pData[input]['sAxis'];

        for(var i=0; i<10; i++) {      
          var tAxis = hAxis + ":" + mAxis + ":" + sAxis;
          if(tAxis == pData[input]['time']) {
              data.push({time:pData[input]['time'], ampere:pData[input]['ampere'], voltage:pData[input]['voltage'], active_power:pData[input]['active_power'], apparent_power:pData[input]['apparent_power'] , reactive_power:pData[input]['reactive_power'], power_factor:pData[input++]['power_factor']});
            } else {
             data.push({time:tAxis, ampere:0, voltage:0, active_power:0, apparent_power:0, reactive_power:0, power_factor:0});
           }
          if(mAxis === 59 && sAxis === 59) {
            hAxis++;
            mAxis = '0' + 0;
            sAxis = '0' + 0;
          } else if(sAxis === 59) {
            mAxis++;
            if(mAxis < 10) {            mAxis = '0' + mAxis;          }
            sAxis = '0' +0;
          } else {
            sAxis++;
            if(sAxis < 10) {            sAxis = '0' + sAxis;          }
          }
        }
        
              //generation function
      function generate(data, id, lineType, axisNum) {
        var margin = {top: 20, right: 18, bottom: 35, left: 28},
        width = $(id).width() - margin.left - margin.right,
        height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M:%S").parse;
        var legendSize = 10,
               color = d3.scale.category20();

         var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear()
        .range([height, 0]);

        var ddata = (function() {
          var temp = {}, seriesArr = [];

          self.lineCategory.forEach(function (name) {
            temp[name] = {category: name, values:[]};
            seriesArr.push(temp[name]);
          });

          data.forEach(function (d) {
            self.lineCategory.map(function (name) {
              temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
            });
          });

          return seriesArr;
        })();

        x.domain( d3.extent(data, function(d) { return parseDate(d['time']); }) );
        y.domain([0, 200]);

        //data.length/10 is set for the garantte of timeseries's fitting effect in svg chart
        var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(d3.time.seconds, Math.floor(data.length / axisNum))
        .tickSize(-height)
        .tickPadding([6])
        .orient("bottom");

        var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(10)
        .tickSize(-width)
        .orient("left");            

        d3.select('#svg-line').remove();

        var svg = d3.select(id).append("svg")
            .attr("id", "#svg-line")
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
          .attr("d", function(d) { return line(d['values']); })         
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

          var singLegend = legend.selectAll('.line_legend')
           .data(self.selectCate)
           .enter()
           .append('g')
           .attr('class', 'line_legend')
           .attr('transform', function(d, i) {
            return 'translate(' + ((5 + (width-20) / 5) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
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
           .text(function(d) {            return d;          });

          //draw the rect for legends
        var rect = svg.append('g')
        .attr("class", 'legendOuter');

        rect.selectAll('.legendRect')
        .data(self.selectCate)
        .enter()
        .append('rect')
        .attr('class', 'legendRect')
        .attr('width', (width - 20) / 5)
        .attr('height', legendSize + 10)
        .attr('transform', function(d, i) {
          return 'translate(' + (i * (5 + (width-20) / 5)) + ',' + (height + margin.bottom - legendSize - 20) + ')';
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
/*          svgD['points'] = points;*/
          return svgD;
        }
      }

      //inits chart
      self.lineFunc = new generate(data, "#LINE", "linear",10);
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
      if (count>5) {
        alert("NOTICE: The MAXIMUM selection should be FIVE.");
        e.target.checked = false;
      }

      self.selectCate = [];

      for (var i=0; i<self.lineCategory.length; i++) {
        if ($("#"+self.lineCategory[i]).prop("checked")) {
          self.selectCate.push(self.lineCategory[i]);
          d3.selectAll(".click_line_"+self.lineCategory[i]).transition().duration(300).style("display", 'inherit');
        }
        else
          d3.selectAll("._line_"+self.lineCategory[i]).transition().duration(300).style("display", 'none');
      }

      //redraw the legend and chart
      this.legendRedraw(self.selectCate, "#LINE", self.lineFunc.getSvg()['legend'], self.lineFunc.getSvg()['rect'], self.lineFunc.getOpt()['legendSize'], self.lineFunc.getOpt()['margin'], self.lineFunc.getOpt()['height'], self.lineFunc.getOpt()['width'], self.lineFunc.getSvg()['color']);
    },
    legendRedraw: function (selectCate, id, legend, rect, legendSize, margin, height, width, color) {
      //update the scatter plot legend
      legend.selectAll('.line_legend')
      .data(selectCate)
        // .transition()
        // .duration(200)
        .attr('transform', function(d, i) {
          return 'translate(' + ((5 + (width-20) / 5) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
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
        .text(function(d) {          return d;        });

      //create new legends
      var singLegend = legend.selectAll('.line_legend')
      .data(selectCate)
      .enter()
      .append('g')
      .attr('class', 'line_legend')
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 5) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
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
      .text(function(d) {        return d;      });

      //remove the old legends
      legend.selectAll('.line_legend')
      .data(selectCate)
      .exit()
      .remove();

      //redraw the rect around the legend
      rect.selectAll('.legendRect')
      .data(selectCate)
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 5) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
      });

      rect.selectAll('.legendRect')
      .data(selectCate)
      .enter()
      .append('rect')
      .attr('class', 'legendRect')
      .attr('width', (width - 20) / 5)
      .attr('height', legendSize + 10)
      .attr('transform', function(d, i) {
        return 'translate(' + ((5 + (width-20) / 5) * i) + ',' + (height + margin.bottom - legendSize - 20) + ')';
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
});