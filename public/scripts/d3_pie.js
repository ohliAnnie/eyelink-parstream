/**
 * http://usejsdoc.org/
 */
//  var data = {"vendor":["Bada", "BlackBerry"], "volume": [8, 15]};
d3.json("data.json", function(err, data){
  var data = [
       {
          "vender": "bada",
          "volume": 20
        },
       {
          "vender": "BlackBerry",
          "volume": 30
       },

  ];

    // if (error) throw error;

  alert("haha");

  var width = 550,
  height = 370,
  radius = Math.min(width, height) / 2;

  var color = d3.scale.category10();  // D3.js가 준비한 표준 10색을 지정

  var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.volume; });

  var svg = d3.select("#d3Pie").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var ele = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc")
        // 이벤트 추가
  	.on("mouseover", function(){
  			d3.select(this)
  				.style("stroke-width","7px")
  			})
  	.on("mouseout", function(){
  		d3.select(this)
  			.style("stroke-width","1px")
  		})
  	.on("click", function(d, i){
  			alert(d.data.volume);
  		});

  ele.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.vendor); });

  ele.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.vendor; });
});

function type(d) {
  d.volume = +d.volume;
  return d;
}