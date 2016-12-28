var chart01, chart02;
function drawChart() {
  var data = [
    {date:new Date('2016-01-01'), power:120, noise:150, vibration:200},
    {date:new Date('2016-01-15'), power:100, noise:150, vibration:100},
    {date:new Date('2016-02-02'), power:150, noise:150, vibration:100},
    {date:new Date('2016-03-02'), power:200, noise:150, vibration:100},
    {date:new Date('2016-04-02'), power:150, noise:150, vibration:100},
    {date:new Date('2016-11-02'), power:50 , noise:150, vibration:100},
  ];
  chart01 = d3.timeseries()
    .addSerie(data,{x:'date',y:'power'},{interpolate:'linear'})
    .addSerie(data,{x:'date',y:'noise'},{interpolate:'step-before'})
    .addSerie(data,{x:'date',y:'vibration'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width(700)
    .height(260)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

    console.log(chart01);
  chart01('#ts-chart01');

  chart02 = d3.timeseries()
    .addSerie(data,{x:'date',y:'power'},{interpolate:'linear'})
    .addSerie(data,{x:'date',y:'noise'},{interpolate:'step-before'})
    .addSerie(data,{x:'date',y:'vibration'},{interpolate:'linear'})
    // .xscale.tickFormat(french_timeformat)
    .width(700)
    .height(260)
    // .yscale.tickFormat(french_locale.numberFormat(",f"))
    .margin.left(0);

  chart02('#ts-chart02');

}