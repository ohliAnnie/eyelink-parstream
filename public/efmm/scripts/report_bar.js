$(document).ready(function() {               
  $('#date').val(moment().format(dateFormat)); 
  getData();  
  $('#btn_search').click(function() {            

    getData();    
  });
});

var dateFormat = 'YYYY-MM-DD';
var flag = '', cid = '';

function getData() {  
  var date = $('#date').val();  
  var machine = $('#machine').val().split('_');  
  flag = machine[0], cid = machine[1];
  var data = { date : date, flag : flag, cid : cid };
  var in_data = { url : "/reports/restapi/getData", type : "GET", data : data };  
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      console.log(result);
      d3.select("#bar").select("svg").remove();
      drawFactorChart(result.rtnData.factor);
      drawOeeChart(result.rtnData.oee);
    } 
  });
}

function drawOeeChart(data) {
  var chart = dc.pieChart("#oee");

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var nameDim = nyx.dimension(function(d){
    return d.name;
  });

  var vGroup = nameDim.group().reduceSum(function(d){ return d.value; });

  chart
      .width(window.innerWidth*0.48)
      .height(420)
      .radius(160)
      .slicesCap(4)
      .innerRadius(10)            
      .dimension(nameDim)
      .group(vGroup)
      .drawPaths(true)
      .legend(dc.legend().legendText(function(d) { console.log(d);return d.name+' : '+d.data.toFixed(2)+'%'; }))
      .colors(d3.scale.ordinal().range(['#04BBC2', '#1492FF', '#78B800', '#FF5F00']));

  chart.render();

}

function drawFactorChart(data){   
  var n = 2, // number of layers
      m = data.length, // number of samples per layer
      stack = d3.layout.stack(),
      labels = data.map(function(d) {return d.key;}),
      
      //go through each layer (pop1, pop2 etc, that's the range(n) part)
      //then go through each object in data and pull out that objects's population data
      //and put it into an array where x is the index and y is the number
      layers = stack(d3.range(n).map(function(d) { 
                  var a = [];
              for (var i = 0; i < m; ++i) {
                a[i] = {x: i, y: data[i]['pop' + (d+1)]};  
              }
            return a;
               })),
      
    //the largest single layer
      yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
      //the largest stack
      yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

  var margin = {top: 20, right: 10, bottom: 20, left: 10},
      width = window.innerWidth*0.4 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var y = d3.scale.ordinal()
      .domain(d3.range(m))
      .rangeRoundBands([2, height], .08);

  var x = d3.scale.linear()
      .domain([0, yStackMax])
      .range([0, width]);

  var color = d3.scale.linear()
      .domain([0, n - 1])
      .range(["#469840","#CC3D3D"]);

  var svg = d3.select("#bar").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var layer = svg.selectAll(".layer")
      .data(layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

  layer.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("y", function(d) { return y(d.x); })
      .attr("x", function(d) { return x(d.y0); })
      .attr("height", y.rangeBand()*0.6)
      .attr("width", function(d) { return x(d.y); });

  var label = svg.selectAll(".label")
      .data(data)
      .enter().append("g")
      .append("text")
      .text(function(d) { console.log(d);if(d.key2=='') { var label = d.key1+'('+d.pop1+')'; }
                          else { var label = d.key1+'('+d.pop1+')'+' / '+d.key2+'('+d.pop2+')'; }
                        return label; })
      .attr("x", 10)
      .attr("y", function(d, i) { return 70*(i+1)-8
        ; })
      .style("fill", 'black');

  var yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(1)
      .tickPadding(6)
      .tickValues(labels)
      .orient("left");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
}