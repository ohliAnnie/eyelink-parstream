$(document).ready(function(e) {      
  var dateFormat = 'YYYY-MM-DD';
  $('#sdate').val(moment().subtract(7, 'days').format(dateFormat));
  $('#edate').val(moment().format(dateFormat));
  var rawData = [
  { index : 0, date : moment().subtract(6, 'days').format(dateFormat), oee : 88, availability : 93, performance : 97, quality : 99},
  { index : 1, date : moment().subtract(5, 'days').format(dateFormat), oee : 76, availability : 90, performance : 84, quality : 99},
  { index : 2, date : moment().subtract(4, 'days').format(dateFormat), oee : 81, availability : 89, performance : 91, quality : 99},
  { index : 3, date : moment().subtract(3, 'days').format(dateFormat), oee : 83, availability : 90, performance : 93, quality : 99},
  { index : 4, date : moment().subtract(2, 'days').format(dateFormat), oee : 77, availability : 88, performance : 87, quality : 99},
  { index : 5, date : moment().subtract(1, 'days').format(dateFormat), oee : 81, availability : 91, performance : 89, quality : 99},
  { index : 6, date : moment().format(dateFormat), oee : 87, availability : 91, performance : 90, quality : 99}]
  var tData = {
    kpis : { tot : 18, in_pro : 15, stop : 3, alarm : 3 },
    notching : { tot : 6, in_pro : 5, stop : 1, alarm : 1, a_time : 7200, r_time : 3560, e_unit : 60000, p_unit : 58590, g_unit : 58490, n_unit : 100 },
    stacking : { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3550, e_unit : 30000, p_unit : 29880, g_unit : 29800, n_unit : 80 },
    tab_welding : { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3600, e_unit : 29500, p_unit : 28970, g_unit : 28889, n_unit : 81 },
    packaging : { tot : 2, in_pro : 1, stop : 1, alarm : 1, a_time : 7200, r_time : 3540, e_unit : 29000, p_unit : 28700, g_unit : 28618, n_unit : 82 },
    degassing : { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3590, e_unit : 28500, p_unit : 28470, g_unit : 28392, n_unit : 78 },
    leak_inspection : { tot : 2, in_pro : 1, stop : 1, alarm : 1, a_time : 7200, r_time : 3570, e_unit : 28000, p_unit : 27590, g_unit : 27513, n_unit : 77 },
    can_swaging : { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3600, e_unit : 27500, p_unit : 26990, g_unit : 26911, n_unit : 79 }    
  };
  console.log(rawData)
  drawGage(rawData[6]);
  drawLineChart(rawData);
  drawTable(tData)
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

function drawTable(data) {
  $('#tbody').empty();  
  var sb = new StringBuffer();
  var style3 = 'style="text-align:center;"';
  sb.append('<table class="table table-striped table-bordered"><tr style="background-color:#353535; color:white;">');
  sb.append('<th colspan="2" '+style3+'>KPIs</th><th '+style3+'>Notching</th><th '+style3+'>Stacking</th>');
  sb.append('<th '+style3+'>Tab Welding</th><th '+style3+'>Packaging</th><th '+style3+'>Degassing</th>');
  sb.append('<th '+style3+'>Leak Inspection</th><th '+style3+'>Can Swaging</th></tr>');
  var style = 'style="background-color:#9E9E9E;"';
  var style2 = 'text-align:center; background-color:#9E9E9E;';
  sb.append('<tr><th '+style+' >ToTal</th><th style="'+style2+'">'+data.kpis.tot+'</th>');
  sb.append(drawTr(data, 'tot', 'black', 'center'));
  sb.append('<tr><th '+style+'>In Production</th><th style="color:green; '+style2+'">'+data.kpis.in_pro+'</th>');
  sb.append(drawTr(data, 'in_pro', 'green', 'center'));
  sb.append('<tr><th '+style+'>Stop</th><th style="color:red; '+style2+'">'+data.kpis.stop+'</th>');
  sb.append(drawTr(data, 'stop', 'red', 'center'));
  sb.append('<tr><th '+style+'>Active Alarms</th><th style="color:red; '+style2+'">'+data.kpis.alarm+'</th>');
  sb.append(drawTr(data, 'alarm', 'red', 'center'));
  sb.append('<tr><th '+style+' colspan="2">Avaiability Time(min)</th>');
  sb.append(drawTr(data, 'a_time', 'green', 'right'));
  sb.append('<tr><th '+style+' colspan="2">Rurnning Time(min)</th>');
  sb.append(drawTr(data, 'r_time', 'blue', 'right'));
  sb.append('<tr><th '+style+' colspan="2">Expected Units</th>');
  sb.append(drawTr(data, 'e_unit', 'green', 'right'));
  sb.append('<tr><th '+style+' colspan="2">Produce Units</th>');
  sb.append(drawTr(data, 'p_unit', 'blue', 'right'));
  sb.append('<tr><th '+style+' colspan="2">Good Units</th>');
  sb.append(drawTr(data, 'g_unit', 'black', 'right'));
  sb.append('<tr><th '+style+' colspan="2">NG Units</th>');
  sb.append(drawTr(data, 'n_unit', 'red', 'right'));
  sb.append('</table>');
  console.log(sb.toString());
  $('#tbody').append(sb.toString());    
}

function drawTr(data, id, color, align){
  var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';
  var sb = '<td '+style+'>'+data.notching[id]+'</td><td '+style+'>'+data.stacking[id]+'</td>';
  sb += '<td '+style+'>'+data.tab_welding[id]+'</td><td '+style+'>'+data.packaging[id]+'</td>';
  sb += '<td '+style+'>'+data.degassing[id]+'</td><td '+style+'>'+data.leak_inspection[id]+'</td>';
  sb += '<td '+style+'>'+data.can_swaging[id]+'</td></tr>';  
  return sb;
}