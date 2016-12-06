  function report(){

  var eventChart = dc.pieChart('#eventChart');
  var hourSeries = dc.seriesChart('#hourSeries');
  var avgCom = dc.compositeChart("#avgCom");
  var avgVib = dc.compositeChart("#avgVib");
  //var volumeChart = dc.seriesChart('#volumeChart');

d3.json("/reports/NYX", function(err, data){
  if(err) throw error;
   var numberFormat = d3.format('.2f');
   var minDate = new Date('2016-11-30T00:00:00')
   var maxDate = new Date('2016-12-06T24:00:00')      
   console.log(data);

  data.forEach(function(d){    
    console.log(d); 
  
    d.dd = new Date(d.event_time);
    d.month = d3.time.month(d.dd);
    d.hour = d3.time.hour(d.dd);
//    console.log(d.month);
//console.log(d.hour);
        var event = '';
    switch(d.event_type){      
      case 1 :   // 피워
        console.log('Power');
        event = 'POWER';
        break;   
      case 17 :   // 조도
        event = 'ALS';
        break;    
      case 33
 :     // 진동
        event = 'VIBRATION';
        break;
      case 49 :    // 노이즈
        event = 'NOISE';
        break;
      case 65 :    // GPS
        event = 'GPS';
        break;
      case 81 :     // 센서상태
        event = 'STREET LIGHT';
        break;
      case 153 :    // 재부팅
        event = 'REBOOT';
        break;
    }
/*    d.active_power  =  parseInt(d.active_power);
    d.vibration_x = parseInt(d.vibration_x);
    d.vibration_y = parseInt(d.vibration_y);
    d.vibration_z =  parseInt(d.vibration_z);*/
    d.vibration = (d.vibration_x+d.vibration_y+d.vibration_z)/3;
    d.event_name= event;
    console.log(d);
  }); 

  var nyx = crossfilter(data);    
  var all = nyx.groupAll();

  var eventDim = nyx.dimension(function(d) {
 //   console.log(d.event_name);
    return d.event_name;
  });

  var eventGroup = eventDim.group();

/*
var yearDim = nyx.dimension(function(d) {
//  return d3.time.year(d.dd).getFullYear();
});

var monthDim = nyx.dimension(function(d) {
  return d.month;
}) ; 

var dayDim = nyx.dimension(function(d){
  return d.dd;
});

var hourDim = nyx.dimension(function(d){
//  console.log(d3.time.hour(d.dd));
  return d.hour;
});
*/

/*var dayTypeDim = nyx.dimension(function(d){    
  return [+d.event_type, d.dd];
});

var volumeGroup = dayTypeDim.group().reduce(  
  function (p, v) {    
    if(v.event_type ===  1) { // 파워
      p.value = v.active_power;
        return p;
    } else if(v.event_type === 17) { // 조도
      p.value = 0;
        return p;
    } else if(v.event_type === 33) { // 진동
      p.value = v.vibration;
        return p;
    } else if(v.event_type === 49) { // 노이즈
      p.value = 0;
        return p;
    } else  if(v.event_type === 65) { // GPS
      p.value = 0;
        return p;
    } else if(v.event_type === 81) { // 센서상태
      p.value = 0;
        return p;
    } else if(v.event_type === 153) { // 재부팅
      p.value = 0;
        return p;
    } else {
      p.value = 0;
        return p;
    }
  },
  function (p, v) {
    if(v.event_type ===  1) { // 파워
      p.value = v.active_power;      
        return p;
    } else if(v.event_type === 17) { // 조도
      p.value = 0;
        return p;
    } else if(v.event_type === 33) { // 진동
      p.value = v.vibration;
        return p;
    } else if(v.event_type === 49) { // 노이즈
      p.value = 0;
        return p;
    } else  if(v.event_type === 65) { // GPS
      p.value = 0;
        return p;
    } else if(v.event_type === 81) { // 센서상태
      p.value = 0;
        return p;
    } else if(v.event_type === 153) { // 재부팅
      p.value = 0;
        return p;
    } else {
      p.value = 0;
        return p;
    }
  },
  function() {
    return { value :0 };
  }
);*/

var seriesDim = nyx. dimension(function(d){
  return [+d.event_type, d.hour];
});

var seriesGroup = seriesDim.group().reduce(  
  function (p, v) {
//    console.log(v);
    if(v.event_type ===  1) { // 파워
      p.max = p.max < v.active_power ? v.active_power : p.max;      
//      console.log(p);
//      console.log(v.hour);
        return p;
    } else if(v.event_type === 17) { // 조도
      p.max = 0;
        return p;
    } else if(v.event_type === 33) { // 진동
      p.max = p.max < v.vibration ? v.vibration : p.max;
        return p;
    } else if(v.event_type === 49) { // 노이즈
      p.max = 0;
        return p;
    } else  if(v.event_type === 65) { // GPS
      p.max = 0;
        return p;
    } else if(v.event_type === 81) { // 센서상태
      p.max = 0;
        return p;
    } else if(v.event_type === 153) { // 재부팅
      p.max = 0;
        return p;
    } else {
      p,max = 0;
        return p;
    }
  },
  function (p, v) {
    if(v.event_type ===  1) { // 파워
      p.max = p.max < v.active_power ? v.active_power : p.max;      
        return p;
    } else if(v.event_type === 17) { // 조도
      p.max = 0;
        return p;
    } else if(v.event_type === 33) { // 진동
      p.max = p.max < v.vibration ? v.vibration : p.max;
        return p;
    } else if(v.event_type === 49) { // 노이즈
      p.max = 0;
        return p;
    } else  if(v.event_type === 65) { // GPS
      p.max = 0;
        return p;
    } else if(v.event_type === 81) { // 센서상태
      p.max = 0;
        return p;
    } else if(v.event_type === 153) { // 재부팅
      p.max = 0;
        return p;
    } else {
      p,max = 0;
        return p;
    }
  },
  function() {
    return { max :0 };
  }
);

  var avgComDim = nyx.dimension(function (d) { return d3.time.day(d.dd); });
  var activeGroup = avgComDim.group().reduce(  
    function (p, v) {      
      if(v.event_type != 1) {
        p.value = 0;  
      }  else {        
        p.value = v.active_power;
        ++p.cnt ;
      }      
      p.sum += p.value;
      p.avg = numberFormat(p.sum / p.cnt);
      return p;
    },
    function (p, v) {      
      if(v.event_type != 1) {
        p.value = 0;
      }  else {        
        p.value = v.active_power;
        -- p.cnt ;
      }      
      p.sum -= p.value;
      p.avg = numberFormat(p,sum / p.cnt);
      return p;      
    },
    function() {
      return { value :0, cnt:0, sum:0, avg:0 };
    }
);
  var vibrationGroup = avgComDim.group().reduce(
   function (p, v) {
    if(v.event_type != 33) {
      p.value = 0;
    }  else {        
      p.value = v.vibration;
      ++ p.cnt ;
    }      
      p.sum += p.value;
      p.avg = numberFormat(p.sum / p.cnt);
      return p;
  },
  function (p, v) {
    if(v.event_type != 33) {
      p.value = 0;
    }  else {     
      p.value = v.vibration;   
      -- p.cnt ;
    }    
    p.sum -= p.value;
    p.avg = numberFormat(p.sum / p.cnt);
    return p;
  },
  function() {
    return { value :0, cnt:0, sum:0, avg:0 };
  });

 var vibrationXGroup = avgComDim.group().reduce(
   function (p, v) {
      if(v.event_type != 33) {
        p.value = 0;
      }  else {        
        p.value = v.vibration_x;
        ++ p.cnt ;
      }         
        p.sum += p.value;
        p.avg = numberFormat(p.sum / p.cnt);
        return p;
    },
    function (p, v) {      
      if(v.event_type != 33) {
        p.value = 0;
      }  else {        
        p.value = v.vibration_x
        -- p.cnt ;
      }        
        p.sum -= p.value;
        p.avg = numberFormat(p.sum / p.cnt);
        return p;      
    },
    function() {
      return { value :0, cnt:0, sum:0, avg:0 };
    }
  );
var vibrationYGroup = avgComDim.group().reduce(
   function (p, v) {
      if(v.event_type != 33) {
        p.value = 0;
      }  else {        
        p.value = v.vibration_y;
        ++ p.cnt ;
      }
      p.sum += p.value;
      p.avg = numberFormat(p.sum / p.cnt);
      return p;
    },
    function (p, v) {      
     if(v.event_type != 33) {
        p.value = 0;
      }  else {        
        p.value = v.vibration_y;
        -- p.cnt ;
      }        
      p.sum -= p.value;
      p.avg = numberFormat(p.sum / p.cnt);
      return p;      
    },
    function() {
      return { value :0, cnt:0, sum:0, avg:0 };
    }
  );
var vibrationZGroup = avgComDim.group().reduce(
   function (p, v) {
     if(v.event_type != 33) {
       p.value = 0;
     }  else {        
       p.value = v.vibration_z;
        ++ p.cnt ;
      }         
      p.sum += p.value;
      p.avg = numberFormat(p.sum / p.cnt);
      return p;
    },
    function (p, v) {      
      if(v.event_type != 33) {
        p.value = 0;
      }  else {      
        p.value = v.vibration_z;
        -- p.cnt ;
      }
      p.sum -= p.value;
      p.avg = numberFormat(p.sum / p.cnt);
      return p;      
    },
    function() {
      return { value :0, cnt:0, sum:0, avg:0 };
    }
  );


var adjustX = 20, adjustY = 40;
window.onresize = function()  {
  eventChart
  .width(window.innerWidth*0.4-adjustX)
  .height((window.innerWidth*0.4-adjustX)*0.75)
  .redraw();
 hourSeries
  .width(window.innerWidth*0.4-adjustX)
  .height((window.innerWidth*0.4-adjustX)*0.75)
  .redraw();
  avgCom  
  .width(window.innerWidth*0.4-adjustX)
  .height((window.innerWidth*0.4-adjustX)*0.9)
  .redraw();
  avgVib
  .width(window.innerWidth*0.4-adjustX)
  .height((window.innerWidth*0.4-adjustX)*0.9)
  .redraw();
};
/* dc.pieChart('#eventChart') */
  eventChart 
    .width(window.innerWidth*0.4-adjustX)    
    .height((window.innerWidth*0.4-adjustX)*0.75)
    .radius((window.innerWidth*0.4-adjustX)*0.3)
    .dimension(eventDim)
    .group(eventGroup)
//    .slicesCap(4)
/*    .externalLabels(50)
    .externalRadiusPadding(40)*/
    .drawPaths(true)
    .legend(dc.legend())
    .label(function (d){
        if(eventChart.hasFilter() && !eventChart.hasFilter(d.key)) {
          return '0(0%)';
        }        
        var label = d.key;
        if(all.value()) {
          label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
        }
        return label;
    })
    .colors(d3.scale.ordinal().range(["#CC333F","#EDC951","#00A0B0", "#756bb1"]));

/*eventChart.on('pretransition', function(eventChart) {
    eventChart. selectAll('.dc-legend-item test')
        .text('')
      .append('tspan')
        .text(function(d) { return d.key + '(' + Math.floor(d.value / all.value() * 100) + '%)'; })
      
  });*/
 //   eventChart.ordinalColors(['#3182bd', '#9ecae1', '#e6550d', '#fd8d3c', '#fdd0a2', '#31a354', '#a1d99b',  '#756bb1'])
// d3.scale.ordinal().range(["#EDC951","#CC333F","#00A0B0"]);
/* dc.seriesChart('#hourSeries') */
  hourSeries
    .width(window.innerWidth*0.4-adjustX)    
    .height((window.innerWidth*0.4-adjustX)*0.75)
     .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
     .x(d3.time.scale().domain([minDate, maxDate])) 
    .brushOn(false)
    .yAxisLabel("Time")
    .xAxisLabel("Value")
    .clipPadding(10)
    .elasticY(true)    
    .dimension(seriesDim)    
    .group(seriesGroup)
//    .mouseZoomable(true)
    .seriesAccessor(function(d) {  
      if(d.key[0] === 1) return 'active_power'; else if(d.key[0] === 33) return 'vibration'; else if(d.key[0] === 17) return 17; else if(d.key[0] === 81) return 81; else return null;})
    .keyAccessor(function(d) {               
     return d.key[1];     })
    .valueAccessor(function(d) {
      return +d.value.max;})
    .legend(dc.legend().x(window.innerWidth*0.3).y(window.innerWidth*0.3*0.75).itemHeight(13).gap(15));
    hourSeries.yAxis().tickFormat(function(d){  return d3.format('.d')(d); });
    hourSeries.margins().left += 40;  

    var active = 0, vibration = 0, vibX = 0, vibY = 0, vibZ = 0;
    avgCom
/*      .renderArea(true)
      .renderHorizontalGridLines(true)*/
      .width(window.innerWidth*0.4-adjustX)    
      .height((window.innerWidth*0.4-adjustX)*0.9)
      .dimension(avgComDim)
      .transitionDuration(500)
      //.elasticY(true)
      .y(d3.scale.linear().domain([0, 150])) 
      .brushOn(false)
      .mouseZoomable(true)
      .x(d3.time.scale().domain([minDate, maxDate])) 
   //   .yAxisLabel("Date")
 //     .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
      .title(function(d) {
        return "\nNumber of Povetry: " + d.key;
      })
      .legend(dc.legend().x(200).y(20).itemHeight(13).gap(5).horizontal(true))
      .compose([
          dc.lineChart(avgCom).group(vibrationGroup, "Vibration")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibration = d.value.avg;                        
             return vibration; })
            .colors('blue'),
          dc.lineChart(avgCom).group(activeGroup, "ActivePower")
            .valueAccessor(function(d) {              
              if(d.value.avg != 0)
                active = d.value.avg;                
              return active;  })
            .colors('green'),
        ]);


    avgVib
//      .renderArea(true)
      .width(window.innerWidth*0.4-adjustX)    
      .height((window.innerWidth*0.4-adjustX)*0.9)
      .dimension(avgComDim)
      .transitionDuration(500)
      .y(d3.scale.linear().domain([0,150])) 
//      .elasticY(true)
//      .brushOn(true)
      .mouseZoomable(true)
      .x(d3.time.scale().domain([minDate, maxDate])) 
//      .alwaysUseRounding(true)
      .xUnits(d3.time.day)
   //   .yAxisLabel("Date")
 //     .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
//      .renderHorizontalGridLines(true)
      .legend(dc.legend().x(100).y(20).itemHeight(13).gap(5).horizontal(true))  
      .valueAccessor(function (d){
        return d.value;
      }) 
      .title(function(d) {
        return "\nNumber of Povetry: " + d.key;
      })
      .compose([          
          dc.barChart(avgVib).group(vibrationGroup, "Average")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibration = d.value.avg;              
             return vibration; })
            .colors('blue')
            .xUnits(function(){return 10;}),
          dc.lineChart(avgVib).group(vibrationXGroup, "X")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibX = d.value.avg;                
             return vibX; })
            .colors('#E2F2FF'),
          dc.lineChart(avgVib).group(vibrationYGroup, "Y")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibY = d.value.avg;
                return vibY; })
            .colors('#6BBAFF'),
          dc.lineChart(avgVib).group(vibrationZGroup, "Z")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibZ = d.value.avg;
              console.log(d.value.avg);
             return vibZ; })
            .colors('#0089FF')
        ]);

/*volumeChart
    .width(window.innerWidth*0.4-adjustX)    
    .height((window.innerWidth*0.4-adjustX)*0.8)
  .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
  .x(d3.time.scale().domain([minDate, maxDate])) 
  .brushOn(false)
  .yAxisLabel("Day")
  .xAxisLabel("Value")
  .clipPadding(10)
  .elasticY(true)    
  .mouseZoomable(true)
  .dimension(dayTypeDim)
  .group(volumeGroup)
  .seriesAccessor(function(d) {  
    if(d.key[0] === 1) return 'active_power'; else if(d.key[0] === 33) return 'vibration'; else if(d.key[0] === 17) return 17; else if(d.key[0] === 81) return 81; else return null;})
  .keyAccessor(function(d) {               
   return d.key[1];     })
  .valueAccessor(function(d) {
   return +d.value.max;})
  .legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
  volumeChart.yAxis().tickFormat(function(d){  return d3.format('.d')(d); });
  volumeChart.margins().left += 40;  */

    dc.renderAll();
});

}