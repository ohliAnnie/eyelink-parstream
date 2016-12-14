  function report(){

  var eventChart = dc.pieChart('#eventChart');
  var eventBar = dc.barChart('#eventBar');
  var eventSeries = dc.seriesChart('#eventSeries');
  var eventHeat = dc.heatMap("#eventHeat");
  var dayBubble = dc.bubbleChart("#dayBubble");
  var scatterSeries = dc.seriesChart("#scatterSeries");
  var timeMax = dc.compositeChart("#timeMax");
  var volumeMax = dc.barChart("#volumeMax");
  var apMax = dc.barChart("#apMax");
  var vibMax = dc.barChart("#vibMax");
  var noDMax = dc.barChart("#noDMax");
  var noFMax = dc.barChart("#noFMax");
  var avgCom = dc.compositeChart("#avgCom");
  var avgVib = dc.compositeChart("#avgVib");
  var gapVib = dc.lineChart("#gapVib");
  var groupBar = dc.compositeChart("#groupBar");
  /*var volumeChart = dc.seriesChart('#volumeChart');*/

d3.json("/reports/restapi/getReportRawData", function(err, data){
  if(err) throw error;

   var numberFormat = d3.format('.2f');

// TODO :  날짜 자동 계산
   var minDate = new Date(2016,11,07);
  var maxDate = new Date(2016,11,14); 
  var yesDate = new Date(2016,11,13);
  var eventName = ["POWER", "ALS", "VIBRATION", "NOISE", "GPS", "STREET LIGHT", "REBOOT"];
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
        event = 'VIBRATION';
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
    d.active_power  =  parseFloat(d.active_power);
    d.vibration_x = parseFloat(d.vibration_x);
    d.vibration_y = parseFloat(d.vibration_y);
    d.vibration_z =  parseFloat(d.vibration_z);
    d.vibration = (d.vibration_x+d.vibration_y+d.vibration_z)/3;
    d.als_level = parseInt(d.als_level);
    d.status_power_meter = parseInt(d.status_power_meter);
    d.noise_decibel= parseInt(d.noise_decibel);
    d.noise_frequency = parseInt(d.noise_frequency);
    d.event_name= event;
  });

  var nyx = crossfilter(data.rtnData);
  var all = nyx.groupAll();

// Dimension by event_name
  var eventDim = nyx.dimension(function(d) {
    return d.event_name;
  });

  var eventGroup = eventDim.group();

// Dimension by event_name & hour
  var eventSeriesDim = nyx.dimension(function(d) {    return [ d.event_name, +d.hour];  });

  var eventSeriesGroup = eventSeriesDim.group().reduceCount(function(d) {
    return 1;
  });

// Dimension by index & week
  var indexWeekDim = nyx.dimension(function(d) {
    var day = d.today.getDay();
    return [d.index, day+'.'+week[day]];  });

  var eventHeatGroup = indexWeekDim.group().reduceCount(function(d) {
    return 1;
  });

// Dimension by index & today
  var indexDayDim = nyx.dimension(function(d){
    return [d.index, d.today];
  }) ;

  var scatterSeriesGroup = indexDayDim.group().reduce(
    function(p, v) {
     switch(v.event_type){
      case "1" :   // 피워
        p.value = v.active_power;
        break;
      case "17" :   // 조도
        p.value = v.als_level;
        break;
      case "33" :     // 진동
        p.value = v.vibration;
        break;
      case "49" :    // 노이즈
        p.value = v.noise_decibel;
        break;
      case "65" :    // GPS
        p.value = 0;
        break;
      case "81" :     // 센서상태
        p.value = v.status_power_meter;
        break;
      case "153" :    // 재부팅
        p.value = 0;
        break;
      }
        p.max = p.max < p.value ? p.value : p.max;
        return p;
    }, function(p, v) {
     switch(v.event_type){
      case "1" :   // 피워
        p.value = v.active_power;
        break;
      case "17" :   // 조도
        p.value = v.als_level;
        break;
      case "33" :     // 진동
        p.value = v.vibration;
        break;
      case "49" :    // 노이즈
        p.value = v.noise_decibel;
        break;
      case "65" :    // GPS
        p.value = 0;
        break;
      case "81" :     // 센서상태
        p.value = v.status_power_meter;
        break;
      case "153" :    // 재부팅
        p.value = 0;
        break;
      }
      p.max =  p.max < p.value ? p.value : p.max;
      return p;
    }, function() {
      return { value : 0, max : 0 }
  });

// Dimension by week
  var dayDim = nyx.dimension(function(d) {
    var day = d.today.getDay();
    return week[day];
  });

  var dayBubbleGroup = dayDim.group().reduce(
    function(p, v) {
      if(v.event_type == "33") {
        ++p.cntV;
        p.sumVib += v.vibration;        
      } else if(v.event_type == "49") {
        ++p.cntN;        
        p.sumNoD += v.noise_decibel;
        p.sumNoF += v.noise_frequency;
      } 
        p.avgVib = p.cntV ? p.sumVib / p.cntV : 0;
        p.avgNoD = p.cntN ? p.sumNoD / p.cntN : 0;
        p.avgNoF = p.cntN ? p.sumNoF / p.cntN : 0;
      return p;
    }, function(p, v) {
      if(v.event_type == "33") {
        --p.cntV;
        p.sumVib -= v.vibration;        
      } else if(v.event_type == "49") {
        --p.cntN;        
        p.sumNoD -= v.noise_decibel;
        p.sumNoF -= v.noise_frequency;
      } 
        p.avgVib = p.cntV ? p.sumVib / p.cntV : 0;
        p.avgNoD = p.cntN ? p.sumNoD / p.cntN : 0;
        p.avgNoF = p.cntN ? p.sumNoF / p.cntN : 0;
      return p;
    }, function() {
      return {  cntV:0, cntN:0,
        sumVib:0, sumNoD:0, sumNoF:0,
        avgVib:0, avgNoD:0, avgNoF:0 ,      
      };
    }
  );

// Dimension by today
  var todayDim = nyx.dimension(function (d) { return d.today; });

  var eventBarGroup = todayDim.group().reduce(function(p, v){
    p[v.index] = (p[v.index] || 0) + 1;
    return p;
  }, function(p, v) {
    p[v.index] = (p[v.index] || 0) - 1;
    return p;
  }, function() {
    return{};
  });

  var activeGroup = todayDim.group().reduce(
    function (p, v) {
      if(v.event_type == "1") {        
        p.sum += v.active_power;
        ++p.cnt ;
      }      
      p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
      return p;
    },
    function (p, v) {
      if(v.event_type == "1") {
        p.sum -= v.active_power;  
        -- p.cnt ;
      }      
      p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
      return p;
    },
    function() {
      return { cnt:0, sum:0, avg:0 };
    }
  );

  var vibrationGroup = todayDim.group().reduce(
   function (p, v) {
    if(v.event_type == "33") {
       p.sum += v.vibration;
      ++ p.cnt ;
    }      
      p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
    return p;
  },
  function (p, v) {
    if(v.event_type == "33") {
       p.sum -= v.vibration;
      -- p.cnt ;
    }      
      p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
    return p;
  },
  function() {
    return { cnt:0, sum:0, avg:0 };
  });

 var vibrationXGroup = todayDim.group().reduce(
   function (p, v) {
      if(v.event_type == "33") {
        p.sum +=  v.vibration_x;
        ++ p.cnt ;
      }      
        p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
      return p;
    },
    function (p, v) {
      if(v.event_type == "33") {
        p.sum -= v.vibration_x;
        -- p.cnt ;
      }         
        p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
      return p;
    },
    function() {
      return { cnt:0, sum:0, avg:0 };
    }
  );

 var vibrationYGroup = todayDim.group().reduce(
   function (p, v) {
      if(v.event_type == "33") {
        p.sum +=  v.vibration_y;
        ++ p.cnt ;
      }      
        p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
      return p;
    },
    function (p, v) {
      if(v.event_type == "33") {
        p.sum -= v.vibration_y;
        -- p.cnt ;
      }         
        p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
      return p;
    },
    function() {
      return { cnt:0, sum:0, avg:0 };
    }
  );

 var vibrationZGroup = todayDim.group().reduce(
   function (p, v) {
      if(v.event_type == "33") {
        p.sum +=  v.vibration_z;
        ++ p.cnt ;
      }      
        p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
      return p;
    },
    function (p, v) {
      if(v.event_type == "33") {
        p.sum -= v.vibration_z;
        -- p.cnt ;
      }         
        p.avg = p.cnt ? numberFormat(p.sum / p.cnt) : 0;
      return p;
    },
    function() {
      return { cnt:0, sum:0, avg:0 };
    }
  );

  var gapVibGroup = todayDim.group().reduce(
    function(p, v){
      if(v.event_type == "33") {        
        if(p.min == 0)
          p.min = v.vibration;
        p.max = p.max < v.vibration ? v.vibration : p.max;
        p.min = p.min > v.vibration ? v.vibration : p.min;
      }       
      p.gap = p.max-p.min;
      return p;
    },
    function(p, v) {
      if(v.event_type == "33") {        
        if(p.min == 0)
          p.min = v.vibration;
        p.max = p.max < v.vibration ? v.vibration : p.max;
        p.min = p.min > v.vibration ? v.vibration : p.min;
      }       
      p.gap = p.max-p.min;
      return p;
  }, function() {
    return {  max:0, min:0, gap:0 };
  });

var timeMaxDim = nyx.dimension(function(d) {
  return d.hour;
});

var volumeMaxGroup = timeMaxDim.group().reduceSum(function(d) {
  return 1;
});

var apMaxGroup = timeMaxDim.group().reduce(
  function (p, v) {
    if(v.event_type !=  "1") { // 파워
      p.value=0;
    } else {
      p.value = v.active_power;
    }
    p.max = p.max < p.value ? p.value : p.max;
    return p;
  },
  function (p, v) {
    if(v.event_type !=  "33") { // 진동
      p.value=0;
    } else {
      p.value = v.active_power;
    }
    p.max = p.max < p.value ? p.value : p.max;
    return p;
  },
  function() {
    return {value:0, max:0}
  }
);
var vibMaxGroup = timeMaxDim.group().reduce(
  function (p, v) {
    if(v.event_type !=  "33") { // 파워
      p.value=0;
    } else {
      p.value = v.vibration;
    }
    p.max = p.max < p.value ? p.value : p.max;
    return p;
  },
  function (p, v) {
    if(v.event_type !=  "33") { // 파워
      p.value=0;
    } else {
      p.value = v.vibration;
    }
    p.max = p.max < p.value ? p.value : p.max;
    return p;
  },
  function() {
    return {value:0, max:0}
  }
);
var noDMaxGroup = timeMaxDim.group().reduce(
  function (p, v) {
    if(v.event_type !=  "49") { // 노이즈
      p.value=0;
    } else {
      p.value = v.noise_decibel;
    }
    p.max = p.max < p.value ? p.value : p.max;
    return p;
  },
  function (p, v) {
    if(v.event_type !=  "49") { // 노이즈
      p.value=0;
    } else {
      p.value = v.noise_decibel;
    }
    p.max = p.max < p.value ? p.value : p.max;
    return p;
  },
  function() {
    return {value:0, max:0}
  }
);
var noFMaxGroup = timeMaxDim.group().reduce(
  function (p, v) {
    if(v.event_type !=  "49") { // 노이즈
      p.value=0;
    } else {
      p.value = v.noise_frequency;
    }
    p.max = p.max < p.value ? p.value : p.max;
    return p;
  },
  function (p, v) {
    if(v.event_type !=  "49") { // 노이즈
      p.value=0;
    } else {
      p.value = v.noise_frequency;
    }
    p.max = p.max < p.value ? p.value : p.max;
    return p;
  },
  function() {
    return {value:0, max:0}
  }
);

/*window.onresize = function()  {
  eventChart
  .width(window.innerWidth*0.4)
  .height((window.innerWidth*0.4)*0.5)
  .redraw();
  timeMax
  .width(window.innerWidth*0.4)
  .height((window.innerWidth*0.4)*0.5)
  .redraw();
  avgCom
  .width(window.innerWidth*0.4)
  .height((window.innerWidth*0.4)*0.7)
  .redraw();
  avgVib
  .width(window.innerWidth*0.4)
  .height((window.innerWidth*0.4)*0.7)
  .redraw();
  apMax
  .width((window.innerWidth*0.4)*0.5)
  .height((window.innerWidth*0.4)*0.5)
  .redraw();
  vibMax
  .width((window.innerWidth*0.4)*0.5)
  .height((window.innerWidth*0.4)*0.5)
  .redraw();
};*/

/* dc.pieChart('#eventChart') */
  eventChart
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .radius((window.innerWidth*0.4)*0.2)
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
    .renderLabel(true)
    .colors(d3.scale.ordinal().range(["#CC333F", "#31a354", "#EDC951","#00A0B0", "#756bb1"]));

    function sel_stack(i) {
        return function(d) {
            return d.value[i];
        };
    }

/*dc.seriesChart('#eventSeries')*/
// FIXME : legend
// FIXME : 필터링 적용
  eventSeries
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
    .margins({top: 40, right: 40, bottom: 25, left: 20})
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.day.round)
    .xUnits(d3.time.days)
    .brushOn(false)
    .yAxisLabel("Count")
    .xAxisLabel("Time")
    .colors(d3.scale.ordinal().range(["#CC333F", "#31a354", "#EDC951","#00A0B0", "#756bb1"]))
    .clipPadding(10)
    .elasticY(true)
    .dimension(eventSeriesDim)
    .group(eventSeriesGroup)
//    .mouseZoomable(true)
    .seriesAccessor(function(d) {return d.key[0];})
    .keyAccessor(function(d) {return +d.key[1];})
    .valueAccessor(function(d) {
      return +d.value;})
    .legend(dc.legend().x(10).y(0).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
  eventSeries.yAxis().tickFormat(function(d) {return d;});
  eventSeries.margins().left += 40;

/* dc.heatMap("#eventHeat")  */
  eventHeat
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 20, right: 45, bottom: 40, left: 50})
    .dimension(indexWeekDim)
    .group(eventHeatGroup)
    .keyAccessor(function(d) { return eventName[d.key[0]]; })
    .valueAccessor(function(d) { return d.key[1].split('.')[1]; })
    .colorAccessor(function(d) { return +d.value; })
    .title(function(d) {
        return "Date :   " + d.key[1].split('.')[1] + "\n" +
               "Event_name :  " + eventName[d.key[0]] + "\n" +
               "Cnt : " + d.value; })
    .colors(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
    .calculateColorDomain();

/*  dc.bubbleChart('#dayBubble')  */
  dayBubble
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .transitionDuration(1500)
    .margins({top: 10, right: 50, bottom: 30, left: 40})
    .dimension(dayDim)
    .group(dayBubbleGroup)
    .colors(colorbrewer.RdYlGn[9]) // (optional) define color function or array for bubbles
    .colorDomain([0, 100]) //(optional) defin
    .colorAccessor(function (d) {
        return d.value.cntN + d.value.cntV;
    })
       .keyAccessor(function (p) { // x
        return p.value.avgNoF;
    })
    .valueAccessor(function (p) { // y
        return p.value.avgNoD;
    })
    .radiusValueAccessor(function (p) { // r
        return p.value.avgVib;
    })
    .maxBubbleRelativeSize(0.3)
    .x(d3.scale.linear().domain([0, 20000]))
    .y(d3.scale.linear().domain([0, 4]))
    .r(d3.scale.linear().domain([0, 300]))
    .elasticY(true)
    .elasticX(true)
    .yAxisPadding(1)
    .xAxisPadding(1)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
/*    .xAxisLabel('Noise Frequecy')
    .yAxisLabel('Noise Decibel')*/
    /*.renderLabel(true)*/
    .label(function (p) {
      return p.key;
    })
    .renderTitle(true)
    .title(function (p) {
        return [
            p.key,
            'Noise Decibel Avg: ' + numberFormat(p.value.avgNoD),
            'Noise Frequecy Avg: ' + numberFormat(p.value.avgNoF),
            'Vibration Avg: ' + numberFormat(p.value.avgVib)
        ].join('\n');
    })
    .yAxis().tickFormat(function (v) {
        return v ;
    });

/* dc.seriesChart('#scatterSeries') */
  var symbolScale = d3.scale.ordinal().range(d3.svg.symbolTypes);
  var symbolAccessor = function(d) { return symbolScale(d.key[0]); };
  var subChart = function(c) {
    return dc.scatterPlot(c)
        .symbol(symbolAccessor)
        .symbolSize(8)
        .highlightedSize(10)
  };

scatterSeries
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 15, right: 20, bottom: 30, left: 140})
    .chart(subChart)
    .brushOn(false)    
    .xAxisLabel("Days")
    .clipPadding(10)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.day.round)
    .xUnits(d3.time.day)
    .elasticY(true)
    .dimension(indexDayDim)
    .group(scatterSeriesGroup)
//    .mouseZoomable(true)
    .rangeChart(volumeMax)
    .seriesAccessor(function(d) {
      return eventName[d.key[0]];})
    .keyAccessor(function(d) {return +d.key[1];})
    .valueAccessor(function(d) {return +d.value.max;})
    .colors(d3.scale.ordinal().range(["#CC333F", "#EDC951", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399"]))
    .legend(dc.legend().x(10).y(0).itemHeight(13).gap(5).legendWidth(140).itemWidth(70));
//  chart.yAxis().tickFormat(function(d) {return d3.format(',d')(d+299500);});
//  chart.margins().left += 40;

/*  dc.barChart('#eventBar')  */
  eventBar
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({left: 140, top: 20, right: 10, bottom: 20})
    .brushOn(false)
    .clipPadding(10)
    .title(function(d) {
      for(var i=0; i<7; i++) {
        if(this.layer == eventName[i])
          return this.layer + ' : ' + d.value[i];
      }
    })
    .dimension(todayDim)
    .group(eventBarGroup, "POWER", sel_stack('0'))
    .mouseZoomable(true)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .gap(5)
    .round(d3.time.day.round)
    .xUnits(function(){return 10;})
    .colors(d3.scale.ordinal().range(["#EDC951", "#CC333F", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399"]))
    /*.renderLabel(true)*/;

  eventBar.legend(dc.legend());
  dc.override(eventBar, 'legendables', function() {
    var items = eventBar._legendables();
    return items.reverse();
  });
 for(var i = 1; i<7; ++i)
   eventBar.stack(eventBarGroup, eventName[i], sel_stack(i));

/*eventChart.on('pretransition', function(eventChart) {
    eventChart. selectAll('.dc-legend-item test')
        .text('')
      .append('tspan')
        .text(function(d) { return d.key + '(' + Math.floor(d.value / all.value() * 100) + '%)'; })

  });*/
 //   eventChart.ordinalColors(['#3182bd', '#9ecae1', '#e6550d', '#fd8d3c', '#fdd0a2', '#31a354', '#a1d99b',  '#756bb1'])
// d3.scale.ordinal().range(["#EDC951","#CC333F","#00A0B0"]);
/* dc.seriesChart('#hourSeries') */
/*  hourSeries
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
     .margins({top: 20, right: 45, bottom: 40, left: 50})
     .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
     .x(d3.time.scale().domain([minDate, maxDate]))
    .brushOn(false)
    .clipPadding(10)
    .elasticY(true)
    .dimension(seriesDim)
    .group(seriesGroup)
    .colors(d3.scale.ordinal().range(["#CC333F","#00A0B0","#EDC951","#756bb1"]))
    .mouseZoomable(true)
    .seriesAccessor(function(d) {
      if(d.key[0] === 1) return 'active_power'; else if(d.key[0] === 33) return 'vibration'; else if(d.key[0] === 17) return 'als_level'; else if(d.key[0] === 81) return 'status_power_meter'; else return null;})
    .keyAccessor(function(d) {
     return d.key[1];     })
    .valueAccessor(function(d) {
      return +d.value.max;})
    .legend(dc.legend().x(window.innerWidth*0.3).y(window.innerWidth*0.3*0.4).itemHeight(13).gap(15));
    hourSeries.yAxis().tickFormat(function(d){  return d3.format('.d')(d); });
    hourSeries.margins().left += 40;  */

  /*  dc.compositeChart("#avgCom")  */
    var active = 0, vibration = 0, vibX = 0, vibY = 0, vibZ = 0;
    avgCom
/*      .renderArea(true)
      .renderHorizontalGridLines(true)*/
      .width(window.innerWidth*0.4)
      .height((window.innerWidth*0.4)*0.5)
       .margins({top: 20, right: 45, bottom: 40, left: 50})
      .dimension(todayDim)
      .transitionDuration(500)
//      .elasticY(true)
      .y(d3.scale.linear().domain([0, 150]))
      .rangeChart(avgVib)
      .brushOn(false)
      .mouseZoomable(true)
      .x(d3.time.scale().domain([minDate, maxDate]))
      .round(d3.time.day.round)
   //   .yAxisLabel("Date")
      .title(function(d) {
        return "\nNumber of Povetry: " + d.key;
      })
      .legend(dc.legend().x(100).y(20).itemHeight(13).gap(5).horizontal(true))
      .compose([
          dc.lineChart(avgCom).group(vibrationGroup, "Vibration")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibration = d.value.avg;
             return vibration; })
            .colors('#756bb1'),
          dc.lineChart(avgCom).group(activeGroup, "ActivePower")
            .valueAccessor(function(d) {
              if(d.value.avg != 0)
                active = d.value.avg;
              return active;  })
            .colors('#EDC951'),
        ]);

/*  dc.compositeChart("#avgVib")  */
    avgVib
//      .renderArea(true)
      .width(window.innerWidth*0.4)
      .height((window.innerWidth*0.4)*0.5)
       .margins({top: 20, right: 45, bottom: 40, left: 50})
      .dimension(todayDim)
      .transitionDuration(500)
      .y(d3.scale.linear().domain([0,150]))
//      .elasticY(true)
      .brushOn(false)
      .mouseZoomable(true)
      .rangeChart(avgCom)
      .x(d3.time.scale().domain([minDate, maxDate]).nice(d3.time.day))
      .xUnits(function(){return 20;})      
       .round(d3.time.day.round)
//      .alwaysUseRounding(true)
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
            .colors('#756bb1'),
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
            .colors('pink'),
          dc.lineChart(avgVib).group(vibrationZGroup, "Z")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibZ = d.value.avg;
             return vibZ; })
            .colors('green')
        ]);

/*  dc.barChart("#volumeMax")  */
volumeMax
  .width(window.innerWidth*0.4)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 0, right: 50, bottom: 40, left: 40})
  .dimension(timeMaxDim)
  .group(volumeMaxGroup)
  .brushOn(true)
  .centerBar(true)
  .gap(1)
  .x(d3.time.scale().domain([minDate, maxDate]))
  .round(d3.time.hours.round)
  .alwaysUseRounding(true)
  .xUnits(d3.time.hours)

var apM = 0, vibM = 0;
var apL = 0, vibL = 0;
/*  dc.barChart("#apMax")  */
apMax
  .width((window.innerWidth*0.4)*0.5)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 20, right: 45, bottom: 40, left: 50})
  .dimension(timeMaxDim)
  .group(apMaxGroup)
  .transitionDuration(500)
  .centerBar(true)
  .gap(1)                    // bar width
  .x(d3.time.scale().domain([minDate, maxDate]))
  .xUnits(d3.time.hours)
  .elasticY(true)
  .renderHorizontalGridLines(true)
  .colors('#EDC951')
  .valueAccessor(function (d){
    return d.value.max;
  }) ;

/*  dc.barChart("#vibMax")  */
vibMax
  .width((window.innerWidth*0.4)*0.5)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 20, right: 45, bottom: 40, left: 50})
  .dimension(timeMaxDim)
  .group(vibMaxGroup)
  .transitionDuration(500)
  .centerBar(true)
  .gap(1)                    // bar width
  .x(d3.time.scale().domain([minDate, maxDate]))
  .xUnits(d3.time.hours)
  .elasticY(true)
  .renderHorizontalGridLines(true)
  .colors('#756bb1')
  .valueAccessor(function (d){
    return d.value.max;
  }) ;

/*  dc.barChart("#noDMax")  */
noDMax
  .width((window.innerWidth*0.4)*0.5)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 20, right: 45, bottom: 40, left: 50})
  .dimension(timeMaxDim)
  .group(noDMaxGroup)
  .transitionDuration(500)
  .centerBar(true)
  .gap(1)                    // bar width
  .x(d3.time.scale().domain([minDate, maxDate]))
  .xUnits(d3.time.hours)
  .elasticY(true)
  .renderHorizontalGridLines(true)
  .colors('#6BEC62')
  .valueAccessor(function (d){
    return d.value.max;
  }) ;

/*  dc.barChart("#noFMax")  */
noFMax
  .width((window.innerWidth*0.4)*0.5)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 20, right: 45, bottom: 40, left: 50})
  .dimension(timeMaxDim)
  .group(noFMaxGroup)
  .transitionDuration(500)
  .centerBar(true)
  .gap(1)                    // bar width
  .x(d3.time.scale().domain([minDate, maxDate]))
  .xUnits(d3.time.hours)
  .elasticY(true)
  .renderHorizontalGridLines(true)
  .colors('#2F9D27')
  .valueAccessor(function (d){
    return d.value.max;
  }) ;

  function rangesEqual(range1, range2) {
    if (!range1 && !range2) {
        return true;
    }
    else if (!range1 || !range2) {
        return false;
    }
    else if (range1.length === 0 && range2.length === 0) {
        return true;
    }
    else if (range1[0].valueOf() === range2[0].valueOf() &&
        range1[1].valueOf() === range2[1].valueOf()) {
        return true;
    }
    return false;
}
   volumeMax.focusCharts = function (chartlist) {
        if (!arguments.length) {
            return this._focusCharts;
        }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };
    volumeMax.focusCharts([apMax, vibMax, noDMax, noFMax]);

/*  dc.lineChart("#gapVib")  */
  var vMin=0, vGap=0;
  gapVib
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .transitionDuration(100)
    .margins({top: 40, right: 20, bottom: 25, left: 40})
    .dimension(todayDim)
    .mouseZoomable(true)
    .x(d3.time.scale().domain([minDate, maxDate ]))
    .round(d3.time.day.round)
    .xUnits(d3.time.days)
    .elasticY(true)
    .renderArea(true)
    .renderHorizontalGridLines(true)    
    .legend(dc.legend().x(100).y(10).itemHeight(13).gap(10).horizontal(true))
    .brushOn(false)
    .group(gapVibGroup, 'Min')
    .valueAccessor(function (d) {
        if (vMin == 0)
          vMin = d.value.min
        vMin = vMin < d.value.min ? vMin : d.value.min;
        return vMin;
    })
    .stack(gapVibGroup, 'Max', function (d) {
        vGap = vGap > d.value.gap ? vGap : d.value.gap;
        return vGap;
    })
    .title(function (d) {
        var value = d.value.min ? d.value.min : d.value;
        if (isNaN(value)) {
            value = 0;
        }
        return value;
    });


timeMax
      .width(window.innerWidth*0.4)
      .height((window.innerWidth*0.4)*0.5)
       .margins({top: 40, right: 20, bottom: 25, left: 40})
      .dimension(timeMaxDim)
      .transitionDuration(500)
//      .elasticY(true)
     .y(d3.scale.linear().domain([0, 300]))
      .rangeChart(avgVib, avgCom)
      .brushOn(false)
      .mouseZoomable(true)
      .x(d3.time.scale().domain([yesDate, maxDate]))
          .xUnits(d3.time.hours)
   //   .yAxisLabel("Date")
 //     .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
//      .renderHorizontalGridLines(true)
      .legend(dc.legend().x(100).y(10).itemHeight(13).gap(5).horizontal(true))
      .title(function(d) {
        return "\nDate : " + d.key;
      })
      .compose([
          dc.lineChart(timeMax).group(apMaxGroup, "active_power")
            .valueAccessor(function(d){
              if(d.value.max != 0)
                apM = d.value.max;
             return apM; })
            .colors('#EDC951'),
          dc.lineChart(avgVib).group(vibMaxGroup, "vibration")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibM = d.value.avg;
                return vibM; })
            .colors('#756bb1'),
        ]);

      /*  dc.compositeChart("#avgVib")  */
  var translate = 15;
    groupBar
//      .renderArea(true)
      .width(window.innerWidth*0.4)    
      .height((window.innerWidth*0.4)*0.5)
      .margins({top: 40, right: 20, bottom: 25, left: 40})
      .dimension(timeMaxDim)
      .transitionDuration(500)
//      .y(d3.scale.linear().domain([0,150])) 
      .elasticY(true)
      .brushOn(false)
      .mouseZoomable(true)
//      .x(d3.time.scale().domain([minDate, maxDate]).nice(d3.time.day)) 
      .x(d3.time.scale().domain([minDate, maxDate])) 
       .round(d3.time.day.round)
//      .alwaysUseRounding(true)
   //   .yAxisLabel("Date")
 //     .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
//      .renderHorizontalGridLines(true)
      .legend(dc.legend().x(100).y(10).itemHeight(13).gap(5).horizontal(true))  
      .valueAccessor(function (d){
        return d.value;
      }) 
      .title(function(d) {
        return "\nNumber of Povetry: " + d.key;
      })
      .compose([                 
          dc.barChart(groupBar).gap(20).group(noDMaxGroup, "decibel")
            .valueAccessor(function(d){              
              if(d.value.avg != 0)
                vibX = d.value.max;                
             return vibX; })
            .colors('#E2F2FF'),
          dc.barChart(groupBar).gap(20).group(noFMaxGroup, "frequency")
            .valueAccessor(function(d){
              if(d.value.avg != 0)
                vibY = d.value.max;
                return vibY; })
            .colors('pink')
            .useRightYAxis(true)
            .y(d3.scale.linear().domain([0,150])) 
              
        ])
      .renderlet(function (chart) {
         chart.selectAll("g._1").attr("transform", "translate(" + translate + ", 0)");
      });
/*volumeChart
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.8)
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

    dc.renderAll();
});

}