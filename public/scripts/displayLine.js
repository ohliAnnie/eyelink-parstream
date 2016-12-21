displayLine:  function() {
      var self = this;
      var input = 0;      
      var hAxis = pData[input]['hAxis'], mAxis = pData[input]['mAxis'], sAxis = pData[input]['sAxis'];            
      var data = [];

      for(var i = 0; i<9; i++) {
        var tAxis = hAxis + ':' + mAxis + ':' + sAxis;        
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
      function generate(data, id, axisNum) {
        var margin = {top: 14, right: 20, bottom: 60, left: 30},
        width = $(id).width() - margin.left - margin.right,
        height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M:%S").parse;

        var legendSize = Math.floor(width / 27.5),
        color = d3.scale.category20();
/*
        var line = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) { return xTransLen(d['time']); })
            .y(function(d) { return y(d['num']); });*/

        var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().rangeRound([height, 0]);

        //the radius of circle can be adjustable
        var r = d3.scale.linear()
        .domain([0, 20])
        .range([0, width / 45]);

        //deal with the datum, and store them into ddata
        var ddata = [];        
        data.forEach(function(d) {          
          var dinput = 0;
          ddata.push({'time': parseDate(d['time']), 'issue': self.scatterCategory[dinput++], 'num': d['ampere'] });
          ddata.push({'time': parseDate(d['time']), 'issue': self.scatterCategory[dinput++], 'num': d['voltage'] });
          ddata.push({'time': parseDate(d['time']), 'issue': self.scatterCategory[dinput++], 'num': d['active_power'] });
          ddata.push({'time': parseDate(d['time']), 'issue': self.scatterCategory[dinput++], 'num': d['apparent_power'] });
          ddata.push({'time': parseDate(d['time']), 'issue': self.scatterCategory[dinput++], 'num': d['reactive_power'] });
          ddata.push({'time': parseDate(d['time']), 'issue': self.scatterCategory[dinput++], 'num': d['power_factor'] });
        });

        var ldata = (function() {
           var temp = {}, seriesArr = [];
           for(var i=0; i < scatterCategory.length; i++) {
            temp[scatterCategory[i]] = {category:drawLine[i], values:[]}
            seriesArr.push(temp[scatterCategory]);
              data.forEach(function(d) {                
                scatterCategory.map(function(name) {
                  temp[name].values.push({ 'issue' : name, 'time':parseDate(d['time']), 'num':d[name]});
                });
             });
            }
            return seriesArr;
        });

        x.domain( d3.extent(ddata, function(d) { return d['time']; }) );
        y.domain([0,200]);

/*        var tranLength = (x(parseDate('00:00:10'))-x(parseDate('00:00:09'))) / 4;*/

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.seconds, Math.floor(data.length / axisNum))
        .tickPadding([6])
        .tickSize(-height);

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10)
        .tickPadding([8])
        .tickSize(-width);

        d3.select('#svg-docker').remove();

        var svg = d3.select(id).append("svg")
        .attr('id', "#svg-docker")
        .attr("width", width+margin.left+margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
        .attr("class", "x axis")
        .attr("id", "docker-x-axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

 var dots = svg.append("g")
 .attr("class", "scatter_dots");

 dots.selectAll(".scatter_circle")
 .data(ddata)
 .enter()
 .append("circle")
 .attr("class", function (d) { return "scatter_circle scatter_circle_" + d['issue']; })
 .attr("cx", function (d) { return x(d['time']); })
 .attr("cy", function (d) { return y(d['num']); })
 .attr("r", function (d) { return r(10); })
 .style("display", function (d) {
              //to check if the checkbox has been selected and decide whether to show it out
              //use display:none and display:inherit to control the display of scatter dots
              if ($("#"+d['issue']).prop("checked"))
                return 'inherit';
              else
                return 'none';
            })
 .style("fill", function (d) { return color(d['issue']) })
 .on("mouseover", function (d) {
  if ($("#"+d['issue']).prop("checked")) {
    $(this).tooltip({
      'container': 'body',
      'placement': 'left',
      'title': d["issue"] + " | " +d['num'],
      'trigger': 'hover'
    })
    .tooltip('show');
  }
})
 .on("mouseout", function(d) {
  $(this).tooltip('destroy');
});

/* var path = svg.append("g")
 .attr("class", "scatter_paths");

 path.selectAll(".scatter_line")
 .data(ddata)
 .enter()
 .append("line")
 .attr("class", function (d) { return "scatter_line scatter_line_" + d['issue']; })
 .attr("d", function (d) { return line(d); })
 .style("display", function (d) {
              //to check if the checkbox has been selected and decide whether to show it out
              //use display:none and display:inherit to control the display of scatter dots
              if ($("#"+d['issue']).prop("checked"))
                return 'inherit';
              else
                return 'none';
            })
 .style("fill", function (d) { return color(d['issue']) })
 .on("mouseover", function (d) {
  if ($("#"+d['issue']).prop("checked")) {
    $(this).tooltip({
      'container': 'body',
      'placement': 'left',
      'title': d["issue"] + " | " +d['num'],
      'trigger': 'hover'
    })
    .tooltip('show');
  }
})
 .on("mouseout", function(d) {
  $(this).tooltip('destroy');
});
*/
 d3.selectAll('.scatter_legend').remove();

 var legend = svg.append('g')
 .attr('class', 'scatter_legend');

 var singLegend = legend.selectAll('.docker_legend')
 .data(self.selectScaCate)
 .enter()
 .append('g')
 .attr('class', 'docker_legend')
 .attr('transform', function(d, i) {
  return 'translate(' + ((5 + (width-20) / 5) * i + 5) + ',' + (height + margin.bottom - legendSize - 15) + ')';
});

 singLegend.append('g:rect')
 .attr('width', legendSize)
 .attr('height', legendSize)
 .style('fill', function(d) {
  return color(d);
});

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
  return d;
});

        var line = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return x(d['time']); })
        .y(function(d) { return y(d['num']); });

        var path = svg.append("g")
        .attr("class", "checkLines");
        path.selectAll(".pathCheckLine")
        .data(ldata)
        .enter().append("line")
        .attr("d", function(d) { return line(d);  });



        //draw the rect for legends
        var rect = svg.append('g')
        .attr("class", 'legendOuter');

        rect.selectAll('.legendRect')
        .data(self.selectScaCate)
        .enter()
        .append('rect')
        .attr('class', 'legendRect')
        .attr('width', (width - 20) / 5)
        .attr('height', legendSize + 10)
        .attr('transform', function(d, i) {
          return 'translate(' + (i * (5 + (width-20) / 5)) + ',' + (height + margin.bottom - legendSize - 20) + ')';
        });

        function xTransLen(t) {
          return x(parseDate(t)) + tranLength;
        }

        this.getOpt = function() {
          var axisOpt = new Object();
          axisOpt['x'] = x;
          axisOpt['xAxis'] = xAxis;
          axisOpt['y'] = y;
          axisOpt['r'] = r;
          axisOpt['legendSize'] = legendSize;
          axisOpt['height'] = height;
          axisOpt['width'] = width;
          axisOpt['margin'] = margin;
          return axisOpt;
        }

        this.getSvg = function() {
          var svgD = new Object();
          svgD['svg'] = svg;
          svgD['dots'] = dots;
          svgD['color'] = color;
          svgD['legend'] = legend
          svgD['rect'] = rect;
          svgD['path'] = path;
          svgD['line'] = line;
          return svgD;
        }
      }

      //inits chart
      self.sensorDockerFunc = new generate(data, "#path_check", 5);


    },