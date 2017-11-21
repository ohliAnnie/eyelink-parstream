$(document).ready(function(e) {      
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().subtract(7, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));
  rawData = [
  { date : moment().subtract(6, 'days').format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99},
  { date : moment().subtract(5, 'days').format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99},
  { date : moment().subtract(4, 'days').format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99},
  { date : moment().subtract(3, 'days').format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99},
  { date : moment().subtract(2, 'days').format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99},
  { date : moment().subtract(1, 'days').format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99},
  { date : moment().format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99}]
  console.log(rawData)
  drawGage(rawData[6]);
  drawLineChart(rawData);
});


function drawGage(value){
  console.log(value);
  var max = 100; 

  var oee = getGaguChart("oee", max, 'yellow', value["oee"], 0.29);
  var availability =  getGaguChart("availability", max, 'red', value["availability"], 0.21);
  var performance = getGaguChart("performance", max, 'orange', value["performance"], 0.21);
  var quality = getGaguChart("quality", max, 'green', value["quality"], 0.21);  
}

function getGaguChart(id, max, color, value, size) {
  return new RadialProgressChart('.'+id, {
    diameter: 200,
    max: max,
    round: false,
    series: [
    {
      value: value,
      color: ['red', color]
    }
    ],
    center: function (d) {
      return d.toFixed(1) + '%'
    },
    size : {
      width : window.innerWidth*size,
      height : window.innerWidth*size
    }
  });
}

function drawLineChart(data) {  

  console.log(data);

  var svgWidth  = window.innerWidth*0.4,
      svgHeight = 300,
      margin = { top: 20, right: 20, bottom: 100, left: 40 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.time.scale().range([0, chartWidth])
          .domain([0, 100]);
  var y = d3.scale.linear().range([chartHeight, 0])
          .domain(d3.extent(data, function (d) { return d.date; }));
            

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

  var svg = d3.select('.lineChart').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.datum(data);

  addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);

  var oline = setLine(d3, x, y, "cardinal", "date", "oee");
  svgPath(svg, data, 'oline', oline);  
}

function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 200,
      legendHeight = 100;

  // clipping to make sure nothing appears behind legend
  
  var axes = svg.append('g');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis);

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('%');

  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');


  drawPathLegend(legend, d3, "availability", 115, 85, 'aline')
}

function drawPathLegend(legend, d3, text, xText, yText, cName){
  legend.append('path')
    .attr('class', cName)
    .attr('d', 'M10,80L85,80');

  legend.append('text')
    .attr('x', xText)
    .attr('y', yText)
    .text(text);

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

function setLine(d3, x, y, type, key) {
  return d3.svg.line()
    .interpolate(type)
    .x(function(d, i) { return x(d.date); })
    .y(function(d) { return y(d[key]); })
}

function svgPath(svg, data, className, d){
  return svg
    .append('path')
    .datum(data)     
    .attr('class', className)
    .attr('d', d)
}
