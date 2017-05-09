function summary() {
  var chart = dc.barChart("#test");

  var date = new Date();
  var data = [];
  for(var i=date.getTime() - 86400000; i<date.getTime() - 69120000; i+=173){
    var num = (Math.floor(Math.random() * 10) + 1);
    data.push({
      time : i,
      sec : num,
      type : num <= 1 ? '1s' : (num <= 3 ? '3s' : (num <= 5 ? '5s' : (num < 10 ? 'Slow' : 'Error')))
    });
  }

  console.log(data);
  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var typeDim = nyx.dimension(function(d) {        
    return d.type; 
  });

  var BarGroup = typeDim.group().reduceCount(function(d) {
    console.log(d);
    return 1;
  });
  console.log(BarGroup);
var type = ['1s', '3s', '5s', 'Slow', 'Error'];
chart
    .width(768)
    .height(480)    
    .brushOn(false)
    .yAxisLabel("This is the Y Axis!")
    .dimension(typeDim)
    .group(BarGroup)
    .x(d3.scale.ordinal().domain(['1s', '3s', '5s', 'Slow', 'Error']))
    .on('renderlet', function(chart) {
        chart.selectAll('rect').on("click", function(d) {
            console.log("click!", d);
        });
    });
    chart.render();

}