$(document).ready(function() {               
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().subtract(3, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));      
  drawChart();
  $('#btn_search').click(function() {          
    drawChart();
  });
});     

function drawChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();  
  var data = { sdate : sdate, edate :edate };
  var in_data = { url : "/reports/restapi/getRangeData", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;              
      drawAll(data, sdate, edate);
    } 
  });
}

function drawAll(data, sdate, edate) {  

  var numberFormat = d3.format('.2f');

              // TODO :  날짜 자동 계산
              
              var eventName = ["POWER", "ALS", "VIBRATION", "NOISE", "GPS", "STREET LIGHT","DL", "REBOOT"];
              var eventCnt = [0, 0, 0, 0, 0, 0, 0, 0];
              var weekCnt = [
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0]
              ];
              var color = ["#EDC951", "#CC333F", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399"];
              var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              var vib = [];
              var maxData = new Array();
              for(var i=0; i<eventName.length; i++)
                maxData[i] = [0,0,0,0,0,0,0];
              var index = 0;
    // Data Setting
    data.forEach(function(d) {
      d.event_time = new Date(d.event_time);
      d.today = d3.time.day(d.event_time);
      d.month = d3.time.month(d.event_time);
      d.hour = d3.time.hour(d.event_time);
      switch (d.event_type) {
        case "1": // 피워                   
        maxData[d.index][d.event_time.getDay()] = maxData[d.index][d.event_time.getDay()] < d.active_power ? Math.round(d.active_power) : maxData[d.index][d.event_time.getDay()];
        break;
        case "17": // 조도                          
        maxData[d.index][d.event_time.getDay()] = maxData[d.index][d.event_time.getDay()] < d.als_level ? Math.round(d.als_level) : maxData[d.index][d.event_time.getDay()];
        break;
        case "33": // 진동                          
        vib[index++] = [d.vibration_x, d.vibration_y, d.vibration_z, d.vibration];
        maxData[d.index][d.event_time.getDay()] = maxData[d.index][d.event_time.getDay()] < d.vibration ? Math.round(d.vibration) : maxData[d.index][d.event_time.getDay()];
        break;
        case "49": // 노이즈
        maxData[d.index][d.event_time.getDay()] = maxData[d.index][d.event_time.getDay()] < d.noise_decibel ? Math.round(d.noise_decibel) : maxData[d.index][d.event_time.getDay()];
        break;
        case "65": // GPS
        maxData[d.index][d.event_time.getDay()] = 0;
        break;
        case "81": // 센서상태
        maxData[d.index][d.event_time.getDay()] = maxData[d.index][d.event_time.getDay()] < d.status_power_meter ? Math.round(d.status_power_meter) : maxData[d.index][d.event_time.getDay()];
        break;
        case "153": // 재부팅          
        maxData[d.index][d.event_time.getDay()] = 0;
        break;
      }
      ++weekCnt[d.event_time.getDay()][d.index];
      ++eventCnt[d.index];
    });
    
    /*  http://d3pie.org  */
    var pie = new d3pie("pieChart", {
      "header": {
        "title": {
          "text": "Event Count Pie",
          "color": "#ffffff",
          "fontSize": 20,
          "font": "open sans"
        },
        "subtitle": {
          "text": "A full pie chart to show off label collision detection and resolution.",
          "color": "#999999",
          "fontSize": 12,
          "font": "open sans"
        },
        "titleSubtitlePadding": 9
      },
      "footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
        "location": "bottom-left"
      },
      "size": {
        "canvasWidth": 500,
        "pieOuterRadius": "70%"
      },
      "data": {
        "sortOrder": "value-desc",
        "content": [
        { "State": eventName[0], "": eventCnt[0], "color": color[0] },
        { "label": eventName[1], "value": eventCnt[1], "color": color[1] },
        { "label": eventName[2], "value": eventCnt[2], "color": color[2] },
        { "label": eventName[3], "value": eventCnt[3], "color": color[3] },
        { "label": eventName[4], "value": eventCnt[4], "color": color[4] },
        { "label": eventName[5], "value": eventCnt[5], "color": color[5] },
        { "label": eventName[6], "value": eventCnt[6], "color": color[6] }
        ]
      },
      "labels": {
        "outer": {
          "pieDistance": 32
        },
        "inner": {
          "hideWhenLessThanPercentage": 3
        },
        "mainLabel": {
          "color": "#ffffff",
          "fontSize": 11
        },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 0
        },
        "value": {
          "color": "#ffffff",
          "fontSize": 11
        },
        "lines": {
          "enabled": true
        },
        "truncation": {
          "enabled": true
        }
      },
      "effects": {
        "pullOutSegmentOnClick": {
          "effect": "linear",
          "speed": 400,
          "size": 8
        }
      },
      "misc": {
        "gradient": {
          "enabled": true,
          "percentage": 100
        }
      }
    });

    /*  http://bl.ocks.org/NPashaP/9994181  */
    // TODO : changeData
    var cntData = [
    { "label": eventName[0], "value": eventCnt[0], "color": color[0] },
    { "label": eventName[1], "value": eventCnt[1], "color": color[1] },
    { "label": eventName[2], "value": eventCnt[2], "color": color[2] },
    { "label": eventName[3], "value": eventCnt[3], "color": color[3] },
    { "label": eventName[4], "value": eventCnt[4], "color": color[4] },
    { "label": eventName[5], "value": eventCnt[5], "color": color[5] },
    { "label": eventName[6], "value": eventCnt[6], "color": color[6] }
    ];

    var svg = d3.select("pie3D").append("svg").attr("width", 700).attr("height", 323);
    svg.append("g").attr("id", "salesDonut");
    svg.append("g").attr("id", "quotesDonut");
    Donut3D.draw("salesDonut", randomData(), 150, 150, 130, 100, 30, 0.4);
    Donut3D.draw("quotesDonut", randomData(), 450, 150, 130, 100, 30, 0);

    function changeData() {
      Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
      Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
    }

    function randomData() {
      return cntData.map(function(d) {
        return { label: d.label, value: d.value, color: d.color };
      });
    }

    var legend = d3.select("pie3D").append("svg")
    .attr("class", "legend")
    .attr("width", 200)
    .attr("height", 150)
    .selectAll("g")
    .data(cntData)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) { return d.color; });

    legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function(d) { return d.label + '  :  ' + d.value; });



    var gauges = [];
    initialize();

    function createGauge(name, label, min, max) {
      var config = {
        size: 170,
        label: label,
        min: undefined != min ? min : 0,
        max: undefined != max ? max : 250,
        minorTicks: 5
      }

      var range = config.max - config.min;
      config.yellowZones = [{ from: config.min + range * 0.75, to: config.min + range * 0.9 }];
      config.redZones = [{ from: config.min + range * 0.9, to: config.max }];

      gauges[name] = new Gauge(name + "GaugeContainer", config);
      gauges[name].render();
    }

    function createGauges() {
      createGauge("vibX", "Vibration_X");
      createGauge("vibY", "Vibration_Y");
      createGauge("vibZ", "Vibration_Z");
      createGauge("vib", "Vibration");
                  //createGauge("test", "Test", -50, 50 );    
                }

                var cnt = 0;

                function updateGauges() {
                  var a = 0;
                  for (var key in gauges) {
                    var value = vib[cnt][a++];
                    gauges[key].redraw(value);
                  }
                  cnt++;
                }

                function getRandomValue(gauge) {
  var overflow = 0; //10;
  return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow * 2) * Math.random();
}

function initialize() {
  createGauges();
  setInterval(updateGauges, 1000);
}

/*  http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6  */
var sum = 0;
for (var i = 0; i < eventCnt.length; i++)
  sum += eventCnt[i];
var gauge1 = loadLiquidFillGauge("fillgauge1", (sum/eventCnt.length) / sum * 100);
var config1 = liquidFillGaugeDefaultSettings();
config1.circleColor = "#FF7777";
config1.textColor = "#FF4444";
config1.waveTextColor = "#FFAAAA";
config1.waveColor = "#FFDDDD";
config1.circleThickness = 0.2;
config1.textVertPosition = 0.2;
config1.waveAnimateTime = 1000;
var gauge2 = loadLiquidFillGauge("fillgauge2", eventCnt[0] / sum * 100, config1);
var config2 = liquidFillGaugeDefaultSettings();
config2.circleColor = "#D4AB6A";
config2.textColor = "#553300";
config2.waveTextColor = "#805615";
config2.waveColor = "#AA7D39";
config2.circleThickness = 0.1;
config2.circleFillGap = 0.2;
config2.textVertPosition = 0.8;
config2.waveAnimateTime = 2000;
config2.waveHeight = 0.3;
config2.waveCount = 1;
var gauge3 = loadLiquidFillGauge("fillgauge3", eventCnt[1] / sum * 100, config2);
var config3 = liquidFillGaugeDefaultSettings();
config3.textVertPosition = 0.8;
config3.waveAnimateTime = 5000;
config3.waveHeight = 0.15;
config3.waveAnimate = false;
config3.waveOffset = 0.25;
config3.valueCountUp = false;
config3.displayPercent = false;
var gauge4 = loadLiquidFillGauge("fillgauge4", eventCnt[2] / sum * 100, config3);
var config4 = liquidFillGaugeDefaultSettings();
config4.circleThickness = 0.15;
config4.circleColor = "#808015";
config4.textColor = "#555500";
config4.waveTextColor = "#FFFFAA";
config4.waveColor = "#AAAA39";
config4.textVertPosition = 0.8;
config4.waveAnimateTime = 1000;
config4.waveHeight = 0.05;
config4.waveAnimate = true;
config4.waveRise = false;
config4.waveHeightScaling = false;
config4.waveOffset = 0.25;
config4.textSize = 0.75;
config4.waveCount = 3;
var gauge5 = loadLiquidFillGauge("fillgauge5", eventCnt[3] / sum * 100, config4);
var config5 = liquidFillGaugeDefaultSettings();
config5.circleThickness = 0.4;
config5.circleColor = "#6DA398";
config5.textColor = "#0E5144";
config5.waveTextColor = "#6DA398";
config5.waveColor = "#246D5F";
config5.textVertPosition = 0.52;
config5.waveAnimateTime = 5000;
config5.waveHeight = 0;
config5.waveAnimate = false;
config5.waveCount = 2;
config5.waveOffset = 0.25;
config5.textSize = 1.2;
config5.minValue = 30;
config5.maxValue = 150
config5.displayPercent = false;
var gauge6 = loadLiquidFillGauge("fillgauge6", eventCnt[5] / sum * 100, config5);

function NewValue() {
  if (Math.random() > .5) {
    return Math.round(Math.random() * 100);
  } else {
    return (Math.random() * 100).toFixed(1);
  }
} 
/*  http://bl.ocks.org/mbostock/3887051  */
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
width = window.innerWidth*0.4- margin.left - margin.right,
height = (window.innerWidth*0.4)*0.5 - margin.top - margin.bottom;
var x0 = d3.scale.ordinal()
.rangeRoundBands([0, width], .1);
var x1 = d3.scale.ordinal();
var y = d3.scale.linear()
.range([height, 0]);
var color = d3.scale.ordinal()
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
var xAxis = d3.svg.axis()
.scale(x0)
.orient("bottom");
var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickFormat(d3.format(".2s"));
var svg = d3.select("groupBar").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var maxJson = [
{ "State": eventName[0], "Sun": maxData[0][0], "Mon": maxData[0][1], "Tue": maxData[0][2], "Wed": maxData[0][3], "Thu": maxData[0][4], "Fri": maxData[0][5], "Sat": maxData[0][6] },
{ "State": eventName[1], "Sun": maxData[1][0], "Mon": maxData[1][1], "Tue": maxData[1][2], "Wed": maxData[1][3], "Thu": maxData[1][4], "Fri": maxData[1][5], "Sat": maxData[1][6] },
{ "State": eventName[2], "Sun": maxData[2][0], "Mon": maxData[2][1], "Tue": maxData[2][2], "Wed": maxData[2][3], "Thu": maxData[2][4], "Fri": maxData[2][5], "Sat": maxData[2][6] },
{ "State": eventName[3], "Sun": maxData[3][0], "Mon": maxData[3][1], "Tue": maxData[3][2], "Wed": maxData[3][3], "Thu": maxData[3][4], "Fri": maxData[3][5], "Sat": maxData[3][6] },
{ "State": eventName[4], "Sun": maxData[4][0], "Mon": maxData[4][1], "Tue": maxData[4][2], "Wed": maxData[4][3], "Thu": maxData[4][4], "Fri": maxData[4][5], "Sat": maxData[4][6] },
{ "State": eventName[5], "Sun": maxData[5][0], "Mon": maxData[5][1], "Tue": maxData[5][2], "Wed": maxData[5][3], "Thu": maxData[5][4], "Fri": maxData[5][5], "Sat": maxData[5][6] },
{ "State": eventName[6], "Sun": maxData[6][0], "Mon": maxData[6][1], "Tue": maxData[6][2], "Wed": maxData[6][3], "Thu": maxData[6][4], "Fri": maxData[6][5], "Sat": maxData[6][6] } ];

gBar(maxJson);

function gBar(data) {  
  var ageNames = d3.keys(data[0]).filter(function(key) {
    return key !== "State"; });

  data.forEach(function(d) {
    d.ages = ageNames.map(function(name) {
      return { name: name, value: +d[name] }; });
  });

  x0.domain(data.map(function(d) {
    return d.State; }));
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) {
    return d3.max(d.ages, function(d) {
      return d.value; }); })]);

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")                          
  .attr("outerTickSize",0)
  .call(xAxis);

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Max Value");

  var state = svg.selectAll(".state")
  .data(data)
  .enter().append("g")
  .attr("class", "state")
  .attr("transform", function(d) {
    return "translate(" + x0(d.State) + ",0)"; });

  state.selectAll("rect")
  .data(function(d) {
    return d.ages; })
  .enter().append("rect")
  .attr("width", x1.rangeBand())
  .attr("x", function(d) {
    return x1(d.name); })
  .attr("y", function(d) {
    return y(d.value); })
  .attr("height", function(d) {
    return height - y(d.value); })
  .style("fill", function(d) {
    return color(d.name); });

  var legend = svg.selectAll(".legend")
  .data(ageNames.slice().reverse())
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) {
    return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", color);

  legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) {
    return d; });

};


var gIndex = 0;
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = window.innerWidth*0.4- margin.left - margin.right,
  height = (window.innerWidth*0.4)*0.5 - margin.top - margin.bottom;
var x0 = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);
var x1 = d3.scale.ordinal();
var y = d3.scale.linear()
  .range([height, 0]);
var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
  .range(colorRange.range());
var xAxis = d3.svg.axis()
  .scale(x0)
  .orient("bottom");
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(d3.format(".2s"));
var divTooltip = d3.select("body").append("div").attr("class", "toolTip");
var svg = d3.select("groupTip").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
dataset = [
{label: week[gIndex], "POWER":maxData[0][gIndex],  "ALS":maxData[1][gIndex], "VIBRATION":maxData[2][gIndex], "NOISE":maxData[3][gIndex], "GPS":maxData[4][gIndex], "STREET LIGHT":maxData[5][gIndex], "REBOOT":maxData[6][gIndex++]},
{label: week[gIndex], "POWER":maxData[0][gIndex],  "ALS":maxData[1][gIndex], "VIBRATION":maxData[2][gIndex], "NOISE":maxData[3][gIndex], "GPS":maxData[4][gIndex], "STREET LIGHT":maxData[5][gIndex], "REBOOT":maxData[6][gIndex++]},
{label: week[gIndex], "POWER":maxData[0][gIndex],  "ALS":maxData[1][gIndex], "VIBRATION":maxData[2][gIndex], "NOISE":maxData[3][gIndex], "GPS":maxData[4][gIndex], "STREET LIGHT":maxData[5][gIndex], "REBOOT":maxData[6][gIndex++]},
{label: week[gIndex], "POWER":maxData[0][gIndex],  "ALS":maxData[1][gIndex], "VIBRATION":maxData[2][gIndex], "NOISE":maxData[3][gIndex], "GPS":maxData[4][gIndex], "STREET LIGHT":maxData[5][gIndex], "REBOOT":maxData[6][gIndex++]},
{label: week[gIndex], "POWER":maxData[0][gIndex],  "ALS":maxData[1][gIndex], "VIBRATION":maxData[2][gIndex], "NOISE":maxData[3][gIndex], "GPS":maxData[4][gIndex], "STREET LIGHT":maxData[5][gIndex], "REBOOT":maxData[6][gIndex++]},
{label: week[gIndex], "POWER":maxData[0][gIndex],  "ALS":maxData[1][gIndex], "VIBRATION":maxData[2][gIndex], "NOISE":maxData[3][gIndex], "GPS":maxData[4][gIndex], "STREET LIGHT":maxData[5][gIndex], "REBOOT":maxData[6][gIndex++]},
{label: week[gIndex], "POWER":maxData[0][gIndex],  "ALS":maxData[1][gIndex], "VIBRATION":maxData[2][gIndex], "NOISE":maxData[3][gIndex], "GPS":maxData[4][gIndex], "STREET LIGHT":maxData[5][gIndex], "REBOOT":maxData[6][gIndex++]},
];
var options = d3.keys(dataset[0]).filter(function(key) { return key !== "label"; });
dataset.forEach(function(d) {
  d.valores = options.map(function(name) { return {name: name, value: +d[name]}; });
});
x0.domain(dataset.map(function(d) { return d.label; }));
x1.domain(options).rangeRoundBands([0, x0.rangeBand()]);
y.domain([0, d3.max(dataset, function(d) { return d3.max(d.valores, function(d) { return d.value; }); })]);
svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);
svg.append("g")
.attr("class", "y axis")
.call(yAxis)
.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", ".71em")
.style("text-anchor", "end")
.text("Event Count");
var bar = svg.selectAll(".bar")
.data(dataset)
.enter().append("g")
.attr("class", "rect")
.attr("transform", function(d) { return "translate(" + x0(d.label) + ",0)"; });
bar.selectAll("rect")
.data(function(d) { return d.valores; })
.enter().append("rect")
.attr("width", x1.rangeBand())
.attr("x", function(d) { return x1(d.name); })
.attr("y", function(d) { return y(d.value); })
.attr("value", function(d){return d.name;})
.attr("height", function(d) { return height - y(d.value); })
.style("fill", function(d) { return color(d.name); });
bar
.on("mousemove", function(d){
  divTooltip.style("left", d3.event.pageX+10+"px");
  divTooltip.style("top", d3.event.pageY-25+"px");
  divTooltip.style("display", "inline-block");
  var x = d3.event.pageX, y = d3.event.pageY
  var elements = document.querySelectorAll(':hover');
  l = elements.length
  l = l-1
  elementData = elements[l].__data__
  divTooltip.html((d.label)+"<br>"+elementData.name+"<br>"+elementData.value);
});
bar
.on("mouseout", function(d){
  divTooltip.style("display", "none");
});
var legend = svg.selectAll(".legend")
.data(options.slice())
.enter().append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
legend.append("rect")
.attr("x", width - 18)
.attr("width", 18)
.attr("height", 18)
.style("fill", color);
legend.append("text")
.attr("x", width - 24)
.attr("y", 9)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text(function(d) { return d; });




/* Radar Chart */

function RadarChart(id, data, options) {
  var cfg = {
          w: width*0.5, //Width of the circle
          h: width*0.5, //Height of the circle
          margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
          levels: 3, //How many levels or inner circles should there be drawn
          maxValue: 0, //What is the value that the biggest circle will represent
          labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
          wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
          opacityArea: 0.35, //The opacity of the area of the blob
          dotRadius: 4, //The size of the colored circles of each blog
          opacityCircles: 0.1, //The opacity of the circles of each blob
          strokeWidth: 2, //The width of the stroke around each blob
          roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
          color: d3.scale.category10() //Color function
        };
      //Put all of the options into a variable called cfg
      if ('undefined' !== typeof options) {
        for (var i in options) {
          if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
          } //for i
      } //if

      //If the supplied maxValue is smaller than the actual one, replace by the max in the data
      var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
        return d3.max(i.map(function(o) {
          return o.value; })) }));

      var allAxis = (data[0].map(function(i, j) {
              return i.axis })), //Names of each axis
          total = allAxis.length, //The number of different axes
          radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
          Format = d3.format('%'), //Percentage formatting
          angleSlice = Math.PI * 2 / total; //The width in radians of each "slice"

      //Scale for the radius
      var rScale = d3.scale.linear()
      .range([0, radius])
      .domain([0, maxValue]);

      /////////////////////////////////////////////////////////
      //////////// Create the container SVG and g /////////////
      /////////////////////////////////////////////////////////

      //Remove whatever chart with the same id/class was present before
      d3.select(id).select("svg").remove();

      //Initiate the radar chart SVG
      var svg = d3.select(id).append("svg")
      .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar" + id);
      //Append a g element
      var g = svg.append("g")
      .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

      /////////////////////////////////////////////////////////
      ////////// Glow filter for some extra pizzazz ///////////
      /////////////////////////////////////////////////////////

      //Filter for the outside glow
      var filter = g.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      /////////////////////////////////////////////////////////
      /////////////// Draw the Circular grid //////////////////
      /////////////////////////////////////////////////////////

      //Wrapper for the grid & axes
      var axisGrid = g.append("g").attr("class", "axisWrapper");

      //Draw the background circles
      axisGrid.selectAll(".levels")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", function(d, i) {
        return radius / cfg.levels * d; })
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", cfg.opacityCircles)
      .style("filter", "url(#glow)");

      //Text indicating at what % each level is
      axisGrid.selectAll(".axisLabel")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", function(d) {
        return -d * radius / cfg.levels; })
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text(function(d, i) {
        return Format(maxValue * d / cfg.levels); });

      /////////////////////////////////////////////////////////
      //////////////////// Draw the axes //////////////////////
      /////////////////////////////////////////////////////////

      //Create the straight lines radiating outward from the center
      var axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
      //Append the lines
      axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i) {
        return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y2", function(d, i) {
        return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

      //Append the labels at each axis
      axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function(d, i) {
        return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y", function(d, i) {
        return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
      .text(function(d) {
        return d })
      .call(wrap, cfg.wrapWidth);

      /////////////////////////////////////////////////////////
      ///////////// Draw the radar chart blobs ////////////////
      /////////////////////////////////////////////////////////

      //The radial line function
      var radarLine = d3.svg.line.radial()
      .interpolate("linear-closed")
      .radius(function(d) {
        return rScale(d.value); })
      .angle(function(d, i) {
        return i * angleSlice; });

      if (cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed");
      }

      //Create a wrapper for the blobs
      var blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

      //Append the backgrounds
      blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", function(d, i) {
        return radarLine(d); })
      .style("fill", function(d, i) {
        return cfg.color(i); })
      .style("fill-opacity", cfg.opacityArea)
      .on('mouseover', function(d, i) {
              //Dim all blobs
              d3.selectAll(".radarArea")
              .transition().duration(200)
              .style("fill-opacity", 0.1);
              //Bring back the hovered over blob
              d3.select(this)
              .transition().duration(200)
              .style("fill-opacity", 0.7);
            })
      .on('mouseout', function() {
              //Bring back all blobs
              d3.selectAll(".radarArea")
              .transition().duration(200)
              .style("fill-opacity", cfg.opacityArea);
            });

      //Create the outlines
      blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function(d, i) {
        return radarLine(d); })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", function(d, i) {
        return cfg.color(i); })
      .style("fill", "none")
      .style("filter", "url(#glow)");

      //Append the circles
      blobWrapper.selectAll(".radarCircle")
      .data(function(d, i) {
        return d; })
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", function(d, i) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("cy", function(d, i) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
      .style("fill", function(d, i, j) {
        return cfg.color(j); })
      .style("fill-opacity", 0.8);

      /////////////////////////////////////////////////////////
      //////// Append invisible circles for tooltip ///////////
      /////////////////////////////////////////////////////////

      //Wrapper for the invisible circles on top
      var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarCircleWrapper");

      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper.selectAll(".radarInvisibleCircle")
      .data(function(d, i) {
        return d; })
      .enter().append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", cfg.dotRadius * 1.5)
      .attr("cx", function(d, i) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("cy", function(d, i) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function(d, i) {
        newX = parseFloat(d3.select(this).attr('cx')) - 10;
        newY = parseFloat(d3.select(this).attr('cy')) - 10;

        tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(Format(d.value))
        .transition().duration(200)
        .style('opacity', 1);
      })
      .on("mouseout", function() {
        tooltip.transition().duration(200)
        .style("opacity", 0);
      });

      //Set up the small tooltip for when you hover over a circle
      var tooltip = g.append("text")
      .attr("class", "tooltip")
      .style("opacity", 0);

      /////////////////////////////////////////////////////////
      /////////////////// Helper Function /////////////////////
      /////////////////////////////////////////////////////////

      //Taken from http://bl.ocks.org/mbostock/7555321
      //Wraps SVG text
      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
                  lineHeight = 1.4, // ems
                  y = text.attr("y"),
                  x = text.attr("x"),
                  dy = parseFloat(text.attr("dy")),
                  tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

                  while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                      line.pop();
                      tspan.text(line.join(" "));
                      line = [word];
                      tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                  }
                });
      } //wrap

  } //RadarChart

  //////////////////////////////////////////////////////////////
  //////////////////////// Set-Up //////////////////////////////
  //////////////////////////////////////////////////////////////
  var margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = window.innerWidth*0.25- margin.left - margin.right,
  height = (window.innerWidth*0.25)*1.3 - margin.top - margin.bottom;

  //////////////////////////////////////////////////////////////
  ////////////////////////// Data //////////////////////////////
  //////////////////////////////////////////////////////////////                  
  var data = [
      [ //POWER
      { axis: week[0], value: maxData[0][0] },
      { axis: week[1], value: maxData[0][1] },
      { axis: week[2], value: maxData[0][2] },
      { axis: week[3], value: maxData[0][3] },
      { axis: week[4], value: maxData[0][4] },
      { axis: week[5], value: maxData[0][5] },
      { axis: week[6], value: maxData[0][6] },                                         ],
      [ //ALS
      { axis: week[0], value: maxData[1][0] },
      { axis: week[1], value: maxData[1][1] },
      { axis: week[2], value: maxData[1][2] },
      { axis: week[3], value: maxData[1][3] },
      { axis: week[4], value: maxData[1][4] },
      { axis: week[5], value: maxData[1][5] },
      { axis: week[6], value: maxData[1][6] }                                         ],
      [ //VIBRATION
      { axis: week[0], value: maxData[2][0] },
      { axis: week[1], value: maxData[2][1] },
      { axis: week[2], value: maxData[2][2] },
      { axis: week[3], value: maxData[2][3] },
      { axis: week[4], value: maxData[2][4] },
      { axis: week[5], value: maxData[2][5] },
      { axis: week[6], value: maxData[2][6] }                                         ],
      [ //NOISE
      { axis: week[0], value: maxData[3][0] },
      { axis: week[1], value: maxData[3][1] },
      { axis: week[2], value: maxData[3][2] },
      { axis: week[3], value: maxData[3][3] },
      { axis: week[4], value: maxData[3][4] },
      { axis: week[5], value: maxData[3][5] },
      { axis: week[6], value: maxData[3][6] }                                         ],                      
      ];
  //////////////////////////////////////////////////////////////
  //////////////////// Draw the Chart //////////////////////////
  //////////////////////////////////////////////////////////////
  var color = d3.scale.ordinal()
  .range(["#EDC951", "#CC333F", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399"]);

  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color
  };
  //Call function to draw the Radar chart
  RadarChart(".radarChart", data, radarChartOptions);

}