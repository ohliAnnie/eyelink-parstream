$(document).ready(function(e) {        
  getData();
  drawGage(value);
});

var value = { oee : 0, availability : 0, performance : 0, quality : 0 };
var oee, availability, performance, quality;

(function loop() {
  getData();
  setTimeout(loop, 30*1000);
})();

function getData(){
  var data = { now : new Date().getTime() };
  var in_data = { url : "/dashboard/restapi/getDashboardGageData", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;
      console.log(data);
      var notching = data.notching[data.notching.length-1];
      var stacking = data.stacking[data.stacking.length-1];
      drawLineChart(data.stacking.concat(data.notching));  
    } 
  }); 
  var in_data = { url : "/dashboard/restapi/getDashboardAggsData", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;      
      console.log(data);
      var tData = {
        date : data.notching.key_as_string,
        kpis : { tot : 18, in_pro : 15, stop : 3, alarm : 3 },
        notching : { tot : 6, in_pro : 5, stop : 1, alarm : 1, a_time : data.notching.availability_time.value, d_time : data.notching.down_time.value, r_time :data.notching.running_time.value, e_unit : data.notching.expected_unit.value, p_unit : data.notching.produce_unit.value, g_unit : data.notching.good_unit.value
    , n_unit : data.notching.ng_unit.value },
        stacking : { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : data.stacking.availability_time.value, d_time : data.stacking.down_time.value, r_time :data.stacking.running_time.value, e_unit : data.stacking.expected_unit.value, p_unit : data.stacking.produce_unit.value, g_unit : data.stacking.good_unit.value
    , n_unit : data.stacking.ng_unit.value },
        tab_welding : { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3600, e_unit : 29500, p_unit : 28970, g_unit : 28889, n_unit : 81 },
        packaging : { tot : 2, in_pro : 1, stop : 1, alarm : 1, a_time : 7200, r_time : 3540, e_unit : 29000, p_unit : 28700, g_unit : 28618, n_unit : 82 },
        degassing : { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3590, e_unit : 28500, p_unit : 28470, g_unit : 28392, n_unit : 78 },
        leak_inspection : { tot : 2, in_pro : 1, stop : 1, alarm : 1, a_time : 7200, r_time : 3570, e_unit : 28000, p_unit : 27590, g_unit : 27513, n_unit : 77 },
        can_swaging : { tot : 2, in_pro : 2, stop : '', alarm : '', a_time : 7200, r_time : 3600, e_unit : 27500, p_unit : 26990, g_unit : 26911, n_unit : 79 }    
      };
      drawTable(tData);      
    } 
  });   
}

function drawGage(value){  
  var max = 100; 
  oee = getGaguChart("oee", max, '#F361DC', value["oee"], 0.15);
  availability = getGaguChart("availability", max, 'blue', value["availability"], 0.1);
  performance = getGaguChart("performance", max, '#FF7012', value["performance"], 0.1);
  quality = getGaguChart("quality", max, 'green', value["quality"], 0.1);  
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
  var minDate = new Date(data[0].dtSensed);
  var maxDate = new Date(data[data.length-1].dtSensed);
  /*var xData = [];
  for(i=0; i<data.length; i++){
    xData[i] = data[i].date;
  }*/
  var composite = dc.compositeChart("#composed");
  
  var ndx = crossfilter(data);

  var dim  = ndx.dimension(function(d){    
    //console.log(d.overall_oee, d.availability, d.performance, d.quality);
    return new Date(d.dtSensed);
  });

  var oGroup = dim.group().reduce(
      function(p,v){                
        p.count++;
        p.sum += v.overall_oee;
        p.avg = p.sum/p.count;
        return p;
      },
  //remove
      function(p,v){
        p.count--;    
        p.sum -= v.overall_oee;
        p.avg = p.sum/p.count;
        return p;
      },
      //init
      function(p,v){
         return {count:0, avg:0, sum:0};
      }
    );
  var aGroup = dim.group().reduce(
      function(p,v){        
        p.count++;
        p.sum += v.availability;
        p.avg = p.sum/p.count;
        return p;
      },
  //remove
      function(p,v){
        p.count--;    
        p.sum -= v.availability;
        p.avg = p.sum/p.count;
        return p;
      },
      //init
      function(p,v){
         return {count:0, avg:0, sum:0};
      }
    );
  var pGroup = dim.group().reduce(
      function(p,v){        
        p.count++;
        p.sum += v.performance;
        p.avg = p.sum/p.count;
        return p;
      },
  //remove
      function(p,v){
        p.count--;    
        p.sum -= v.performance;
        p.avg = p.sum/p.count;
        return p;
      },
      //init
      function(p,v){
         return {count:0, avg:0, sum:0};
      }
    );
  var qGroup = dim.group().reduce(
      function(p,v){        
        p.count++;
        p.sum += v.quality;
        p.avg = p.sum/p.count;
        return p;
      },
  //remove
      function(p,v){
        p.count--;    
        p.sum -= v.quality;
        p.avg = p.sum/p.count;
        return p;
      },
      //init
      function(p,v){
         return {count:0, avg:0, sum:0};
      }
    );
  
  composite.margins().bottom = 50;
  composite.margins().right = 65;
  // composite.xAxis().tickFormat(function(v) {return xData[v];});
  composite.yAxis().ticks(7);
  composite
    .width(window.innerWidth*0.38)
    .height(290)
    .x(d3.time.scale().domain([minDate,maxDate]))
    //.x(d3.scale.linear().domain([0,6]))           
    .y(d3.scale.linear().domain([65, 102]))    
    .yAxisLabel("%")
    .legend(dc.legend().x(window.innerWidth*0.05).y(267).itemHeight(12).itemWidth(window.innerWidth*0.07).gap(4).horizontal(true))
    .renderHorizontalGridLines(true)
    .title(function(d){            
            return d.key.getFullYear()+'-'+(d.key.getMonth()+1)+'-'+d.key.getDate()+' : '+(d.value.avg*100).toFixed(1);
            })
    .compose([
      dc.lineChart(composite)
          .dimension(dim)            
          .colors('#F361DC')
          .renderDataPoints(true)
          .group(oGroup, "OEE")
          .valueAccessor(function (p) {            
            value.oee = p.value.avg*100;
            return p.value.avg*100;
          }),
      dc.lineChart(composite)
          .dimension(dim)
          .colors('blue')
          .renderDataPoints(true)
          .group(aGroup, "Availability")          
          .valueAccessor(function (p) {            
            value.availability = p.value.avg*100;
            return p.value.avg*100;
          }),
      dc.lineChart(composite)
          .dimension(dim)
          .colors('#FF7012')
          .renderDataPoints(true)
          .group(pGroup, "Performance")
          .valueAccessor(function (p) {            
            value.performance = p.value.avg*100;
            return p.value.avg*100;
          }),
      dc.lineChart(composite)
          .dimension(dim)
          .colors('green')
          .renderDataPoints(true)
          .group(qGroup, "Quality")            
          .valueAccessor(function (p) {            
            value.quality = p.value.avg*100;
            return p.value.avg*100;
          })
    ])
    .brushOn(false)
    .render();
    oee.update(value.oee);
    availability.update(value.availability);
    performance.update(value.performance);
    quality.update(value.quality);
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