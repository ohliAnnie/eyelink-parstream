$(document).ready(function(e) {        
  getData();  
});

var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {
    return paramPair.split(/=(.+)?/).slice(0, 2);
  }).reduce(function(obj, pairArray) {
    obj[pairArray[0]] = pairArray[1];
    return obj;
  }, {});


function getData(){  
  var data = { date : urlParams.date, type : urlParams.type, cid : urlParams.cid, state : urlParams.state };
  var in_data = { url : "/dashboard/restapi/getDashboardInfo", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;       
      console.log(data);
      drawTable(data);
      dataTable(data);
    } 
  });
  var data = { date : urlParams.date, cid : urlParams.cid };
  var in_data = { url : "/dashboard/restapi/getDashboardInfoStatus", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;                
      console.log(data)
      drawLineChart(data);
    } 
  });  
}

var gage = '';
function getGaguChart(id, max, color, value, size) {  
  return new RadialProgressChart('.'+id, {
    diameter: 200,
    max: max,
    round: false,
    series: [
    {
      value: value*100,
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

function drawTable(data) {
  $('#gage').empty();
  var sbT = new StringBuffer();
  //var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';  
  var alarm = (data.state=='active')?'green':(data.state=='idle')?'blue':'red';
  var color = (data.overall_oee>=0.7)?'#6ABC64':(data.overall_oee>=0.5)?'#79ABFF':'#FF7E7E';  
  sbT.append('<table class="table table-striped table-bordered">');  
  sbT.append('<tr style="background-color:'+alarm+'"><td colspan="3" style="color:white; text-align:center;">');
  sbT.append('<strong style="font-size:20px;">'+data.flag+' '+data.cid+'</strong><br>'+data.state+'</td></tr>');    
  sbT.append('<tr><td colspan="3"><div class="gage" style="text-align:center;"></div></td></tr>');
  sbT.append('<tr style="background-color:'+color+'"><td style="text-align:center;">Ava<br>'+data.availability.toFixed(1));
  sbT.append('%</td><td style="text-align:center;">Perf<br>'+data.performance.toFixed(1)+'%</td>');
  sbT.append('<td style="text-align:center;">Qual<br>'+data.quality.toFixed(1)+'%</td></tr>');
  sbT.append('</table>');
  $('#gage').append(sbT.toString());
  gage = getGaguChart("gage", 100, 'green', data.overall_oee, 0.13);    
}
function dataTable(data){
  $('#data').empty();
  var sbD = new StringBuffer();
  sbD.append('<table class="table table-striped table-bordered">');  
  sbD.append('<tr style="background-color:#353535; color:white;"><td colspan="2" style="text-align:center;">');
  sbD.append(data.dtSensed+'</td></tr>');
  sbD.append('<tr><th>Machine ID</th><td>'+data.cid+'</td></tr>');
  sbD.append('<tr><th>Status</th><td>'+data.state+'</td></tr>');  
  sbD.append('<tr><th>OEE</th><td>'+(data.overall_oee*100).toFixed(1)+'%</td></tr>');
  sbD.append('<tr><th>Avaiability</th><td>'+data.availability.toFixed(1)+'%</td></tr>');
  sbD.append('<tr><th>Performance</th><td>'+data.performance.toFixed(1)+'%</td></tr>');
  sbD.append('<tr><th>Quality</th><td>'+data.quality.toFixed(1)+'%</td></tr>');
  sbD.append('<tr><th>Shift Length</th><td>'+(data.total_shift_length/60).toFixed(0)+'Min</td></tr>');
  sbD.append('<tr><th>Planned Break Time</th><td>'+Math.floor((data.total_meal_break+data.total_short_break)/60)+'Min</td></tr>');
  sbD.append('<tr><th>Down Time</th><td>'+Math.floor(data.total_down_time/60)+'Min</td></tr>');
  sbD.append('<tr><th>Planned Production Time</th><td>'+Math.floor(data.planned_production_time/60)+'Min</td></tr>');
  sbD.append('<tr><th>Ideal Run Rate</th><td>'+data.ideal_run_rate+'</td></tr>');
  sbD.append('<tr><th>Total Pieces</th><td>'+data.total_pieces+'</td></tr>');
  sbD.append('<tr><th>Good Pieces</th><td>'+data.total_accept_pieces+'</td></tr>');
  sbD.append('<tr><th>Reject Pieces</th><td>'+data.total_reject_pieces+'</td></tr>');
  sbD.append('</table>');
  $('#data').append(sbD.toString());
}

function drawLineChart(data) {
  var composite = dc.compositeChart("#composed");
  
  var ndx = crossfilter(data);

  var dim  = ndx.dimension(function(d){
    return new Date(d.measure_time);
  });

  var colorArray = ["Aqua","Aquamarine","Blue","BlueViolet","Brown","BurlyWood","CadetBlue",
                    "Chartreuse","Chocolate","Coral","Crimson","Cyan","Red","RosyBrown","RoyalBlue",
                    "DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki",
                    "DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon",
                    "DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise",
                    "DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue",
                    "ForestGreen","Gold","GoldenRod","Yellow","LightPink","LightSalmon","LightSeaGreen",
                    "Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo",
                    "Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue",
                    "LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen",
                    "LightSkyBlue","LightSlateGray","LightSlateGrey",
                    "LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine",
                    "MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen",
                    "MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin",
                    "Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen",
                    "PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue",
                    "Purple","SaddleBrown","Salmon","SandyBrown","SeaGreen",
                    "SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow",
                    "SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","YellowGreen"];

  var group = [], chart = [], cnt = 0, ccnt = 0;
  for(k in data[0]){        
    if(k=='measure_time'||k=='flag'||k=='cid'||k=='sensorType'||k=='type'){
    } else {      
      group[cnt] = makeGroup(dim, k);
      console.log(k);
      console.log(colorArray[ccnt]);

      chart[cnt] = dc.lineChart(composite)
          .dimension(dim)            
          .colors(colorArray[ccnt++])
          .renderDataPoints(true)
          .group(group[cnt++], k);
    }
  }
  console.log(chart)
  var minDate = new Date(data[0].measure_time);
  var maxDate = new Date(data[data.length-1].measure_time);

  composite.margins().bottom = 240;
  composite.margins().right = 35;
  composite
    .width(window.innerWidth*0.53)
    .height(550)
    .x(d3.time.scale().domain([minDate,maxDate]))
    //.round(d3.time.day.round)
    //.x(d3.scale.linear().domain([0,data.length-1]))             
    .y(d3.scale.linear().domain([0, 50]))    
    .legend(dc.legend().x(5).y(335).itemHeight(12).itemWidth(159).gap(6).horizontal(true))
    .renderHorizontalGridLines(true)
    .title(function(d){ return this.layer+' : '+d.value; })
    .compose(chart)
    .brushOn(false)
    .render();

  
}

function makeGroup(dim, key) {
  return dim.group().reduceSum(function(d){ return d[key];})
}