$(document).ready(function(e) {      
  getData();
});

var liveValue = [];
setInterval(function() { 
  var in_data = { url : "/analysis/restapi/getClusterNodeLive", type : "GET", data : {} };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {                        
      if(result.rtnData.length == 1){
        liveValue = result.rtnData[0];            
      }
    }
  });  
}, 5*1000);

function getData(){    
  var in_data = { url : "/analysis/restapi/getAnomalyChartData", type : "GET", data : {} };
  ajaxTypeData(in_data, function(result){  
    console.log(result)
    if (result.rtnCode.code == "0000") {      
      var raw = result.raw;      
      var point = new Date(result.pattern.timestamp).getTime(), start = point -50*60*1000, end = point+10*60*1000;      
      var now = new Date().getTime();      
      var tot = { "voltage" : [], "ampere" : [], "active_power" : [], "power_factor" : [] };    
      for(key in tot){
        drawChart(raw, result.tot[key], start, end, now, point, now-point, key, '#'+key, result.pattern);
      }
      console.log('start\n'+new Date(start));
      console.log('point\n'+new Date(point));
      console.log('now\n'+new Date(now));
      console.log('end\n'+new Date(end));
    }
  });  
}

function drawChart(raw, tot, start, end, now, point, gap, id, chart_id, pattern) {
  var compare = tot.data;
  var apt = tot.apt;
  var cpt = tot.cpt;
  oriEnd = end;    
  var limit = 60,    duration = 1000;   
  
  var margin = {top: 10, right: 50, bottom: 30, left: 50},
  width = window.innerWidth*0.88 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;  
  
  if(pattern[id].status.status == "normal"){
    var color = 'green';    
  } else if(pattern[id].status.status == "caution"){ 
    var color = 'blue';    
  } else if(pattern[id].status.status == "anomaly"){   
    var color = 'red';
  } else {
    var color = 'gray';
  }
  
  liveValue = raw[raw.length-1];        
  var groups = {
    output: {
      value: liveValue[id],
      color: 'black',
      data: d3.range(0).map(function() {
        return 0
      })
    }
  }

  now = new Date(liveValue.event_time).getTime();        
  var x = d3.time.scale()
    .domain([start, end])
    .range([0, width]);

  var yStart = (tot.min*0.1 < 1 ? 0 : tot.min*0.95);
  var yEnd = (tot.max*0.1 < 20 ? tot.max*1.25 : tot.max*1.05);

  var y = d3.scale.linear()    
    .domain([yStart, yEnd])
    .range([height, 3]);

  var line = d3.svg.line()
    .interpolate('basis')
    .x(function(d, i) { return x(now + i*(duration)) })
    .y(function(d) { return y(d) })

  var valueline = d3.svg.line()
    .interpolate('basis')
    .x(function(d) { return x(new Date(d.event_time)); })
    .y(function(d) { return y(d[id]); });
  
  var compareline = setLine(d3, x, y, "cardinal", "date", "center");
  var compareline2 = setLine(d3, x, y, "cardinal", "date", "center2");  
  var compareline3 = setLine(d3, x, y, "cardinal", "date", "center3");
  
  var upperOuterArea = setArea(d3, x, y, "basis", "date", "max", "upper");
  var upperInnerArea = setArea(d3, x, y, "basis", "date", "upper", "center");
  var lowerInnerArea = setArea(d3, x, y, "basis", "date", "center", "lower");  
  var lowerOuterArea = setArea(d3, x, y, "basis", "date", "lower", "min");
  
  var svg = d3.select(chart_id)
    .append('svg')    
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xaxis = svgSet(svg, 'g', 'x axis', 0, height)
    .call(x.axis = d3.svg.axis().scale(x).orient('bottom'));

  var yaxis = svg.append('g')
    .attr('class', 'y axis')   
    .call(y.axis = d3.svg.axis().scale(y).orient('left'));

  var legendWidth  = 380, legendHeight = 55;

  var legend = svgSet(svg, 'g', 'legend', margin.left , 0);

  rectLegendBG(legend, 'legend-bg', legendWidth, legendHeight);

  rectLegend(legend, 'inner', 55, 15, 10, 8);
  textLegend(legend, 103, 19, 'lower-upper');

  rectLegend(legend, 'outer', 55, 15, 10, 33);
  textLegend(legend, 95, 43, 'min-max');

  pathLegend(legend, 'compareline', 'M150,15L205,15');
  textLegend(legend, 230, 19, 'Pattern');

  pathLegend(legend, 'valueline', 'M150,40L205,40');
  textLegend(legend, 225, 43, 'Data');

  pathLegend(legend, 'compareline2', 'M265,15L320,15');
  textLegend(legend, 348, 19, 'Pattern2');

  pathLegend(legend, 'compareline3', 'M265,40L320,40');
  textLegend(legend, 348, 43, 'Pattern3');

  var statusWidth  = 63, statusHeight = 55;

  var status = svgSet(svg, 'g', 'status', 500 , 0);

  rectLegendBG(status, 'status-bg', statusWidth, statusHeight);
  textLegend(status, 20-pattern[id].status.status.length, 15, pattern[id].status.status);

  status.append('circle')    
    .attr('class', 'sign')
    .attr('cy',  34)
    .attr('cx', 32)
    .attr('r', 12)
    .style("fill", color );

  svgPath(svg, compare, 'area upper inner', upperInnerArea);
  svgPath(svg, compare, 'area lower inner', lowerInnerArea);
  svgPath(svg, compare, 'area upper outer', upperOuterArea);
  svgPath(svg, compare, 'area lower outer', lowerOuterArea);
  
  svgPath(svg, compare, 'compareline3', compareline);  
  svgPath(svg, compare, 'compareline2', compareline);
  svgPath(svg, compare, 'compareline', compareline);

  svgPath(svg, raw, 'valueline', valueline);

  var formatTime = d3.time.format("%I:%M:%S");

  // Define the div for the tooltip
  var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

  // Add the scatterplot
  svg.selectAll("dot1")  
    .data(raw)     
    .enter().append("circle")               
    .attr("r", 5)   
    .attr('opacity', 0)
    .attr("cx", function(d) { return x(new Date(d.event_time)); })     
    .attr("cy", function(d) { return y(d[id]); })   
    .on("mouseover", function(d) {    
      divTransition(div, 200, 1);    
      div .html(formatTime(new Date(d.event_time)) + "<br/>"  + d[id])  
        .style("left", (d3.event.pageX) + "px")   
        .style("top", (d3.event.pageY - 28) + "px");  
    })          
    .on("mouseout", function(d) {   
        divTransition(div, 500, 0); 
    });
      // Add the scatterplot
  svgCircle(svg, x, y, compare, "dot2", 5, 0, "date", "center")
    .on("mouseover", function(d, i) {    
      divTransition(div, 200, 1);      
      div .html(d.center.toFixed(3))  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
    })
    .on("mouseout", function(d) {   
         divTransition(div, 500, 0); 
    });

  var ddata = [];
  var circle = svgCircle(svg, x, y, ddata, "dot3", 5, 0.5, "date", "value")
    .on("mouseover", function(d) {    
      divTransition(div, 200, 1); 
      div .html(formatTime(new Date(d.date)) + "<br/>"  + d.value)  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
    })          
    .on("mouseout", function(d) {   
        divTransition(div, 500, 0); 
    });

   var circle = svgCircle(svg, x, y, cpt, "dot4", 3, 1, "date", "value")
    .attr('class', 'cpt')
    .attr("fill", "blue")
    .on("mouseover", function(d) {    
      divTransition(div, 200, 1).style("fill", "yellow");    
      div .html('caution</br>'+d.value)  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
    })          
    .on("mouseout", function(d) {   
      divTransition(div, 500, 0); 
    });   

  var circle =svgCircle(svg, x, y, apt, "dot5", 3, 0.1, "date", "value")
    .attr('class', 'apt')
    .attr("fill", "red")
    .on("mouseover", function(d) {    
      divTransition(div, 200, 1);
      div .html('anomaly</br>'+d.value)  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
    })          
    .on("mouseout", function(d) {   
      divTransition(div, 500, 0); 
    });   

  var paths = svg.append('g');

  for (var name in groups) {
    var group = groups[name];
    group.path = paths.append('path')    
      .data([group.data])
      .attr('class', name + ' group')
      .style('stroke', group.color);
  }
  
  oriNow = now;
  function tick() {           
    now = new Date().getTime();        
    value = liveValue[id];            
    for (var name in groups) {
      var group = groups[name];
      //group.data.push(group.value) // Real values arrive at irregular intervals
      group.value = value;
      group.data.push(value);
      group.path.attr('d', line);
    }      
    ddata.push({ date:now, value:value});     
    var d = ddata[ddata.length-1];

    x.domain([now-50*60*1000+gap, now+10*60*1000-gap]);     
    //console.log(new Date(now-50*60*1000+gap), new Date(now+10*60*1000-gap));     
    //x.domain([start,end]);
    
    // Slide paths left
    paths.attr('transform', null)
      .transition()
      .duration(duration)
      .ease('linear')
      // 트랜지션이 끝나는 시점에 동작할 내역(call back)
      .each('end', tick);

    //.attr('transform', 'translate(' + x(now - (limit) * duration) + ')')         
    if(oriEnd<=now){
      if(now > oriEnd+3*60*1000) {        
        window.location.reload(true);
      }
      if(now >= (end+2*60*1000)){
        end += 2*60*1000;
      }
      if((oriEnd-end) < 10*1000) {
        oriNow = now;
        var in_data = { url : "/analysis/restapi/getAnomalyPatternCheck/", type : "GET", data : {} };
        ajaxTypeData(in_data, function(result){
          console.log(result.rtnCode.message);
          if (result.rtnCode.code == "0000") {
            console.log('reload');
            window.location.reload(true);
          }
        });
      }        
    }
  }
  tick();  
}

var cnt = 0, oriEnd = 0, oriNow = 0;

function setLine(d3, x, y, type, key1, key2) {
  return d3.svg.line()
    .interpolate(type)
    .x(function(d, i) { return x(d[key1]); })
    .y(function(d) { return y(d[key2]); })
}

function setArea(d3, x, y, type, key1, key2, key3) {
  return d3.svg.area()
    .interpolate(type)
    .x (function (d,i) { return x(d[key1]); })
    .y0(function (d) { return y(d[key2]); })
    .y1(function (d) { return y(d[key3]); })
}

function rectLegend(legend, className, width, height, x, y) {
  return legend
    .append('rect')
    .attr('class', className)
    .attr('width', width)
    .attr('height', height)
    .attr('x', x)
    .attr('y', y)
}

function rectLegendBG(legend, className, width, height) {
  return legend
    .append('rect')
    .attr('class', className)
    .attr('width', width)
    .attr('height', height)
}

function textLegend(legend, x, y, text){
  return legend
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .text(text)
}

function pathLegend(legend, className, d) {
  return legend
    .append('path')
    .attr('class', className)
    .attr('d', d);
}

function svgSet(svg, append, className, tX, tY){
  return svg
    .append(append)
    .attr('class', className)
    .attr('transform', 'translate('+tX+','+tY+')');
}

function svgPath(svg, data, className, d){
  return svg
    .append('path')
    .datum(data)     
    .attr('class', className)
    .attr('d', d)
}

function svgCircle(svg, x, y, data, className, r, opacity, cx, cy) {
  return svg
    .selectAll(className)  
    .data(data)     
    .enter().append("circle")               
    .attr("r", r)   
    .attr('opacity', opacity)
    .attr("cx", function(d, i) { return x(d[cx]); })     
    .attr("cy", function(d) { return y(d[cy]); })
}

function divTransition(div, duration, opacity){
  return div
    .transition()    
    .duration(duration)
    .style("opacity", opacity)
}