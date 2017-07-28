function getData(){
  d3.csv("../assets/demo1.csv", function(error, data) {
      var day = new Date().getTime();
      var cDay = day-50*60*1000;
      var clust = [];
      for(i = cDay; i <= day+10*60*1000; i += 60*1000){
        clust.push({ "x":i,  "data" : 200+Math.random() * 100 })
      }
      console.log(clust);
      data.forEach(function(d) {
        d.date = day;
        day -= 60*1000
        d.close = +d.close;
      });        

      drawChart(data, clust);
      
    });
  drawLive();
}
function drawChart(data, clust){  
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
  width = window.innerWidth*0.85 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
    // Parse the date / time
    var parseDate = d3.time.format("%d-%b-%y").parse;
    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(12);
    var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
    // Define the line
    var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

     var line = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d) {return x(d.x);})
      .y(function(d) {return y(d.data);})
    // Adds the svg canvas
    var svg = d3.select("#Chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
    // Get the data
    
    // Scale the range of the data
    x.domain([new Date().getTime()-110*60*1000,new Date().getTime()+10*60*1000]);
    y.domain([0, d3.max(data, function(d) { return d.close; })]);
    // Add the valueline path.
    svg.append("path")    
    .attr("class", "line")
     .attr('stroke', 'black')
    .attr("d", valueline(data));
     svg.append("path")
    .attr("class", "line")
    .attr('stroke', 'blue')
    .attr("d", line(clust));
    // Add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    // Add the Y Axis
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    var paths = svg.append('path');

    function tick() {
       now = new Date();
       console.log(now);
       data.push({ "date":now, "close" : 20 + Math.random() * 100});



/*            // Slide x-axis left
            axis.transition()
            .duration(duration)
            .ease('linear')
            .call(x.axis)
*/
            // Slide paths left
            paths.attr('transform', null)
            .transition()
//            .duration(duration)
            .ease('linear')
            .attr('transform', 'translate(' + now + ')')
            .each('end', tick)
          sleep(now);

       
         
          }
//       tick();      

    function sleep(now) {
      console.log(now)
      var stop = now + 1*1000;      
      while(true) {
       now = new Date().getTime();       
        if(now > stop)  return;
      }
    }
  }











  function drawLive(){
    var limit = 60 * 1,
    duration = 750,
    now = new Date(Date.now() - duration)

    var width = 500,
    height = 200

    var groups = {
      current: {
        value: 0,
        color: 'orange',
        data: d3.range(limit).map(function() {
          return 0
        })
      },
      target: {
        value: 0,
        color: 'green',
        data: d3.range(limit).map(function() {
          return 0
        })
      },
      output: {
        value: 0,
        color: 'grey',
        data: d3.range(limit).map(function() {
          return 0
        })
      }
    }

    var x = d3.time.scale()
    .domain([now - (limit - 2), now - duration])
    .range([0, width])

    var y = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0])

    var line = d3.svg.line()
    .interpolate('basis')
    .x(function(d, i) {
      return x(now - (limit - 1 - i) * duration)
    })
    .y(function(d) {
      return y(d)
    })

    var svg = d3.select('.graph').append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height + 50)

    var axis = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

    var paths = svg.append('g')

    for (var name in groups) {
      var group = groups[name]
      group.path = paths.append('path')
      .data([group.data])
      .attr('class', name + ' group')
      .style('stroke', group.color)
    }

    function tick() {
      now = new Date()

            // Add new values
            for (var name in groups) {
              var group = groups[name]
                //group.data.push(group.value) // Real values arrive at irregular intervals
                group.data.push(20 + Math.random() * 100)
                group.path.attr('d', line)
              }

            // Shift domain
            x.domain([now - (limit - 2) * duration, now - duration])

            // Slide x-axis left
            axis.transition()
            .duration(duration)
            .ease('linear')
            .call(x.axis)

            // Slide paths left
            paths.attr('transform', null)
            .transition()
            .duration(duration)
            .ease('linear')
            .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
            .each('end', tick)

            // Remove oldest data point from each group
            for (var name in groups) {
              var group = groups[name]
              group.data.shift()
            }
          }

          tick()
        }