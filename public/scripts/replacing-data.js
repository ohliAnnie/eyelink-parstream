        var yearRingChart   = dc.pieChart("#chart-ring-year"),
        spenderRowChart = dc.rowChart("#chart-row-spenders");
        var data1 = [
        {Name: 'Mr A', Spent: 40, Year: 2011},
        {Name: 'Mr B', Spent: 10, Year: 2011},
        {Name: 'Mr C', Spent: 40, Year: 2011},
        {Name: 'Mr A', Spent: 70, Year: 2012},
        {Name: 'Mr B', Spent: 20, Year: 2012},
        {Name: 'Mr B', Spent: 50, Year: 2013},
        {Name: 'Mr C', Spent: 30, Year: 2013}
        ];
        var data2 = [
        {Name: 'Mr A', Spent: 10, Year: 2011},
        {Name: 'Mr B', Spent: 20, Year: 2011},
        {Name: 'Mr C', Spent: 50, Year: 2011},
        {Name: 'Mr A', Spent: 20, Year: 2012},
        {Name: 'Mr B', Spent: 40, Year: 2012},
        {Name: 'Mr B', Spent: 50, Year: 2013},
        {Name: 'Mr C', Spent: 50, Year: 2013}
        ];
        // "Grab the filters from the charts, set the filters on the charts to null,
        // do your Crossfilter data removal, then add the filters back to the charts.
        // The exact filter format is kind of screwy, and the fact that you have to put
        // the output of .filters() in an array to make it work with .filter() is a bit strange."
        function resetData(ndx, dimensions) {
                var yearChartFilters = yearRingChart.filters();
                var spenderChartFilters = spenderRowChart.filters();
                yearRingChart.filter(null);
                spenderRowChart.filter(null);
                ndx.remove();
                yearRingChart.filter([yearChartFilters]);
                spenderRowChart.filter([spenderChartFilters]);
                console.log(spenderRowChart.filters());
        }
        // set crossfilter with first dataset
        var ndx = crossfilter(data1),
        yearDim  = ndx.dimension(function(d) {return +d.Year;}),
        spendDim = ndx.dimension(function(d) {return Math.floor(d.Spent/10);}),
        nameDim  = ndx.dimension(function(d) {return d.Name;}),
        spendPerYear = yearDim.group().reduceSum(function(d) {return +d.Spent;}),
        spendPerName = nameDim.group().reduceSum(function(d) {return +d.Spent;}),
        spendHist    = spendDim.group().reduceCount();
        function render_plots(){
                yearRingChart
                .width(200).height(200)
                .dimension(yearDim)
                .group(spendPerYear)
                .innerRadius(50);
                spenderRowChart
                .width(250).height(200)
                .dimension(nameDim)
                .group(spendPerName)
                .elasticX(true);
                dc.renderAll();
        }
        render_plots();
        // REFRESH DATA AFTER 5 SECONDS
        setTimeout(function() {
                console.log("data reset");
                resetData(ndx, [yearDim, spendDim, nameDim]);
                ndx.add(data2);
                dc.redrawAll();
        }, 5000);