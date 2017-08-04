function getData(){
  d3.csv("../assets/demo1.csv", function(error, getData) {
      var day = new Date().getTime();     
      var clust = [], data = [];     
      var date = day-109*60*1000;     
      var cnt = 0, cntC = 0;
      console.log(getData);
      getData.forEach(function(d) {
        cnt++;
        if(cnt> 60){
           clust.push({ "x": cntC++, "value" : Math.floor(d.close/3) })
        }
        if(cnt <110){
          data.push({"date" : date, "value" : Math.floor(d.close/3)});             
        }
       date += 60*1000;

      });             
      drawLiveChart(data, clust, day);     
      drawChart(data, clust, day);
      drawLive(data);
    });
}

function drawLiveChart(data, clust, now){
    var limit = 60* 1,
    duration = 1000;   
 var margin = {top: 10, right: 50, bottom: 30, left: 50},
  width = window.innerWidth*0.88 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  var start = now-110*60*1000;
  console.log(data);
  console.log(clust);
  var value = clust[50].value;
    var groups = {
      output: {
        value: value,
        color: 'red',
        data: d3.range(0).map(function() {
          return 0
        })
      }
    }

    var x = d3.time.scale()
     .domain([now-109*60*1000, now+10*60*1000])
    .range([0, width])

    var y = d3.scale.linear()
    .domain([0, 300])
    .range([height, 3])


    var line = d3.svg.line()
    .interpolate('basis')
    .x(function(d, i) {       
     return x(now - (limit - 1 - i) * duration)  })
    .y(function(d) {      return y(d)   })

 var valueline = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.value); });

  var start = new Date().getTime()-50*60*1000;
   var compareline = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) {return x(start+((d.x+1)*60*1000));})
    .y(function(d) {return y(d.value);})


    var svg = d3.select('#real')
    .append('svg')    
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

    var xaxis = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

var yaxis = svg.append('g')
    .attr('class', 'y axis')   
    .call(y.axis = d3.svg.axis().scale(y).orient('left'))

  svg.append("path")   
  .attr("class", "valueline")
   .attr('stroke', 'gray')
  .attr("d", valueline(data));

  svg.append("path")   
  .attr("class", "compareline")
   .attr('stroke', 'skyblue')
   .attr('opacity', 0.5)
  .attr("d", compareline(clust));

    var paths = svg.append('g')

    for (var name in groups) {
      var group = groups[name]     
      group.path = paths.append('path')
      .data([group.data])
      .attr('class', name + ' group')
      .style('stroke', group.color)

      console.log(group);
    }

    var cnt = 1, index = 49;
  function tick() {     
    if(cnt++%60 == 0){
      value = clust[index++].value;
    }
    console.log(value);
    now = new Date().getTime() - duration;

    for (var name in groups) {
      var group = groups[name]
        //group.data.push(group.value) // Real values arrive at irregular intervals
        group.data.push(value)
        group.path.attr('d', line)
      }
    x.domain([now-109*60*1000, now+10*60*1000]);
    // Slide paths left
      paths.attr('transform', null)
      .transition()
      .duration(duration)
      .ease('linear')
   //   .attr('transform', 'translate(' + x(now - (limit) * duration) + ')')
      .each('end', tick)
    }
  tick();
}

function drawChart(data, clust, now){ 

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
  .y(function(d) { return y(d.value); });

  var start = new Date().getTime()-50*60*1000;
   var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) {return x(start+(d.x*60*1000));})
    .y(function(d) {return y(d.value);})
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
  x.domain([now-110*60*1000, now+10*60*1000]);
  y.domain([0, d3.max(data, function(d) { return d.value; })]);
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

  var paths = svg.append('g');


  function tick() {
   now = new Date().getTime();
   //console.log(now);
   data.push({ "date":now, "close" : 20 + Math.random() * 100});
    x.domain([now-109*60*1000, now+10*60*1000]);

  
      // Slide x-axis left
      // axis.transition()
      // .duration(duration)
      // .ease('linear')
      // .call(x.axis)
    // Slide paths left
    paths.attr('transform', null)
    .transition()
  //            .duration(duration)
    .ease('linear')
    .attr('transform', 'translate(' + now + ')')
    .each('end', tick);               
  }     
  tick();         
} 





function drawLive(data){
    var limit = 60 * 1,
            duration = 1*1000,
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