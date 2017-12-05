$(document).ready(function(e) {        
  drawGage();
  getData();  
});

var oee, availability, performance, quality;

(function loop() {
  getData();
  setTimeout(loop, 30*1000);
})();

function getData(){
  var data = { now : new Date().getTime() };
  
  var in_data = { url : "/dashboard/restapi/getDashboardWeekly", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {            
      var data = result.rtnData;
      console.log(data);
      drawLineChart(data.total, data.week);
      updateGage(data.total[data.total.length-1]);
      var tdata = {};
      tdata.date = in_data.data.now
      tdata.kpis = { tot : 18, in_pro : 15, stop : 3, alarm : 3 };
      tdata.tab_welding = { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3600, e_unit : 29500, p_unit : 28970, g_unit : 28889, n_unit : 81 };
      tdata.packaging = { tot : 2, in_pro : 1, stop : 1, alarm : 1, a_time : 7200, r_time : 3540, e_unit : 29000, p_unit : 28700, g_unit : 28618, n_unit : 82 };
      tdata.degassing = { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3590, e_unit : 28500, p_unit : 28470, g_unit : 28392, n_unit : 78 };
      tdata.leak_inspection = { tot : 2, in_pro : 1, stop : 1, alarm : 1, a_time : 7200, r_time : 3570, e_unit : 28000, p_unit : 27590, g_unit : 27513, n_unit : 77 };
      tdata.can_swaging = { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3600, e_unit : 27500, p_unit : 26990, g_unit : 26911, n_unit : 79 };
      data.stacking.tot= 6;
      data.stacking.in_pro = 5;
      data.stacking.stop = 1;
      data.stacking.alarm = 1;
      data.notching.tot = 2;
      data.notching.in_pro = 2;
      data.notching.stop = '';
      data.notching.alarm = '';
      for(key in data){
        tdata[key] = { tot : data[key].tot, in_pro : data[key].in_pro, stop : data[key].stop, alarm : data[key].alarm, a_time : Math.ceil(data[key].planned_production_time/60),
          d_time : Math.ceil(data[key].total_down_time/60), r_time :Math.ceil(data[key].operating_time/60), e_unit : data[key].total_expected_unit,
          p_unit : data[key].total_pieces, g_unit : data[key].total_accept_pieces, n_unit : data[key].total_reject_pieces, overall_oee : (data[key].overall_oee*100).toFixed(1),
          availability : (data[key].availability*100).toFixed(1), performance : (data[key].performance*100).toFixed(1), quality : (data[key].quality*100).toFixed(1) };
      }
      drawTable(tdata);      
    } 
  }); 
}

function drawGage(){  
  var max = 100; 
  oee = getGaguChart("oee", max, '#F361DC', 0, 0.15);
  availability = getGaguChart("availability", max, 'blue', 0, 0.1);
  performance = getGaguChart("performance", max, '#FF7012', 0, 0.1);
  quality = getGaguChart("quality", max, 'green', 0, 0.1);  
}

function updateGage(value){  
  oee.update(value.overall_oee*100);
  availability.update(value.availability*100);
  performance.update(value.performance*100);
  quality.update(value.quality*100);
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

function drawLineChart(data, week) {

  var composite = dc.compositeChart("#composed");
  
  var ndx = crossfilter(data);

  var dim  = ndx.dimension(function(d, v){
    return v;
  });

  var oGroup = dim.group().reduceSum(function(d){ return d.overall_oee*100;});
  var aGroup = dim.group().reduceSum(function(d){ return d.availability*100;});
  var pGroup = dim.group().reduceSum(function(d){ return d.performance*100;});
  var qGroup = dim.group().reduceSum(function(d){ return d.quality*100;});
  
  var minDate = new Date(data[0].date);
  var maxDate = new Date(data[data.length-1].date);

  composite.margins().bottom = 50;
  composite.margins().right = 65;
  composite.xAxis().tickFormat(function(v) {return week[v];});
  composite.yAxis().ticks(7);
  composite
    .width(window.innerWidth*0.38)
    .height(290)
    //.x(d3.time.scale().domain([minDate,maxDate]))
    //.round(d3.time.day.round)
    .x(d3.scale.linear().domain([0,6]))             
    .y(d3.scale.linear().domain([65, 102]))    
    .yAxisLabel("%")
    .legend(dc.legend().x(window.innerWidth*0.05).y(267).itemHeight(12).itemWidth(window.innerWidth*0.07).gap(4).horizontal(true))
    .renderHorizontalGridLines(true)
    .title(function(d){ return this.layer+' : '+d.value; })
    .compose([
      dc.lineChart(composite)
          .dimension(dim)            
          .colors('#F361DC')
          .renderDataPoints(true)
          .group(oGroup, "OEE"),
      dc.lineChart(composite)
          .dimension(dim)
          .colors('blue')
          .renderDataPoints(true)
          .group(aGroup, "Availability"),
      dc.lineChart(composite)
          .dimension(dim)
          .colors('#FF7012')
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

var cnt = 0
function drawTable(data) {
  $('#tbody').empty();  
  var sb = new StringBuffer();
  var style3 = 'style="text-align:center;"';
  sb.append('<table class="table table-striped table-bordered" onclick="location.href=');
  sb.append("'detail?date="+data.date+"'"+'"><tr style="background-color:#353535; color:white;">');  
  sb.append('<th colspan="2" '+style3+'>KPIs</th><th '+style3+'>Notching</th><th '+style3+'>Stacking</th>');
  sb.append('<th '+style3+'>Tab Welding</th><th '+style3+'>Packaging</th><th '+style3+'>Degassing</th></tr>');
  var style = 'style="background-color:#9E9E9E;"';
  var style2 = 'text-align:center; background-color:#9E9E9E;';
  sb.append('<tr><th '+style+' >ToTal</th><th style="'+style2+'">'+data.kpis.tot+'</th>');
  //sb.append('<tr><th '+style+' >ToTal</th><th style="'+style2+'">'+data.kpis.tot+'</th>');
  sb.append(drawTr(data, 'tot', 'black', 'center'));
  sb.append('<tr><th '+style+'>In Production</th><th style="color:green; '+style2+'">'+data.kpis.in_pro+'</th>');
  sb.append(drawTr(data, 'in_pro', 'green', 'center'));
  sb.append('<tr><th '+style+'>Stop</th><th style="color:red; '+style2+'">'+data.kpis.stop+'</th>');
  sb.append(drawTr(data, 'stop', 'red', 'center'));
  sb.append('<tr><th '+style+'>Active Alarms</th><th style="color:red; '+style2+'">'+data.kpis.alarm+'</th>');
  sb.append(drawTr(data, 'alarm', 'red', 'center'));
  sb.append('<tr><th '+style+' colspan="2">Avaiability Time(min)</th>');
  sb.append(drawTr(data, 'a_time', 'green', 'right'));
  sb.append('<tr><th '+style+' colspan="2">Down Time(min)</th>');
  sb.append(drawTr(data, 'd_time', 'black', 'right'));
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
  sb.append('<tr><th '+style+' colspan="2">Overall OEE</th>');
  sb.append(drawTr(data, 'overall_oee', '#F361DC', 'right'));
  sb.append('<tr><th '+style+' colspan="2">Avaiability</th>');
  sb.append(drawTr(data, 'availability', 'blue', 'right'));
  sb.append('<tr><th '+style+' colspan="2">Performance</th>');
  sb.append(drawTr(data, 'performance', '#FF7012', 'right'));
  sb.append('<tr><th '+style+' colspan="2">Quality</th>');
  sb.append(drawTr(data, 'quality', 'green', 'right'));
  sb.append('</table>');  

  $('#tbody').append(sb.toString());    
}

function drawTr(data, id, color, align){
  var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';
  var sb = '<td '+style+'>'+data.notching[id]+'</td><td '+style+'>'+data.stacking[id]+'</td>';
  sb += '<td '+style+'>'+data.tab_welding[id]+'</td><td '+style+'>'+data.packaging[id]+'</td>';
  sb += '<td '+style+'>'+data.degassing[id]+'</td></tr>';  
  return sb;
}