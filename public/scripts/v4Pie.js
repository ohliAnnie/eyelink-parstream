/**
 * http://usejsdoc.org/
 */
d3.json("/reports/piechart", function(err, data){

  // console.log(data);

  if (err) throw error;
var canvas = document.querySelector("canvas"),
      context = canvas.getContext("3d");


  var width = canvas.width,
  height = canvas.height,
  radius = Math.min(width, height) / 2;

  // var color = d3.scale.category10();  // v3용  D3.js가 준비한 표준 10색을 지정
  //var color = d3.scaleOrdinal(d3.schemeCategory10);
  var color = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
  // var arc = d3.svg.arc()
  //   .outerRadius(radius - 10)
  //   .innerRadius(0);
  // var labelArc = d3.svg.arc()
  //   .outerRadius(radius - 40)
  //   .innerRadius(radius - 40);

  var arc = pie(data);

arc.forEach(function(d, i){
  context.begintPath();
  arc(d);
  context.fillStyle = colors[i];
  context.fill();
});

  context.beginPath();
  arcs.forEach(arc);
   context.strokeStyle = "#fff";
  context.stroke();

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#000";
  arcs.forEach(function(d) {
    var c = labelArc.centroid(d);
    context.fillText(d.data.vendor, c[0], c[1]);
    });
});
  