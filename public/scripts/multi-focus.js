d3.json("/reports/NYX2", function(err, data){
    var chart1 = dc.barChart("#test1");
    var chart2 = dc.barChart("#test2");
    var chart3 = dc.barChart("#test3");
    var chart4 = dc.barChart("#test4");
    data.forEach(function(x) {
        x.POWER_FACTOR = +x.POWER_FACTOR;
    });
    var nyx                 = crossfilter(data),
    indexDimension        = nyx.dimension(function(d) {return +d.index}),
    power  = indexDimension.group().reduceSum(function(d) {return +d.POWER_FACTOR;});
    voltage  = indexDimension.group().reduceSum(function(d) {return +d.VOLTAGE;});
    ampere = indexDimension.group().reduceSum(function(d) {return +d.AMPERE;});
    activeP = indexDimension.group().reduceSum(function(d) {return +d.ACTIVE_POWER;});

    function bar_chart1(chart) {
        chart
        .width(400)
        .height(300)
        .x(d3.scale.linear().domain([1,40]))
        .brushOn(false)
        .yAxisLabel("POWER_FACTOR!")
        .dimension(indexDimension)
        .group(power);
        chart.colors(d3.scale.category20b());
        return chart;
    }
        function bar_chart2(chart) {
        chart
        .width(400)
        .height(300)
        .x(d3.scale.linear().domain([1,40]))
        .brushOn(false)
        .yAxisLabel("VOLTAGE!")
        .dimension(indexDimension)
        .group(voltage);
        return chart;
    }
        function bar_chart3(chart) {
        chart
        .width(400)
        .height(300)
        .x(d3.scale.linear().domain([1,40]))
        .brushOn(false)
        .yAxisLabel("AMPERE!")
        .dimension(indexDimension)
        .group(ampere);
        return chart;
    }
        function bar_chart4(chart) {
        chart
        .width(400)
        .height(300)
        .x(d3.scale.linear().domain([1,40]))
        .brushOn(false)
        .yAxisLabel("ACTIVE_POWER!")
        .dimension(indexDimension)
        .group(activeP);
        return chart;
    }
    bar_chart1(chart1)
    .brushOn(true);
    bar_chart2(chart2) .brushOn(true);
    bar_chart3(chart3) .brushOn(true);
    bar_chart4(chart4) .brushOn(true);
        // this example was inspired by this Stack Overflow question:
        // http://stackoverflow.com/questions/27445259/dc-js-applying-range-chart-to-multiple-graphs
        // it would be nice to include the functionality in dc.js proper, but we'd have to deal with the
        // complementary part of having each focus chart change the range chart when it is zoomed
        // and that requires more thinking: https://github.com/dc-js/dc.js/issues/820
        // we need to this helper function out of coordinateGridMixin
        function rangesEqual(range1, range2) {
            if (!range1 && !range2) {
                return true;
            }
            else if (!range1 || !range2) {
                return false;
            }
            else if (range1.length === 0 && range2.length === 0) {
                return true;
            }
            else if (range1[0].valueOf() === range2[0].valueOf() &&
                range1[1].valueOf() === range2[1].valueOf()) {
                return true;
             }
              return false;
    }
        // monkey-patch the first chart with a new function
        // technically we don't even need to do this, we could just change the 'filtered'
        // event externally, but this is a bit nicer and could be added to dc.js core someday
        chart1.focusCharts = function (chartlist) {
            if (!arguments.length) {
                return this._focusCharts;
            }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };    
    chart2.focusCharts = function (chartlist) {
            if (!arguments.length) {
                return this._focusCharts;
            }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };    

    chart3.focusCharts = function (chartlist) {
            if (!arguments.length) {
                return this._focusCharts;
            }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };    

    chart4.focusCharts = function (chartlist) {
            if (!arguments.length) {
                return this._focusCharts;
            }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };    
    chart1.focusCharts([chart2,chart3,chart4]);
    chart2.focusCharts([chart1,chart3,chart4]);
    chart3.focusCharts([chart2,chart1,chart4]);
    chart4.focusCharts([chart2,chart3,chart1]);
    dc.renderAll();
});
