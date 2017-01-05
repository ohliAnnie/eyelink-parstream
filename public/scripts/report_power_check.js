function drawCheckChart() {
  var sdate = moment().subtract(100, 'days').format('YYYY-MM-DD');
  var edate = moment().format('YYYY-MM-DD');
  console.log('%s, %s', sdate, edate);
  console.log('check');
  $.ajax({
    url: "/reports/restapi/getTbRawDataByAllPower" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;        
        drawPower(data, sdate, edate);
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

function drawPower(data, sdate, edate) {
  var today=moment().format('YYYY-MM-DD');
  var a = today.split("-");  
  var mon0 = a[0]+"-"+a[1];
  var mon = [[0,0],[0,0],[0,0]];
for(var i=0; i<3; i++){
  mon[i][0] = parseInt(a[0]);
  mon[i][1] = parseInt(a[1]);  
  if(a[1]>1){
    a[1]--;
  }  else {
    a[1]=12;
    a[0]--;
  }
}

  // Data Setting
  data.forEach(function(d) {                
    d.yAxis  = d.event_year;
    d.mAxis = d.event_month;
    d.dAxis = d.event_day;
    d.day = d.yAxis+'-'+d.mAxis+'-'+d.dAxis;
  });

  var demo = new Vue({
    el: '#table',
    data: {
      people_count: 200,
      lineCategory: ['0month', '1month', '2month'],
      selectCate: [],
      lineFunc: null
    },
    methods: {
      displayLine: function() {
        var self = this;
        var input = 0;
        var data = [];
        var hAxis = pData[input]['hAxis'], mAxis = pData[input]['mAxis'], sAxis = pData[input]['sAxis'];

        for(var i=0; i<60; i++) {      
          var tAxis = hAxis + ":" + mAxis + ":" + sAxis;
          if(tAxis == pData[input]['time']) {
              data.push({time:pData[input]['time'], ampere:pData[input]['ampere'], voltage:pData[input]['voltage'], active_power:pData[input]['active_power'], apparent_power:pData[input]['apparent_power'] , reactive_power:pData[input]['reactive_power'], power_factor:pData[input++]['power_factor']});
              while(tAxis == pData[input++]['time']) { }
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
        var margin = {top: 14, right: 20, bottom: 60, left: 40},
        width = $(id).width() - margin.left - margin.right, 
        height = $(id).height() - margin.top - margin.bottom;

        var parseDate = d3.time.format("%H:%M:%S").parse;
        var legendSize = 10,
               color = d3.scale.category20();

        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().rangeRound([height, 0]);

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
        y.domain([0, 300]);

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
        .tickPadding([8])
        .orient("left");            

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
           .text(function(d) {            return d;          });

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
          // console.log();
          var currentX = $(this)[0]['cx']['animVal']['value'],
          currentY = $(this)[0]['cy']['animVal']['value'];

          d3.select(this).transition().duration(100).style("opacity", 1);

          var ret = $('.tipNetPoints').filter(function(index) {
            return ($(this)[0]['cx']['animVal']['value'] === currentX && $(this)[0]['cy']['animVal']['value'] !== currentY);
          });

          //to adjust tooltip'x content if upload and download data are the same
          var jud = ret.length;

          var mainCate = (function() {
            if (d['num'] != 0)
              return d['category'] + ' | ';
            else
              return '';
          })();

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
              .style("fill", "black")
              .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(0-2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(0+6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(0-2.5));

              svg.append("polyline")
              .attr("class", "tipDot")
              .style("fill", "black")
              .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(y(0)+2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(y(0)-6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(y(0)+2.5));
   
              $(this).tooltip({
                'container': 'body',
                'placement': 'left',
                'title': mainCate + d['num'],
                'trigger': 'hover'
              })
              .tooltip('show');
            })
        .on("mouseout",  function (d) {
          var currentX = $(this)[0]['cx']['animVal']['value'];

          d3.select(this).transition().duration(100).style("opacity", 0);

          var ret = $('.tipNetPoints').filter(function(index) {
            return ($(this)[0]['cx']['animVal']['value'] === currentX);
          });

          $.each(ret, function(index, val) {
            $(val).animate({
              opacity: "0"
            }, 100);

            $(val).tooltip('destroy');
          });

          d3.selectAll('.tipDot').transition().duration(100).remove();

          $(this).tooltip('destroy');
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
        .text(function(d) {          return d;        });

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
      .text(function(d) {        return d;      });

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