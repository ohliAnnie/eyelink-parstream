d3.json("/reports/NYX2", function(err, data){   	
    if (err) throw error;

    var moveChart = dc.lineChart('#line-fill');
    var numberFormat = d3.format('.4f');
     
    //var all = nyx.groupAll();
    var nyx                 = crossfilter(data),
    indexDimension    = nyx.dimension(function(d) { return +d.index}),
    pFactor  = indexDimension.group().reduceSum(function(d) {
        console.log(d.POWER_FACTOR);
        return +d.POWER_FACTOR }),
    voltage  = indexDimension.group().reduceSum(function(d) {return +d.VOLTAGE;}),
    ampere = indexDimension.group().reduceSum(function(d) {return +d.AMPERE;}),
    activeP = indexDimension.group().reduceSum(function(d) {return +d.ACTIVE_POWER;});
 
    //Specify an area chart by using a line chart with `.renderArea(true)`.
    // <br>API: [Stack Mixin](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#stack-mixin),
    // [Line Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#line-chart)
    moveChart /* dc.lineChart('#monthly-move-chart', 'chartGroup') */
        .renderArea(true)
        .width(900)
        .height(200)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(indexDimension)
        .mouseZoomable(true)
    // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
    //    .rangeChart(volumeChart)  // 연동
        .x(d3.scale.linear().domain([0,40]))    
        .elasticY(true)
        //.renderHorizontalGridLines(true)
    //##### Legend

        // Position the legend relative to the chart origin and specify items' height and separation.
        .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
        .brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
        // legend.
        // The `.valueAccessor` will be used for the base layer
        .group(voltage, 'VOLTAGE')
        .valueAccessor(function (d) {     	
            return d.value;
        })
        // Stack additional layers with `.stack`. The first paramenter is a new group.
        // The second parameter is the series name. The third is a value accessor.
        .stack(ampere, 'AMPERE', function (d) {
            return d.value;
        })
        .stack(pFactor, 'POWER_FACTOR', function (d) {
//            console.log(d.value);
            return d.value;
        })
        .stack(activeP, 'ACTIVE_POWER', function (d) {
            return d.value;
        })        
        // Title can be called by any stack layer.
        .title(function (d) {
            	var value = d.value;            	
        	if(isNaN(value)){
        		value = 0;
        	}
            return numberFormat(value);     
        });
    //    dc.renderAll();

});