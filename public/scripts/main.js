//# dc.js Getting Started and How-To Guide
'use strict';

var quarterChart = dc.pieChart('#quarter-chart');
var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
var moveChart = dc.lineChart('#monthly-move-chart');
var volumeChart = dc.barChart('#monthly-volume-chart');
var nyxCount = dc.dataCount('.nyx-count');
var nyxTable = dc.dataTable('.dc-data-table');
var yearlyBubbleChart = dc.bubbleChart('#yearly-bubble-chart');

d3.json("/reports/NYX3", function(err, data){       
    if (err) throw error;    
        var dateFormat = d3.time.format('%m/%d/%Y');        
        var numberFormat = d3.format('.2f'); 
        
      data.forEach(function (d) {                        
        d.day = dateFormat.parse(d.date);            
        d.mon = d3.time.month(d.day); // pre-calculate month for better performance        
        d.VOLTAGE = +d.VOLTAGE;
        d.AMPERE = +d.AMPERE;
        d.POWER_FACTOR = +d.POWER_FACTOR;
        d.ACTIVE_POWER = +d.ACTIVE_POWER;
        d.REACTIVE_POWER = +d.REACTIVE_POWER;
        d.APPARENT_POWER = +d.APPARENT_POWER;
        d.AMOUNT_OF_ACTIVE_POWER = +d.AMOUNT_OF_ACTIVE_POWER;
//        console.log(d);
     });

    var nyx = crossfilter(data);
    var all = nyx.groupAll();

    var yearDim = nyx.dimension(function(d) {        
        return d3.time.year(d.day).getFullYear();
    });
  
    var yearActiveP = yearDim.group().reduce(
        function (p, v) {
            ++p.days;          
            p.name = 'ACTIVE_POWER';        
            p.value =   v.ACTIVE_POWER;
            p.total += v.ACTIVE_POWER;
            p.avg = p.days ? Math.round(p.total / p.days)  : 0;
            p.gap = p.value - p.avg
            p.per = p.avg ? (p.gap/p.avg)*100 : 0;
            console.log(p);
            return p;
        },
        function (p, v) {
            --p.days;
            p.name = 'ACTIVE_POWER';        
            p.value =   v.ACTIVE_POWER;
            p.total += v.ACTIVE_POWER;
            p.avg = p.days ? Math.round(p.total / p.days)  : 0;
            p.gap = p.value - p.avg
            p.per = p.avg ? (p.gap/p.avg)*100 : 0;
            console.log(p);
            return p;
        },
        function () {
            return { name : '',value:0, days: 0, total: 0, avg: 0, gap:0, per:0};
        }
    );

    var dayDim = nyx.dimension(function(d) {
        //console.log(d.day);
        return d.day;
    });    
    /*var dayPFactor  = dayDim.group().reduceSum(function(d) {return +d.POWER_FACTOR });
    var dayVoltage  = dayDim.group().reduceSum(function(d) {return +d.VOLTAGE;});
    var dayAmpere = dayDim.group().reduceSum(function(d) {return +d.AMPERE;});
    var dayActiveP = dayDim.group().reduceSum(function(d) {return +d.ACTIVE_POWER;});*/

    var monDim = nyx.dimension(function(d){
        //console.log(d.mon);
        return d.mon;
    });
    
    var monPFactor = monDim.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.POWER_FACTOR;
            p.avg = Math.round(p.total / p.days);
            console.log(p);
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
        }
    );    
    var monVoltage = monDim.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.VOLTAGE;
            p.avg = Math.round(p.total / p.days);
            return p;
        },
        function (p, v) {
            --p.days;
            p.total -= v.VOLTAGE;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
            return p;
        },
        function () {
            return {days: 0, total: 0, avg: 0};
        }
    );    
    var monAmpere = monDim.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.AMPERE;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
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
        }
    );    

    var monActiveP = monDim.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += v.ACTIVE_POWER;
            p.avg = Math.round(p.total / p.days);
            console.log();
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
        }
    );

    // Summarize volume by quarter
    var quarter = nyx.dimension(function (d) {
        var month = d.day.getMonth();
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
        console.log(d);
        return d.ACTIVE_POWER;
    });

    // Counts per weekday
    var dayOfWeek = nyx.dimension(function (d) {
        var day = d.day.getDay();
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
        .height(250)
        // (_optional_) define chart transition duration, `default = 750`
        .transitionDuration(1500)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(yearDim)
        //The bubble chart expects the groups are reduced to multiple values which are used
        //to generate x, y, and radius for each key (bubble) in the group
        .group(yearActiveP)
        // (_optional_) define color function or array for bubbles: [ColorBrewer](http://colorbrewer2.org/)
        .colors(colorbrewer.RdYlGn[9])
        //(optional) define color domain to match your data domain if you want to bind data or color
        .colorDomain([-500, 500])
    //##### Accessors

        //Accessor functions are applied to each value returned by the grouping

        // `.colorAccessor` - the returned value will be passed to the `.colors()` scale to determine a fill color
        .colorAccessor(function (d) {
            return d.value.avg;
        })
        // `.keyAccessor` - the `X` value will be passed to the `.x()` scale to determine pixel location
        .keyAccessor(function (p) {
            return p.value.avg;
        })
        // `.valueAccessor` - the `Y` value will be passed to the `.y()` scale to determine pixel location
        .valueAccessor(function (p) {
            return p.value.per;
            
        })
        // `.radiusValueAccessor` - the value will be passed to the `.r()` scale to determine radius size;
        //   by default this maps linearly to [0,100]
        .radiusValueAccessor(function (p) {
            return p.value.fluctuationPercentage;
        })
        .maxBubbleRelativeSize(0.3)
        .x(d3.scale.linear().domain([-2500, 2500]))
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
        .xAxisLabel('Index Gain')
        // (_optional_) render a vertical axis lable left of the y axis
        .yAxisLabel('Index Gain %')
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
                'Index Gain: ' + numberFormat(p.value.absGain),
                'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%',
                'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%'
            ].join('\n');
        })
        //#### Customize Axes

        // Set a custom tick format. Both `.yAxis()` and `.xAxis()` return an axis object,
        // so any additional method chaining applies to the axis, not the chart.
        .yAxis().tickFormat(function (v) {
            return v + '%';
        });

        // #### Pie/Donut Charts

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
        .dimension(monDim)
        .mouseZoomable(true)
    // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
        .rangeChart(volumeChart)
        .x(d3.time.scale().domain([new Date(2015, 0, 1), new Date(2016, 12, 31)]))
        .round(d3.time.month.round)
        .xUnits(d3.time.months)
        .elasticY(true)
        .renderHorizontalGridLines(true)
    //##### Legend

        // Position the legend relative to the chart origin and specify items' height and separation.
        .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
        .brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
        // legend.
        // The `.valueAccessor` will be used for the base layer
        .group(monVoltage, 'VOLTAGE')
        .valueAccessor(function (d) {       
            return d.value;
        })
        // Stack additional layers with `.stack`. The first paramenter is a new group.
        // The second parameter is the series name. The third is a value accessor.
        .stack(monAmpere, 'AMPERE', function (d) {
            console.log(d.value);
            return d.value;
        })
        .stack(monPFactor, 'POWER_FACTOR', function (d) {
            return d.value;
        })
        .stack(monActiveP, 'ACTIVE_POWER', function (d) {
            return d.value;
        })        
        // Title can be called by any stack layer.
         .title(function (d) {
            var value = d.value.avg ? d.value.avg : d.value;
            if (isNaN(value)) {
                value = 0;
            }
            return dateFormat(d.key) + '\n' + numberFormat(value);
        });


    //#### Range Chart

    // Since this bar chart is specified as "range chart" for the area chart, its brush extent
    // will always match the zoom of the area chart.
    volumeChart.width(990) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        .height(40)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(monDim)
        .group(monActiveP)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([new Date(2000, 1, 1), new Date(2016, 12, 31)]))
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
        .dimension(dayDim)
        // Data table does not use crossfilter group but rather a closure
        // as a grouping function
        .group(function (d) {
            var format = d3.format('02d');
            console.log(d);
            return d.day.getFullYear() + '/' + format((d.day.getMonth() + 1));
        })
        // (_optional_) max number of records to be shown, `default = 25`
        .size(10)
        // There are several ways to specify the columns; see the data-table documentation.
        // This code demonstrates generating the column header automatically based on the columns.
        .columns([
            'DATE',
            'VOLTAGE',
            'AMPERE',
            'POWER_FACTOR',
            'ACTIVE_POWER',
            'REACTIVE_POWER',
            'APPARENT_POWER',
            'AMOUNT_OF_ACTIVE_POWER'
        ])

        // (_optional_) sort using the given field, `default = function(d){return d;}`
        .sortBy(function (d) {
            return d.day;
        })
        // (_optional_) sort order, `default = d3.ascending`
        .order(d3.ascending)
        // (_optional_) custom renderlet to post-process chart using [D3](http://d3js.org)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });
 //       dc.renderAll();
});