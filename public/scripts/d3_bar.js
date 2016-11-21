d3.json("/reports/piechart", function(err, data){

  // console.log(data);

  if (err) throw error;


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 550 - margin.left - margin.right,
    height = 370 - margin.top - margin.bottom;

var x = d3.scaleBand().range([0, width]).padding(0.1);

var y = d3.scaleLinear().range([height, 0]);

/*var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);*/

var svg = d3.select("#barChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
//      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
  //    .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Years");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.vender); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.volume); })
      .attr("height", function(d) { return height - y(d.volume); });
});

function type(d) {
  d.volume = +d.volume;
  return d;
}
