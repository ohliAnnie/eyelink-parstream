//# dc.js Getting Started and How-To Guide
'use strict';
var gainOrLossChart = dc.pieChart('#gain-loss-chart');
var fluctuationChart = dc.barChart('#fluctuation-chart');
var quarterChart = dc.pieChart('#quarter-chart');
var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
var moveChart = dc.lineChart('#monthly-move-chart');
var volumeChart = dc.barChart('#monthly-volume-chart');
var yearlyBubbleChart = dc.bubbleChart('#yearly-bubble-chart');
var nyxCount = dc.dataCount('.nyx-count');
var nyxTable = dc.dataTable('.dc-data-table');

d3.json("/reports/NYX3", function(err, data){       
    if (err) throw error;    
    var dateFormat = d3.time.format('%m/%d/%Y');        
    var numberFormat = d3.format('.2f'); 
    var minDate  = new Date("01/01/2014");
    var maxDate = new Date("12/31/2016");

    data.forEach(function (d) {                        
        d.dd = dateFormat.parse(d.date);            
        d.month = d3.time.month(d.dd); // pre-calculate month for better performance        
        d.VOLTAGE = +d.VOLTAGE;
        d.AMPERE = +d.AMPERE;
        d.POWER_FACTOR = +d.POWER_FACTOR;
        d.ACTIVE_POWER = +d.ACTIVE_POWER;
        d.REACTIVE_POWER = +d.REACTIVE_POWER;
        d.APPARENT_POWER = +d.APPARENT_POWER;
        d.AMOUNT_OF_ACTIVE_POWER = +d.AMOUNT_OF_ACTIVE_POWER;
        d.check = +0.85;
//        console.log(d);
});

    var nyx = crossfilter(data);
    var all = nyx.groupAll();

    var yearDim = nyx.dimension(function(d) {
  //      console.log(d3.time.year(d.dd).getFullYear()) ;
        return d3.time.year(d.dd).getFullYear();        
    });

    var yearData = yearDim.group().reduce(
        function (p, v) {
            ++p.days;          
            p.voltageT += v.VOLTAGE;
            p.ampareT += v.AMPERE;
            p.activePT += v.ACTIVE_POWER;
            p.amAPT += v.AMOUNT_OF_ACTIVE_POWER;
            p.voltageA = d3.round(p.voltageT/p.days,2);
            p.ampareA = d3.round(p.ampareT/p.days,2);
            p.activePA = d3.round(p.activePT/p.days,2);
            p.amAPA = d3.round(p.amAPT/p.days,2);
            console.log(p);
            return p;
        },
        function (p, v) {
            --p.days;          
            p.voltageT -= v.VOLTAGE;
            p.ampareT -= v.AMPERE;
            p.activePT -= v.ACTIVE_POWER;
            p.amAPT -= v.AMOUNT_OF_ACTIVE_POWER;
            p.voltageA = d3.round(p.voltageT/p.days,2);
            p.ampareA = d3.round(p.ampareT/p.days,2);
            p.activePA = d3.round(p.activePT/p.days,2);
            p.amAPA = d3.round(p.amAPT/p.days,2);
//            console.log(p);
            return p;
        },
        function () {
  //          console.log('check');
            return { days:0, voltageT: 0, activePT:0, ampareT: 0, amAPT:0, voltageA:0, ampareA:0, activePA:0, amAPA:0 };
        });
    var dateDimension = nyx.dimension(function (d) {
//        console.log(d.dd);
        return d.dd;
    });

    var moveMonths = nyx.dimension(function (d) {
//       console.log(d.month);
        return +d.month;
    });

     var indexAvgByMonthGroup = moveMonths.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.VOLTAGE;
            p.avg = p.days? Math.round(p.total / p.days) : 0;
/*            console.log(p);
            console.log('   month : '+v.month); */
             return p;
        },
        function (p, v) {
            --p.days;
            p.total -= v.VOLTAGE;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
//          console.log(p);
            return p;
        },
        function () {            
            return {days: 0, total: 0, avg: 0};
        });

   var apparentPMonthGroup = moveMonths.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.APPARENT_POWER;
            p.avg = Math.round(p.total / p.days);
   //         console.log(p);
            return p;
        },
        function (p, v) {
            --p.days;
            p.total -= v.APPARENT_POWER;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
            return p;
        },
        function () {
            return {days: 0, total: 0, avg: 0};
        });
        var ampereMonthGroup = moveMonths.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.AMPERE;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
//            console.log(p);
            return p;
        },
        function (p, v) {
            --p.days;
            p.total -= v.AMPERE;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
            return p;
        },
        function () {
            return {days: 0, total: 0, avg: 0};
        });

        var activePMonthGroup = moveMonths.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.ACTIVE_POWER;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
//            console.log(p);
            return p;
        },
        function (p, v) {
            --p.days;
            p.total -= v.ACTIVE_POWER;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
            return p;
        },
        function () {
            return {days: 0, total: 0, avg: 0};
        });

         var pFactorMonthGroup = moveMonths.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.POWER_FACTOR;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
      //      console.log(p);
            return p;
        },
        function (p, v) {
            --p.days;
            p.total -= v.POWER_FACTOR;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
            return p;
        },
        function () {
            return {days: 0, total: 0, avg: 0};
        });

    var gainOrLoss = nyx.dimension(function (d) {
//       console.log(d);
//      console.log(d.VOLTAGE < d.check ? 'Loss' : 'Gain');
        return d.AMOUNT_OF_ACTIVE_POWER < d.check ? 'Loss' : 'Gain';
    });

    var gainOrLossGroup = gainOrLoss.group();

    var fluctuation = nyx.dimension(function (d) {
        return d.AMOUNT_OF_ACTIVE_POWER * 100;
    });

    var fluctuationGroup = fluctuation.group();
    
    var quarter = nyx.dimension(function (d) {
        var month = d.dd.getMonth();
 //       console.log(month);
        if (month <= 2) {
            return 'Q1';
        } else if (month > 2 && month <= 5) {
            return 'Q2';
        } else if (month > 5 && month <= 8) {
            return 'Q3';
        } else {
            return 'Q4';
        }
    });

    var quarterGroup = quarter.group().reduceSum(function (d) {
        return d.VOLTAGE;
    });

    var dayOfWeek = nyx.dimension(function (d) {
        var day = d.dd.getDay();
        var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return day + '.' + name[day];
    });

    var dayOfWeekGroup = dayOfWeek.group();
   //#### Bubble Chart

    //Create a bubble chart and use the given css selector as anchor. You can also specify
    //an optional chart group for this chart to be scoped within. When a chart belongs
    //to a specific group then any interaction with the chart will only trigger redraws
    //on charts within the same chart group.
    // <br>API: [Bubble Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#bubble-chart)

    yearlyBubbleChart /* dc.bubbleChart('#yearly-bubble-chart', 'chartGroup') */
        // (_optional_) define chart width, `default = 200`
        .width(990)
        // (_optional_) define chart height, `default = 200`
        .height(200)
        // (_optional_) define chart transition duration, `default = 750`
        .transitionDuration(1000)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(yearDim)
        //The bubble chart expects the groups are reduced to multiple values which are used
        //to generate x, y, and radius for each key (bubble) in the group
        .group(yearData)
        // (_optional_) define color function or array for bubbles: [ColorBrewer](http://colorbrewer2.org/)
        .colors(colorbrewer.RdYlGn[9])
        //(optional) define color domain to match your data domain if you want to bind data or color
        .colorDomain([-100, 200])
    //##### Accessors

        //Accessor functions are applied to each value returned by the grouping

        // `.colorAccessor` - the returned value will be passed to the `.colors()` scale to determine a fill color
        .colorAccessor(function (d) {
            return d.value.voltageA;
        })
        // `.keyAccessor` - the `X` value will be passed to the `.x()` scale to determine pixel location
        .keyAccessor(function (p) {
            return p.value.voltageA;
        })
        // `.valueAccessor` - the `Y` value will be passed to the `.y()` scale to determine pixel location
        .valueAccessor(function (p) {
            console.log(p,value.amAPA);
            return p.value.amAPA;
        })
        // `.radiusValueAccessor` - the value will be passed to the `.r()` scale to determine radius size;
        //   by default this maps linearly to [0,100]
        .radiusValueAccessor(function (p) {
            return p.value.activePA;
        })
        .maxBubbleRelativeSize(0.3)
        .x(d3.scale.linear().domain([-250, 250]))
        .y(d3.scale.linear().domain([-100, 100]))
        .r(d3.scale.linear().domain([0, 4000]))
        //##### Elastic Scaling

        //`.elasticY` and `.elasticX` determine whether the chart should rescale each axis to fit the data.
        .elasticY(true)
        .elasticX(true)
        //`.yAxisPadding` and `.xAxisPadding` add padding to data above and below their max values in the same unit
        //domains as the Accessors.
        .yAxisPadding(100)
        .xAxisPadding(500)
        // (_optional_) render horizontal grid lines, `default=false`
        .renderHorizontalGridLines(true)
        // (_optional_) render vertical grid lines, `default=false`
        .renderVerticalGridLines(true)
        // (_optional_) render an axis label below the x axis
        .xAxisLabel('VOLTAGE AVG')
        // (_optional_) render a vertical axis lable left of the y axis
        .yAxisLabel('AMOUNT_OF_ACTIVE_POWER %')
        //##### Labels and  Titles

        //Labels are displayed on the chart for each bubble. Titles displayed on mouseover.
        // (_optional_) whether chart should render labels, `default = true`
        .renderLabel(true)
        .label(function (p) {
            return p.key;
        })
        // (_optional_) whether chart should render titles, `default = false`
        .renderTitle(true)
        .title(function (p) {
            return [
            p.key,
            'VOLTAGE AVG : ' + numberFormat(p.value.activePA),
            'AMOUNT_OF_ACTIVE_POWER AVG: ' + numberFormat(p.value.amAPA) + '%',
            'Ratio: ' + numberFormat(p.value.amAPA) + '%'
            ].join('\n');
        })
        //#### Customize Axes

        // Set a custom tick format. Both `.yAxis()` and `.xAxis()` return an axis object,
        // so any additional method chaining applies to the axis, not the chart.
        .yAxis().tickFormat(function (v) {
            return v + '%';
        });

    // #### Pie/Donut Charts

    // Create a pie chart and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    // <br>API: [Pie Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#pie-chart)

    gainOrLossChart /* dc.pieChart('#gain-loss-chart', 'chartGroup') */
        // (_optional_) define chart width, `default = 200`
        .width(180)
    // (optional) define chart height, `default = 200`
    .height(180)
    // Define pie radius
    .radius(80)
    // Set dimension
    .dimension(gainOrLoss)
    // Set group
    .group(gainOrLossGroup)
    // (_optional_) by default pie chart will use `group.key` as its label but you can overwrite it with a closure.
    .label(function (d) {
        if (gainOrLossChart.hasFilter() && !gainOrLossChart.hasFilter(d.key)) {
            return d.key + '(0%)';
        }
        var label = d.key;
        if (all.value()) {
            label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
        }
        return label;
    })
    /*
        // (_optional_) whether chart should render labels, `default = true`
        .renderLabel(true)
        // (_optional_) if inner radius is used then a donut chart will be generated instead of pie chart
        .innerRadius(40)
        // (_optional_) define chart transition duration, `default = 350`
        .transitionDuration(500)
        // (_optional_) define color array for slices
        .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        // (_optional_) define color domain to match your data domain if you want to bind data or color
        .colorDomain([-1750, 1644])
        // (_optional_) define color value accessor
        .colorAccessor(function(d, i){return d.value;})
        */;

        quarterChart /* dc.pieChart('#quarter-chart', 'chartGroup') */
        .width(180)
        .height(180)
        .radius(80)
        .innerRadius(30)
        .dimension(quarter)
        .group(quarterGroup);

    //#### Row Chart

    // Create a row chart and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    // <br>API: [Row Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#row-chart)
    dayOfWeekChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
    .width(180)
    .height(180)
    .margins({top: 20, left: 10, right: 10, bottom: 20})
    .group(dayOfWeekGroup)
    .dimension(dayOfWeek)
        // Assign colors to each value in the x scale domain
        .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        .label(function (d) {
            return d.key.split('.')[1];
        })
        // Title sets the row text
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);

    //#### Bar Chart

    // Create a bar chart and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    // <br>API: [Bar Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#bar-chart)
    fluctuationChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    .width(420)
    .height(180)
    .margins({top: 10, right: 50, bottom: 30, left: 40})
    .dimension(fluctuation)
    .group(fluctuationGroup)
    .elasticY(true)
        // (_optional_) whether bar should be center to its x value. Not needed for ordinal chart, `default=false`
        .centerBar(true)
        // (_optional_) set gap between bars manually in px, `default=2`
        .gap(1)
        // (_optional_) set filter brush rounding
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([-25, 25]))
        .renderHorizontalGridLines(true)
        // Customize the filter displayed in the control span
        .filterPrinter(function (filters) {
            var filter = filters[0], s = '';
            s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
            return s;
        });

    // Customize axes
    fluctuationChart.xAxis().tickFormat(
        function (v) { return v + '%'; });
    fluctuationChart.yAxis().ticks(5);


    //#### Stacked Area Chart
    //Specify an area chart by using a line chart with `.renderArea(true)`.
    // <br>API: [Stack Mixin](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#stack-mixin),
    // [Line Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#line-chart)
    moveChart /* dc.lineChart('#monthly-move-chart', 'chartGroup') */
    .renderArea(true)
    .width(990)
    .height(200)
    .transitionDuration(1000)
    .margins({top: 30, right: 50, bottom: 25, left: 40})
    .dimension(moveMonths)
    .mouseZoomable(true)
    // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
    .rangeChart(volumeChart)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.month.round)
    .xUnits(d3.time.months)
    .elasticY(true)
//    .y(d3.scale.linear().domain([0, 200]))
    .renderHorizontalGridLines(true)
    //##### Legend

        // Position the legend relative to the chart origin and specify items' height and separation.
        .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
        .brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
        // legend.
        // The `.valueAccessor` will be used for the base layer
        .group(indexAvgByMonthGroup, 'VOLTAGE')
        .valueAccessor(function (d) {
 //           console.log(d.value.avg);
            return d.value.avg;
        })
        // Stack additional layers with `.stack`. The first paramenter is a new group.
        // The second parameter is the series name. The third is a value accessor.
            .stack(apparentPMonthGroup, 'APPARENT_POWER', function (d) {
      //          console.log('APPARENT_POWER:'+d.value.avg);
                return d.value.avg;
            })
            .stack(ampereMonthGroup, 'AMPERE', function (d) {
//                console.log('AMPERE:'+d.value.avg);
                return d.value.avg;
            })
            .stack(activePMonthGroup, 'ACTIVE_POWER', function (d) {
//             console.log('ACTIVE_POWER:'+d.value.avg);
                return d.value.avg;
            })
           .stack(pFactorMonthGroup, 'POWER_FACTOR', function (d) {
//                console.log('POWER_FACTOR:'+d.value.avg);
                return d.value.avg;
            })
        // Title can be called by any stack layer.
        .title(function (d) {
            var value = d.value.avg;
            if (isNaN(value)) {
                value = 0;
            }
            console.log(d)
            console.log('title : '+value);
            console.log('key:'+d.key)
            console.log(dateFormat(d.key) + '\n' + numberFormat(value));
            return dateFormat(d.key) + '\n' + numberFormat(value);
        });


    //#### Range Chart

    // Since this bar chart is specified as "range chart" for the area chart, its brush extent
    // will always match the zoom of the area chart.
    volumeChart.width(990) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
    .height(40)
    .margins({top: 0, right: 50, bottom: 20, left: 40})
    .dimension(moveMonths)
    .group(indexAvgByMonthGroup)
    .centerBar(true)
    .gap(1)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.month.round)
    .alwaysUseRounding(true)
    .xUnits(d3.time.months);

    //#### Data Count

    // Create a data count widget and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    // <br>API: [Data Count Widget](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#data-count-widget)
    //
    //```html
    //<div class='dc-data-count'>
    //  <span class='filter-count'></span>
    //  selected out of <span class='total-count'></span> records.
    //</div>
    //```


    nyxCount /* dc.dataCount('.dc-data-count', 'chartGroup'); */
    .dimension(nyx)
    .group(all)
        // (_optional_) `.html` sets different html when some records or all records are selected.
        // `.html` replaces everything in the anchor with the html given using the following function.
        // `%filter-count` and `%total-count` are replaced with the values obtained.
        .html({
            some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
            ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset All</a>',
            all: 'All records selected. Please click on the graph to apply filters.'
        });

    //#### Data Table

    // Create a data table widget and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    // <br>API: [Data Table Widget](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#data-table-widget)
    //
    // You can statically define the headers like in
    //
    // ```html
    //    <!-- anchor div for data table -->
    //    <div id='data-table'>
    //       <!-- create a custom header -->
    //       <div class='header'>
    //           <span>Date</span>
    //           <span>Open</span>
    //           <span>Close</span>
    //           <span>Change</span>
    //           <span>Volume</span>
    //       </div>
    //       <!-- data rows will filled in here -->
    //    </div>
    // ```
    // or do it programmatically using `.columns()`.

    nyxTable /* dc.dataTable('.dc-data-table', 'chartGroup') */
    .dimension(dateDimension)
        // Data table does not use crossfilter group but rather a closure
        // as a grouping function
        .group(function (d) {
            var format = d3.format('02d');
            return d.dd.getFullYear() + '/' + format((d.dd.getMonth() + 1));
        })
        // (_optional_) max number of records to be shown, `default = 25`
        .size(10)
        // There are several ways to specify the columns; see the data-table documentation.
        // This code demonstrates generating the column header automatically based on the columns.
        .columns([
            // Use the `d.date` field; capitalized automatically
            'date',
            // Use `d.open`, `d.close`
            'VOLTAGE',            
            {
                // Specify a custom format for column 'Change' by using a label with a function.
                label: 'GAP',
                format: function (d) {
                    return numberFormat(d.VOLTAGE - 100);
                }
            },
  //          'AMPERE',
            'POWER_FACTOR',
   //         'ACTIVE_POWER',
     //       'REACTIVE_POWER',
            'APPARENT_POWER',
            'AMOUNT_OF_ACTIVE_POWER'
            ])

        // (_optional_) sort using the given field, `default = function(d){return d;}`
        .sortBy(function (d) {
            return d.dd;
        })
        // (_optional_) sort order, `default = d3.ascending`
        .order(d3.ascending)
        // (_optional_) custom renderlet to post-process chart using [D3](http://d3js.org)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });

    /*
    //#### Geo Choropleth Chart
    //Create a choropleth chart and use the given css selector as anchor. You can also specify
    //an optional chart group for this chart to be scoped within. When a chart belongs
    //to a specific group then any interaction with such chart will only trigger redraw
    //on other charts within the same chart group.
    // <br>API: [Geo Chroropleth Chart][choro]
    // [choro]: https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#geo-choropleth-chart
    dc.geoChoroplethChart('#us-chart')
         // (_optional_) define chart width, default 200
        .width(990)
        // (optional) define chart height, default 200
        .height(500)
        // (optional) define chart transition duration, default 1000
        .transitionDuration(1000)
        // set crossfilter dimension, dimension key should match the name retrieved in geojson layer
        .dimension(states)
        // set crossfilter group
        .group(stateRaisedSum)
        // (_optional_) define color function or array for bubbles
        .colors(['#ccc', '#E2F2FF','#C4E4FF','#9ED2FF','#81C5FF','#6BBAFF','#51AEFF','#36A2FF','#1E96FF','#0089FF',
            '#0061B5'])
        // (_optional_) define color domain to match your data domain if you want to bind data or color
        .colorDomain([-5, 200])
        // (_optional_) define color value accessor
        .colorAccessor(function(d, i){return d.value;})
        // Project the given geojson. You can call this function multiple times with different geojson feed to generate
        // multiple layers of geo paths.
        //
        // * 1st param - geojson data
        // * 2nd param - name of the layer which will be used to generate css class
        // * 3rd param - (_optional_) a function used to generate key for geo path, it should match the dimension key
        // in order for the coloring to work properly
        .overlayGeoJson(statesJson.features, 'state', function(d) {
            return d.properties.name;
        })
        // (_optional_) closure to generate title for path, `default = d.key + ': ' + d.value`
        .title(function(d) {
            return 'State: ' + d.key + '\nTotal Amount Raised: ' + numberFormat(d.value ? d.value : 0) + 'M';
        });
        //#### Bubble Overlay Chart
        // Create a overlay bubble chart and use the given css selector as anchor. You can also specify
        // an optional chart group for this chart to be scoped within. When a chart belongs
        // to a specific group then any interaction with the chart will only trigger redraw
        // on charts within the same chart group.
        // <br>API: [Bubble Overlay Chart][bubble]
        // [bubble]: https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#bubble-overlay-chart
        dc.bubbleOverlay('#bubble-overlay', 'chartGroup')
            // The bubble overlay chart does not generate its own svg element but rather reuses an existing
            // svg to generate its overlay layer
            .svg(d3.select('#bubble-overlay svg'))
            // (_optional_) define chart width, `default = 200`
            .width(990)
            // (_optional_) define chart height, `default = 200`
            .height(500)
            // (_optional_) define chart transition duration, `default = 1000`
            .transitionDuration(1000)
            // Set crossfilter dimension, dimension key should match the name retrieved in geo json layer
            .dimension(states)
            // Set crossfilter group
            .group(stateRaisedSum)
            // Closure used to retrieve x value from multi-value group
            .keyAccessor(function(p) {return p.value.absGain;})
            // Closure used to retrieve y value from multi-value group
            .valueAccessor(function(p) {return p.value.percentageGain;})
            // (_optional_) define color function or array for bubbles
            .colors(['#ccc', '#E2F2FF','#C4E4FF','#9ED2FF','#81C5FF','#6BBAFF','#51AEFF','#36A2FF','#1E96FF','#0089FF',
                '#0061B5'])
            // (_optional_) define color domain to match your data domain if you want to bind data or color
            .colorDomain([-5, 200])
            // (_optional_) define color value accessor
            .colorAccessor(function(d, i){return d.value;})
            // Closure used to retrieve radius value from multi-value group
            .radiusValueAccessor(function(p) {return p.value.fluctuationPercentage;})
            // set radius scale
            .r(d3.scale.linear().domain([0, 3]))
            // (_optional_) whether chart should render labels, `default = true`
            .renderLabel(true)
            // (_optional_) closure to generate label per bubble, `default = group.key`
            .label(function(p) {return p.key.getFullYear();})
            // (_optional_) whether chart should render titles, `default = false`
            .renderTitle(true)
            // (_optional_) closure to generate title per bubble, `default = d.key + ': ' + d.value`
            .title(function(d) {
                return 'Title: ' + d.key;
            })
            // add data point to its layer dimension key that matches point name: it will be used to
            // generate a bubble. Multiple data points can be added to the bubble overlay to generate
            // multiple bubbles.
            .point('California', 100, 120)
            .point('Colorado', 300, 120)
            // (_optional_) setting debug flag to true will generate a transparent layer on top of
            // bubble overlay which can be used to obtain relative `x`,`y` coordinate for specific
            // data point, `default = false`
            .debug(true);
            */

    //#### Rendering

    //simply call `.renderAll()` to render all charts on the page
  //       dc.renderAll();
    /*
    // Or you can render charts belonging to a specific chart group
    dc.renderAll('group');
    // Once rendered you can call `.redrawAll()` to update charts incrementally when the data
    // changes, without re-rendering everything
    dc.redrawAll();
    // Or you can choose to redraw only those charts associated with a specific chart group
    dc.redrawAll('group');
    */

});