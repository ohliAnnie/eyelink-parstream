$(document).ready(function(e) {        
  drawGage();
  getData();  
});

var oee, availability, performance, quality;
var color = { oee : '#1492FF', availability : '#04BBC2', performance : '#78B800', quality : '#FF5F00' };
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
      console.log(data)     
      drawLineChart(data.total, data.week);
      updateGage(data.total[data.total.length-1]);
      var tdata = {};
      tdata.date = in_data.data.now
      tdata.kpis = { tot : 0, in_pro : 0, stop : 0, alarm : 0 };
      tdata.tab_welding = { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3600, e_unit : 29500, p_unit : 28970, g_unit : 28889, n_unit : 81 };
      tdata.packaging = { tot : 2, in_pro : 1, stop : 1, alarm : 1, a_time : 7200, r_time : 3540, e_unit : 29000, p_unit : 28700, g_unit : 28618, n_unit : 82 };
      tdata.degassing = { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3590, e_unit : 28500, p_unit : 28470, g_unit : 28392, n_unit : 78 };
//      tdata.leak_inspection = { tot : 2, in_pro : 1, stop : 1, alarm : 1, a_time : 7200, r_time : 3570, e_unit : 28000, p_unit : 27590, g_unit : 27513, n_unit : 77 };
//      tdata.can_swaging = { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3600, e_unit : 27500, p_unit : 26990, g_unit : 26911, n_unit : 79 };      
      for(key in data){
        if(key != 'week' && key != 'total'){
          tdata[key] = { tot : data[key].DownTime+data[key].Running+data[key].ShortBreak+data[key].MealBreak, in_pro : data[key].Running,
          stop : data[key].DownTime+data[key].ShortBreak+data[key].MealBreak, alarm : data[key].alarm===undefined?'':data[key].alarm, a_time : Math.ceil(data[key].planned_production_time/60),
          d_time : Math.ceil(data[key].total_down_time/60), r_time :Math.ceil(data[key].operating_time/60), e_unit : data[key].total_expected_unit,
          p_unit : data[key].total_pieces, g_unit : data[key].total_accept_pieces, n_unit : data[key].total_reject_pieces, overall_oee : (data[key].overall_oee*100).toFixed(1),
          availability : (data[key].availability*100).toFixed(1), performance : (data[key].performance*100).toFixed(1), quality : (data[key].quality*100).toFixed(1) };
        }
      }      
      for(key in tdata) {       
        if(key == 'date' || key == 'kpis') {          
        } else {
          tdata.kpis.tot += (tdata[key].tot=='')?0:tdata[key].tot;
          tdata.kpis.in_pro += (tdata[key].in_pro=='')?0:tdata[key].in_pro;
          tdata.kpis.stop += (tdata[key].stop=='')?0:tdata[key].stop;
          tdata.kpis.alarm += (tdata[key].alarm==''||tdata[key].alarm==undefined)?0:tdata[key].alarm;
        }
      }
      drawTable(tdata);
    } 
  }); 
}

function drawGage(){  
  var max = 100; 
  oee = getGaguChart("oee", max, color.oee, 0, 0.12);
  availability = getGaguChart("availability", max, color.availability, 0, 0.12);
  performance = getGaguChart("performance", max, color.performance, 0, 0.12);
  quality = getGaguChart("quality", max, color.quality, 0, 0.12);  
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
    .width(window.innerWidth*0.36)
    .height(320)
    //.x(d3.time.scale().domain([minDate,maxDate]))
    //.round(d3.time.day.round)
    .x(d3.scale.linear().domain([0,6]))             
    .y(d3.scale.linear().domain([65, 102]))    
    .yAxisLabel("%")
    .legend(dc.legend().x(window.innerWidth*0.01).y(308).itemHeight(12).itemWidth(window.innerWidth*0.085).gap(4).horizontal(true))
    .renderHorizontalGridLines(true)
    .title(function(d){ return this.layer+' : '+d.value; })
    .compose([
      dc.lineChart(composite)
          .dimension(dim)            
          .colors(color.oee)
          .renderDataPoints(true)
          .group(oGroup, "OEE"),
      dc.lineChart(composite)
          .dimension(dim)
          .colors(color.availability)
          .renderDataPoints(true)
          .group(aGroup, "Availability"),
      dc.lineChart(composite)
          .dimension(dim)
          .colors(color.performance)
          .renderDataPoints(true)
          .group(pGroup, "Performance"),
      dc.lineChart(composite)
          .dimension(dim)
          .colors(color.quality)
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
  sb.append('<table class="table table-hover table-mes"><tr>');  
  sb.append('<th colspan="2"><i class="icon-speedometer"></i> &nbsp;KPIs<button id="btn_search" class="btn blue btn-xs pull-right" onclick="location.href=');
  sb.append("'/dashboard/detail?date="+data.date+"'"+'">Detail</button></th><th>Notching</th><th>Stacking</th>');  
  sb.append('<th>Tab Welding</th><th>Packaging</th><th>Degassing</th></tr>');  
  sb.append('<tr><th>ToTal</th><th><span class="badge badge-info">'+data.kpis.tot+'</span</th>');
  //sb.append('<tr><th >ToTal</th><th style="'+style2+'">'+data.kpis.tot+'</th>');
  sb.append(drawTr(data, 'tot', 'black'));
  sb.append('<tr><th>In Production</th><th style="color:green;"><span class="badge badge-success">'+data.kpis.in_pro+'</span></th>');
  sb.append(drawTr(data, 'in_pro', 'black'));
  sb.append('<tr><th>Stop</th><th style="color:red;"><span class="badge badge-danger">'+data.kpis.stop+'</span></th>');
  sb.append(drawTr(data, 'stop', 'black'));
  sb.append('<tr><th>Active Alarms</th><th style="color:red;"><span class="badge badge-warning">'+data.kpis.alarm+'</span></th>');
  sb.append(drawTr(data, 'alarm', 'black'));
  /*sb.append('<tr><th colspan="2">Avaiability Time(min)</th>');
  sb.append(drawTr(data, 'a_time', 'black'));
  sb.append('<tr><th colspan="2">Down Time(min)</th>');
  sb.append(drawTr(data, 'd_time', 'black'));
  sb.append('<tr><th colspan="2">Rurnning Time(min)</th>');
  sb.append(drawTr(data, 'r_time', 'black'));
  sb.append('<tr><th colspan="2">Expected Units</th>');
  sb.append(drawTr(data, 'e_unit', 'black'));
  sb.append('<tr><th colspan="2">Produce Units</th>');
  sb.append(drawTr(data, 'p_unit', 'black'));
  sb.append('<tr><th colspan="2">Good Units</th>');
  sb.append(drawTr(data, 'g_unit', 'black'));
  sb.append('<tr><th colspan="2">NG Units</th>');
  sb.append(drawTr(data, 'n_unit', 'black'));*/
  sb.append('<tr><th colspan="2">Overall OEE</th>');
  sb.append(drawTr(data, 'overall_oee', color.oee));
  sb.append('<tr><th colspan="2">Avaiability</th>');
  sb.append(drawTr(data, 'availability', color.availability));
  sb.append('<tr><th colspan="2">Performance</th>');
  sb.append(drawTr(data, 'performance', color.performance));
  sb.append('<tr><th colspan="2">Quality</th>');
  sb.append(drawTr(data, 'quality', color.quality));
  sb.append('</table>');    
  $('#tbody').append(sb.toString());    
}

function drawTr(data, id, color){
  var style = 'style="color:'+color+';"';
  var sb = '<td '+style+'>'+data.notching[id]+'</td><td '+style+'>'+data.stacking[id]+'</td>';
  sb += '<td '+style+'>'+data.tab_welding[id]+'</td><td '+style+'>'+data.packaging[id]+'</td>';
  sb += '<td '+style+'>'+data.degassing[id]+'</td></tr>';  
  return sb;
}