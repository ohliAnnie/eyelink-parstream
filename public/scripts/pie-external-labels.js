var chart = dc.pieChart("#donut");
d3.json("/reports/NYX", function(err, data){

  if (err) throw error;
        var nyx           = crossfilter(data),
        EventType  = nyx.dimension(function(d) {return "EventType-"+d.EVENT_TYPE;})
        PowerSum = EventType.group().reduceSum(function(d) {return d.POWER_FACTOR;});
        chart
        .width(500)
        .height(300)        
        .slicesCap(4)
        .innerRadius(50)
        .externalLabels(50)
        .externalRadiusPadding(50)
        .drawPaths(true)
        .dimension(EventType)
        .group(PowerSum)
        .legend(dc.legend())
        .colors(d3.scale.category10());
        // example of formatting the legend via svg
        // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
        chart.on('pretransition', function(chart) {
        chart.selectAll('.dc-legend-item text')
        .text('')
        .append('tspan')
        .text(function(d) { return d.name; })
        .style("fill", "white")
        .append('tspan')
        .attr('x', 200)
        .attr('text-anchor', 'end')
        .text(function(d) { return d.data; });
        });
        chart.render();
});