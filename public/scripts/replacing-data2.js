  d3.json("/reports/NYX", function(err, data){
// "Grab the filters from the charts, set the filters on the charts to null,
        // do your Crossfilter data removal, then add the filters back to the charts.
        // The exact filter format is kind of screwy, and the fact that you have to put
        // the output of .filters() in an array to make it work with .filter() is a bit strange."
        var eventRingChart   = dc.pieChart("#chart-ring-event"),
        powerRowChart = dc.rowChart("#chart-row-power");
        function resetData(nyx, dimensions) {
            var eventChartFilters = eventRingChart.filters();
            var powerChartFilters = powerRowChart.filters();
            eventRingChart.filter(null);
            powerRowChart.filter(null);
            nyx.remove();
            eventRingChart.filter([eventChartFilters]);
            powerRowChart.filter([powerChartFilters]);            
        }
        // set crossfilter with first dataset
        var nyx = crossfilter(data),
        eventDim  = nyx.dimension(function(d) {return +d.EVENT_TYPE;}),
        powerDim = nyx.dimension(function(d) {return d.POWER_FACTOR;}),
        idDim  = nyx.dimension(function(d) {return d.NODE_ID;}),
        powerPerEvent = eventDim.group().reduceSum(function(d) {return +d.POWER_FACTOR;}),
        powerPerId = idDim.group().reduceSum(function(d) {return +d.POWER_FACTOR;}),
        powerHist    = powerDim.group().reduceCount();
        function render_plots(){
            eventRingChart
            .width(200).height(200)
            .dimension(eventDim)
            .group(powerPerEvent)
            .innerRadius(50);
            powerRowChart
            .width(250).height(200)
            .dimension(idDim)
            .group(powerPerId)
            .elasticX(true)
            .colors(d3.scale.category10());
            dc.renderAll();
        }
        render_plots();
        // REFRESH DATA AFTER 5 SECONDS
        setTimeout(function() {
            console.log("data reset");
            resetData(nyx, [eventDim, powerDim, idDim]);
            nyx.add(data);
            dc.redrawAll();
        }, 5000);
    });