  function report(){

  d3.json("/reports/restapi/getReportRawData", function(err, data){
  if(err) throw error;

  var numberFormat = d3.format('.2f');

// TODO :  날짜 자동 계산
   var minDate = new Date(2016,11,08);
  var maxDate = new Date(2016,11,14,24,0,0); 
  var yesDate = new Date(2016,11,14);
  var eventName = ["POWER", "ALS", "VIBRATION", "NOISE", "GPS", "STREET LIGHT", "REBOOT"];
  var eventCnt = [0,0,0,0,0,0,0];
  var weekCnt = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
  var color = ["#EDC951", "#CC333F", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399"];
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var vib = [];

  var index = 0;
// Data Setting
  data.rtnData.forEach(function(d){
    var a = d.event_time.split(" ");
    var b = a[0].split("-");
    var t = a[1].split(":");
    d.dd = new Date(b[0], (b[1]-1), b[2], t[0], t[1], [2]);
    d.today = d3.time.day(d.dd);
    d.month = d3.time.month(d.dd);
    d.hour = d3.time.hour(d.dd);
        var event = '';
    switch(d.event_type){
      case "1" :   // 피워
        d.index = 0;
        event = 'POWER';
        break;
      case "17" :   // 조도
        d.index = 1;
        event = 'ALS';
        break;
      case "33" :     // 진동
        d.index = 2;
        d.vibration_x = parseFloat(d.vibration_x);
        d.vibration_y = parseFloat(d.vibration_y);
        d.vibration_z =  parseFloat(d.vibration_z);
        d.vibration = (d.vibration_x+d.vibration_y+d.vibration_z)/3;
        event = 'VIBRATION';
        vib[index++] = [d.vibration_x, d.vibration_y, d.vibration_z, d.vibration];
        break;
      case "49" :    // 노이즈
        d.index = 3;
        event = 'NOISE';
        break;
      case "65" :    // GPS
        d.index = 4;
        event = 'GPS';
        break;
      case "81" :     // 센서상태
        d.index = 5;
        event = 'STREET LIGHT';
        break;
      case "153" :    // 재부팅
        d.index = 6;
        event = 'REBOOT';
        break;
    }
    ++weekCnt[d.dd.getDay()][d.index];
    ++eventCnt[d.index];
    d.active_power  =  parseFloat(d.active_power);
    d.als_level = parseInt(d.als_level);
    d.status_power_meter = parseInt(d.status_power_meter);
    d.noise_decibel= parseInt(d.noise_decibel);
    d.noise_frequency = parseInt(d.noise_frequency);
    d.event_name= event;    
  });

/*  for(var i=0; i < vib.length; i++){
    console.log(vib[i][3]);
  }*/

/*  http://d3pie.org  */
var pie = new d3pie("pieChart", {
  "header": {
    "title": {
      "text": "Event Count Pie",
      "color" : "#ffffff",
      "fontSize": 24,
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
    "canvasWidth": 590,
    "pieOuterRadius": "90%"
  },
  "data": {
    "sortOrder": "value-desc",
    "content":  [
          {            "label": eventName[0],            "value": eventCnt[0],            "color": color[0]            },
          {            "label": eventName[1],            "value": eventCnt[1],            "color": color[1]            },
          {            "label": eventName[2],            "value": eventCnt[2],            "color": color[2]            },
          {            "label": eventName[3],            "value": eventCnt[3],            "color": color[3]            },
          {            "label": eventName[4],            "value": eventCnt[4],            "color": color[4]            },
          {            "label": eventName[5],            "value": eventCnt[5],            "color": color[5]            },            
          {            "label": eventName[6],            "value": eventCnt[6],            "color": color[6]            }        ]
   },
  "labels": {
    "outer": {
      "pieDistance": 32
    },
    "inner": {
      "hideWhenLessThanPercentage": 3
    },
    "mainLabel": {
      "color" : "#ffffff",
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
 var cntData=[
          {            "label": eventName[0],            "value": eventCnt[0],            "color": color[0]            },
          {            "label": eventName[1],            "value": eventCnt[1],            "color": color[1]            },
          {            "label": eventName[2],            "value": eventCnt[2],            "color": color[2]            },
          {            "label": eventName[3],            "value": eventCnt[3],            "color": color[3]            },
          {            "label": eventName[4],            "value": eventCnt[4],            "color": color[4]            },
          {            "label": eventName[5],            "value": eventCnt[5],            "color": color[5]            },            
          {            "label": eventName[6],            "value": eventCnt[6],            "color": color[6]            }    
];

var svg = d3.select("pie3D").append("svg").attr("width",700).attr("height",300);
  svg.append("g").attr("id","salesDonut");
  svg.append("g").attr("id","quotesDonut");
  Donut3D.draw("salesDonut", randomData(), 150, 150, 130, 100, 30, 0.4);
  Donut3D.draw("quotesDonut", randomData(), 450, 150, 130, 100, 30, 0);
  function changeData(){
    Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
    Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
  }
  function randomData(){        
    return cntData.map(function(d){
      return {label:d.label, value:d.value , color:d.color};});
    }


  var gauges = [];      
  initialize();
  function createGauge(name, label, min, max)
  {
    var config = 
    {
      size: 170,
      label: label,
      min: undefined != min ? min : 0,
      max: undefined != max ? max : 250,
      minorTicks: 5
    }
    
    var range = config.max - config.min;
    config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
    config.redZones = [{ from: config.min + range*0.9, to: config.max }];
    
    gauges[name] = new Gauge(name + "GaugeContainer", config);
    gauges[name].render();
  }
  
  function createGauges()
  {
    createGauge("vibX", "Vibration_X");
    createGauge("vibY", "Vibration_Y");
    createGauge("vibZ", "Vibration_Z");
    createGauge("vib", "Vibration");
    //createGauge("test", "Test", -50, 50 );    
  }
  
  var cnt = 0;
  function updateGauges()
  {
    var a = 0;
    for (var key in gauges) {
      var value = vib[cnt][a++];
      gauges[key].redraw(value);
    }
    cnt ++;
  }
  
  function getRandomValue(gauge)
  {
    var overflow = 0; //10;
    return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
  }
  
  function initialize()
  {
    createGauges();
    setInterval(updateGauges, 1000);
  }



  




/* Radar Chart */
        var raData = [
                  [//iPhone
                  {axis:"Battery Life",value:0.22},
                  {axis:"Brand",value:0.28},
                  {axis:"Contract Cost",value:0.29},
                  {axis:"Design And Quality",value:0.17},
                  {axis:"Have Internet Connectivity",value:0.22},
                  {axis:"Large Screen",value:0.02},
                  {axis:"Price Of Device",value:0.21},
                  {axis:"To Be A Smartphone",value:0.50}
                  ],[//Samsung
                  {axis:"Battery Life",value:0.27},
                  {axis:"Brand",value:0.16},
                  {axis:"Contract Cost",value:0.35},
                  {axis:"Design And Quality",value:0.13},
                  {axis:"Have Internet Connectivity",value:0.20},
                  {axis:"Large Screen",value:0.13},
                  {axis:"Price Of Device",value:0.35},
                  {axis:"To Be A Smartphone",value:0.38}
                  ],[//Nokia Smartphone
                  {axis:"Battery Life",value:0.26},
                  {axis:"Brand",value:0.10},
                  {axis:"Contract Cost",value:0.30},
                  {axis:"Design And Quality",value:0.14},
                  {axis:"Have Internet Connectivity",value:0.22},
                  {axis:"Large Screen",value:0.04},
                  {axis:"Price Of Device",value:0.41},
                  {axis:"To Be A Smartphone",value:0.30}
                  ]
                  ];
  function RadarChart(id, data, options) {
    var margin = {top: 100, right: 100, bottom: 100, left: 100},
      width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
      height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

  var cfg = {
   w: 600,        //Width of the circle
   h: 600,        //Height of the circle
   margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
   levels: 3,       //How many levels or inner circles should there be drawn
   maxValue: 0,       //What is the value that the biggest circle will represent
   labelFactor: 1.25,   //How much farther than the radius of the outer circle should the labels be placed
   wrapWidth: 60,     //The number of pixels after which a label needs to be given a new line
   opacityArea: 0.35,   //The opacity of the area of the blob
   dotRadius: 4,      //The size of the colored circles of each blog
   opacityCircles: 0.1,   //The opacity of the circles of each blob
   strokeWidth: 2,    //The width of the stroke around each blob
   roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
   color: d3.scale.category10() //Color function
  };
  //Put all of the options into a variable called cfg
  if('undefined' !== typeof options){
    for(var i in options){
    if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
    }//for i
  }//if

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

  var allAxis = (data[0].map(function(i, j){return i.axis})), //Names of each axis
    total = allAxis.length,         //The number of different axes
    radius = Math.min(cfg.w/2, cfg.h/2),  //Radius of the outermost circle
    Format = d3.format('%'),        //Percentage formatting
    angleSlice = Math.PI * 2 / total;   //The width in radians of each "slice"

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
      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar"+id);
  //Append a g element
  var g = svg.append("g")
      .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

  /////////////////////////////////////////////////////////
  ////////// Glow filter for some extra pizzazz ///////////
  /////////////////////////////////////////////////////////

  //Filter for the outside glow
  var filter = g.append('defs').append('filter').attr('id','glow'),
    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

  /////////////////////////////////////////////////////////
  /////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////

  //Wrapper for the grid & axes
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid.selectAll(".levels")
     .data(d3.range(1,(cfg.levels+1)).reverse())
     .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function(d, i){return radius/cfg.levels*d;})
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter" , "url(#glow)");

  //Text indicating at what % each level is
  axisGrid.selectAll(".axisLabel")
     .data(d3.range(1,(cfg.levels+1)).reverse())
     .enter().append("text")
     .attr("class", "axisLabel")
     .attr("x", 4)
     .attr("y", function(d){return -d*radius/cfg.levels;})
     .attr("dy", "0.4em")
     .style("font-size", "10px")
     .attr("fill", "#737373")
     .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

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
    .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
    .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  //Append the labels at each axis
  axis.append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
    .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
    .text(function(d){return d})
    .call(wrap, cfg.wrapWidth);

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  var radarLine = d3.svg.line.radial()
    .interpolate("linear-closed")
    .radius(function(d) { return rScale(d.value); })
    .angle(function(d,i) {  return i*angleSlice; });

  if(cfg.roundStrokes) {
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
    .attr("d", function(d,i) { return radarLine(d); })
    .style("fill", function(d,i) { return cfg.color(i); })
    .style("fill-opacity", cfg.opacityArea)
    .on('mouseover', function (d,i){
      //Dim all blobs
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", 0.1);
      //Bring back the hovered over blob
      d3.select(this)
        .transition().duration(200)
        .style("fill-opacity", 0.7);
    })
    .on('mouseout', function(){
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  //Create the outlines
  blobWrapper.append("path")
    .attr("class", "radarStroke")
    .attr("d", function(d,i) { return radarLine(d); })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function(d,i) { return cfg.color(i); })
    .style("fill", "none")
    .style("filter" , "url(#glow)");

  //Append the circles
  blobWrapper.selectAll(".radarCircle")
    .data(function(d,i) { return d; })
    .enter().append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
    .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
    .style("fill", function(d,i,j) { return cfg.color(j); })
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
    .data(function(d,i) { return d; })
    .enter().append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius*1.5)
    .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
    .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function(d,i) {
      newX =  parseFloat(d3.select(this).attr('cx')) - 10;
      newY =  parseFloat(d3.select(this).attr('cy')) - 10;

      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(Format(d.value))
        .transition().duration(200)
        .style('opacity', 1);
    })
    .on("mouseout", function(){
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
  }//wrap

}//RadarChart

      //////////////////////////////////////////////////////////////
      //////////////////////// Set-Up //////////////////////////////
      //////////////////////////////////////////////////////////////
      var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

      //////////////////////////////////////////////////////////////
      ////////////////////////// Data //////////////////////////////
      //////////////////////////////////////////////////////////////
      var data = [
            [//iPhone
            {axis:"Battery Life",value:0.22},
            {axis:"Brand",value:0.28},
            {axis:"Contract Cost",value:0.29},
            {axis:"Design And Quality",value:0.17},
            {axis:"Have Internet Connectivity",value:0.22},
            {axis:"Large Screen",value:0.02},
            {axis:"Price Of Device",value:0.21},
            {axis:"To Be A Smartphone",value:0.50}
            ],[//Samsung
            {axis:"Battery Life",value:0.27},
            {axis:"Brand",value:0.16},
            {axis:"Contract Cost",value:0.35},
            {axis:"Design And Quality",value:0.13},
            {axis:"Have Internet Connectivity",value:0.20},
            {axis:"Large Screen",value:0.13},
            {axis:"Price Of Device",value:0.35},
            {axis:"To Be A Smartphone",value:0.38}
            ],[//Nokia Smartphone
            {axis:"Battery Life",value:0.26},
            {axis:"Brand",value:0.10},
            {axis:"Contract Cost",value:0.30},
            {axis:"Design And Quality",value:0.14},
            {axis:"Have Internet Connectivity",value:0.22},
            {axis:"Large Screen",value:0.04},
            {axis:"Price Of Device",value:0.41},
            {axis:"To Be A Smartphone",value:0.30}
            ]
          ];
      //////////////////////////////////////////////////////////////
      //////////////////// Draw the Chart //////////////////////////
      //////////////////////////////////////////////////////////////
      var color = d3.scale.ordinal()
        .range(["#EDC951","#CC333F","#00A0B0"]);

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
   
});

}