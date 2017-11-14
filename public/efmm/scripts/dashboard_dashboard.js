$(document).ready(function(e) {      
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().subtract(7, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));
  rawData = [
  { index : 0, date : moment().subtract(6, 'days').format(dateFormat), oee : 88, availability : 93, performance : 97, quality : 99},
  { index : 1, date : moment().subtract(5, 'days').format(dateFormat), oee : 76, availability : 90, performance : 84, quality : 99},
  { index : 2, date : moment().subtract(4, 'days').format(dateFormat), oee : 81, availability : 89, performance : 91, quality : 99},
  { index : 3, date : moment().subtract(3, 'days').format(dateFormat), oee : 83, availability : 90, performance : 93, quality : 99},
  { index : 4, date : moment().subtract(2, 'days').format(dateFormat), oee : 77, availability : 88, performance : 87, quality : 99},
  { index : 5, date : moment().subtract(1, 'days').format(dateFormat), oee : 81, availability : 91, performance : 89, quality : 99},
  { index : 6, date : moment().format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99}]
  console.log(rawData)
  drawGage(rawData[6]);
  drawLineChart(rawData);
});

function drawGage(value){  
  var max = 100; 

  var oee = getGaguChart("oee", max, 'yellow', value["oee"], 0.29);
  var availability = getGaguChart("availability", max, 'blue', value["availability"], 0.21);
  var performance = getGaguChart("performance", max, 'orange', value["performance"], 0.21);
  var quality = getGaguChart("quality", max, 'green', value["quality"], 0.21);  
}

function getGaguChart(id, max, color, value, size) {
  return new RadialProgressChart('.'+id, {
    diameter: 200,
    max: max,
    round: false,
    series: [
    {
      value: value,
      color: ['red', color]
    }
    ],
    center: function (d) {
      return d.toFixed(1) + '%'
    },
    size : {
      width : window.innerWidth*size,
      height : window.innerWidth*size
    }
  });
}

function drawLineChart(data) {
  var xData = [];
  for(i=0; i<data.length; i++){
    xData[i] = data[i].date;
  }
  var composite = dc.compositeChart("#composed");
  
  var ndx = crossfilter(data);

  var dim  = ndx.dimension(function(d){
    return d.index;
  });
  oGroup = dim.group().reduceSum(function(d) { return d.oee; });
  aGroup = dim.group().reduceSum(function(d) { return d.availability; });
  pGroup = dim.group().reduceSum(function(d) { return d.performance; });
  qGroup = dim.group().reduceSum(function(d) { return d.quality; });

  composite.margins().bottom = 50;
  composite.margins().right = 65;
  composite.xAxis().tickFormat(function(v) {return xData[v];});
  composite.yAxis().ticks(7);
  composite
    .width(window.innerWidth*0.38)
    .height(290)
    .x(d3.scale.linear().domain([0,6]))           
    .y(d3.scale.linear().domain([50, 110]))    
    .yAxisLabel("%")
    .legend(dc.legend().x(window.innerWidth*0.05).y(267).itemHeight(12).itemWidth(window.innerWidth*0.07).gap(4).horizontal(true))
    .renderHorizontalGridLines(true)
    .compose([
        dc.lineChart(composite)
            .dimension(dim)            
            .colors('yellow')
            .renderDataPoints(true)
            .group(oGroup, "OEE"),
        dc.lineChart(composite)
            .dimension(dim)
            .colors('blue')
            .renderDataPoints(true)
            .group(aGroup, "Availability"),
        dc.lineChart(composite)
            .dimension(dim)
            .colors('orange')
            .renderDataPoints(true)
            .group(pGroup, "Performance"),
        dc.lineChart(composite)
            .dimension(dim)
            .colors('green')
            .renderDataPoints(true)
            .group(qGroup, "Quality")            
        ])
    .brushOn(false)
    .render();
}