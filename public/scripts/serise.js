var chart = dc.seriesChart("#test");
var nyx, Dimension;

d3.json("/reports/NYX2", function(err, data){

  if (err) throw error;

  nyx = crossfilter(data);
  Dimension = nyx.dimension(function(d) {return [+d.Expt, +d.Run]; });
  runGroup = runDimension.group().reduceSum(function(d) { return +d.Speed; });

  chart
    .width(768)
    .height(480)
    .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
    .x(d3.scale.linear().domain([0,40]))
    .brushOn(false)
    .yAxisLabel("Measured Speed km/s")
    .xAxisLabel("Run")
    .clipPadding(10)
    .elasticY(true)
    .dimension(runDimension)
    .group(runGroup)
    .mouseZoomable(true)
    .seriesAccessor(function(d) {return "Expt: " + d.key[0];})
    .keyAccessor(function(d) {return +d.key[1];})
    .valueAccessor(function(d) {return +d.value - 500;})
    .legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
  chart.yAxis().tickFormat(function(d) {return d3.format(',d')(d+299500);});
  chart.margins().left += 40;

  dc.renderAll();

});

