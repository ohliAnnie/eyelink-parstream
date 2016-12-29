  function report(){

  var eventChart = dc.pieChart('#eventChart');
  var eventBar = dc.barChart('#eventBar');
  var eventSeries = dc.seriesChart('#eventSeries');
  var eventHeat = dc.heatMap("#eventHeat");
  var dayBubble = dc.bubbleChart("#dayBubble");
  var scatterSeries = dc.seriesChart("#scatterSeries");
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


// TODO :  날짜 자동 계산
    var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
    var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
    var numberFormat = d3.format('.2f');
/*    var maxDate = new Date();
    var minDate  = addDays(new Date(), -7);
*/
var minDate = new Date(2016,11,01);
  var maxDate = new Date(2016,11,07,24,0,0); 

  var eventName = ["POWER", "ALS", "VIBRATION", "NOISE", "GPS", "STREET LIGHT", "DL", "REBOOT"];
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Data Setting
  data.rtnData.forEach(function(d){
    var a = d.event_time.split(" ");
    var b = a[0].split("-");
    var t = a[1].split(":");
    d.dd = new Date(b[0], (b[1]-1), b[2], t[0], t[1], t[2]);
    d.today = d3.time.day(d.dd);
    d.month = d3.time.month(d.dd);
    d.hour = d3.time.hour(d.dd);    
    switch(d.event_type){
      case "1" :   // 피워
        d.index = 0;
        d.event_name = 'POWER';        
        d.active_power  = parseFloat(d.active_power);
        d.als_level = 0;
        d.vibration_x = 0;
        d.vibration_y = 0;
        d.vibration_z =  0;
        d.noise_decibel= 0;
        d.noise_frequency = 0;
        d.status_power_meter = 0; 
        break;
      case "17" :   // 조도
        d.index = 1;
        d.event_name = 'ALS';
        d.als_level = parseInt(d.als_level);
        d.active_power  = 0;
        d.vibration_x = 0;
        d.vibration_y = 0;
        d.vibration_z =  0;
        d.noise_decibel= 0;
        d.noise_frequency = 0;
        d.status_power_meter = 0; 
        break;
      case "33" :     // 진동
        d.index = 2;
        d.event_name = 'VIBRATION';
        d.vibration_x = parseFloat(d.vibration_x);
        d.vibration_y = parseFloat(d.vibration_y);
        d.vibration_z =  parseFloat(d.vibration_z);
        d.vibration = (d.vibration_x+d.vibration_y+d.vibration_z)/3;
        d.active_power  = 0;        
        d.als_level = 0;
        d.noise_decibel= 0;
        d.noise_frequency = 0;
        d.status_power_meter = 0; 
        break;
      case "49" :    // 노이즈
        d.index = 3;
        d.noise_decibel= parseInt(d.noise_decibel);
        d.noise_frequency = parseInt(d.noise_frequency);
        d.event_name = 'NOISE';
        d.active_power  = 0;
        d.als_level = 0;
        d.vibration_x = 0;
        d.vibration_y = 0;
        d.vibration_z =  0;
        d.status_power_meter = 0; 
        break;
      case "65" :    // GPS
        d.index = 4;
        d.event_name = 'GPS';
        d.active_power  = 0;
        d.vibration_x = 0;
        d.vibration_y = 0;
        d.vibration_z =  0;
        d.noise_decibel= 0;
        d.noise_frequency = 0;
        d.status_power_meter = 0; 
        break;
      case "81" :     // 센서상태
        d.index = 5;
        d.status_power_meter = parseInt(d.status_power_meter);         
        d.event_name = 'STREET LIGHT';   
        d.active_power  = 0;
        d.als_level = 0;
        d.vibration_x = 0;
        d.vibration_y = 0;
        d.vibration_z =  0;
        d.noise_decibel= 0;
        d.noise_frequency = 0;        
        break;
      case "97" : 
        d.index = 6;
        d.event_name = "DL";
        d.active_power  = 0;
        d.als_level = 0;
        d.vibration_x = 0;
        d.vibration_y = 0;
        d.vibration_z =  0;
        d.noise_decibel= 0;
        d.noise_frequency = 0;
        d.status_power_meter = 0; 
        break;
      case "153" :    // 재부팅
        d.index = 7;
        d.event_name = 'REBOOT';
        d.active_power  = 0;
        d.als_level = 0;
        d.vibration_x = 0;
        d.vibration_y = 0;
        d.vibration_z =  0;
        d.noise_decibel= 0;
        d.noise_frequency = 0;
        d.status_power_meter = 0;         
        break;       
    }        
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
        break ;
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

// Dimension by hour
var timeMaxDim = nyx.dimension(function(d) {  
  return d.hour;
});

var volumeMaxGroup = timeMaxDim.group().reduceSum(function(d) {  
  return 1;
});

var apMaxGroup = timeMaxDim.group().reduce(
  function (p, v) {
    if(v.event_type ==  "1") { // 파워
      p.max = p.max < v.active_power ? v.active_power : p.max;      
    }    
    return p;
  },
  function (p, v) {
    if(v.event_type ==  "1") { // 파워
      p.max = p.max < v.active_power ? v.active_power : p.max;      
    }    
    return p;
  },
  function() {
    return { max:0}
  }
);

var vibMaxGroup = timeMaxDim.group().reduce(
  function (p, v) {
    if(v.event_type ==  "33") { // 파워
      p.max = p.max < v.vibration ? v.vibration : p.max;      
    } 
    return p;
  },
  function (p, v) {
    if(v.event_type ==  "33") { // 파워
      p.max = p.max < v.vibration ? v.vibration : p.max;      
    } 
    return p;
  },
  function() {
    return { max:0 }
  }
);
var noDMaxGroup = timeMaxDim.group().reduce(
  function (p, v) {
    if(v.event_type ==  "49") { // 노이즈
      p.max = p.max < v.noise_decibel ? v.noise_decibel : p.max;
    }
    return p;
  },
  function (p, v) {
    if(v.event_type ==  "49") { // 노이즈
      p.max = p.max < v.noise_decibeloi ? v.noise_decibel : p.max;
    }
    return p;
  },
  function() {
    return { max:0 }
  }
);
var noFMaxGroup = timeMaxDim.group().reduce(
  function (p, v) {
    if(v.event_type ==  "49") { // 노이즈
      p.max = p.max < v.noise_frequency ? v.noise_frequency : p.max;
    }
    return p;
  },
  function (p, v) {
    if(v.event_type ==  "49") { // 노이즈
      p.max = p.max < v.noise_frequency ? v.noise_frequency : p.max;
    }
    return p;
  },
  function() {
    return { max:0 }
  }
);

/* dc.pieChart('#eventChart') */
  eventChart 
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .radius((window.innerWidth*0.4)*0.2)
    .dimension(eventDim)
    .group(eventGroup)    
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
    .colors(d3.scale.ordinal().range(["#EDC951", "#CC333F", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399", "#FFB2F5"]));

/* dc.heatMap("#eventHeat")  */
  eventHeat
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 20, right: 40, bottom: 30, left: 45})
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
    .margins({top: 15, right: 40, bottom: 35, left: 40})
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
    .xAxisLabel('Noise Frequecy')
    .yAxisLabel('Noise Decibel')
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

/*dc.seriesChart('#eventSeries')*/
// FIXME : 필터링 적용
  eventSeries
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
    .margins({top: 10, right: 40, bottom: 35, left: 105})
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.day.round)
    .xUnits(d3.time.days)
    .brushOn(false)
    .yAxisLabel("Count")
    .xAxisLabel("Time")
    .colors(d3.scale.ordinal().range(["#CC333F", "#31a354", "#EDC951","#00A0B0", "#756bb1"]))
    .clipPadding(10)
    .renderHorizontalGridLines(true)
    .elasticY(true)
    .dimension(eventSeriesDim)
    .group(eventSeriesGroup)
    .seriesAccessor(function(d) {return d.key[0];})
    .keyAccessor(function(d) {return +d.key[1];})
    .valueAccessor(function(d) {
      return +d.value;})
    .legend(dc.legend().x(10).y(0).itemHeight(13).gap(5).legendWidth(140).itemWidth(70));
  eventSeries.yAxis().tickFormat(function(d) {return d;});
  eventSeries.margins().left += 40;

/*  dc.barChart('#eventBar')  */
    function sel_stack(i) {
        return function(d) {            
            return d.value[i]?d.value[i]:0;
        };
    }
  eventBar
    .width(window.innerWidth*0.4)
    .height((window.innerWidth*0.4)*0.5)
    .margins({left: 160, top: 15, right: 10, bottom: 25})
    .brushOn(false)
    .clipPadding(10)
    .transitionDuration(500)
    .title(function(d) {
      for(var i=0; i<8; i++) {
        if(this.layer == eventName[i])
          return this.layer + ' : ' + d.value[i];
      }
    })
    .dimension(todayDim)
    .group(eventBarGroup, "POWER", sel_stack('0'))
    .mouseZoomable(true)
    .renderHorizontalGridLines(true)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .gap(5)
    .round(d3.time.day.round)
    .xUnits(function(){return 10;})
    .colors(d3.scale.ordinal().range(["#EDC951", "#CC333F", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399", "#FFB2F5"]))
    /*.renderLabel(true)*/;
  eventBar.legend(dc.legend());
  dc.override(eventBar, 'legendables', function() {
    var items = eventBar._legendables();
    return items.reverse();
  });
 for(var i = 1; i<8; ++i){
   eventBar.stack(eventBarGroup, eventName[i], sel_stack(i));
 }

/*  dc.barChart("#volumeMax")  */
volumeMax
  .width(window.innerWidth*0.4)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 15, right: 50, bottom: 40, left: 40})
  .transitionDuration(500)
  .dimension(timeMaxDim)
  .group(volumeMaxGroup)
  .brushOn(true)
  .centerBar(true)
  .gap(1)
  .x(d3.time.scale().domain([minDate, maxDate]))
  .round(d3.time.hours.round)
  .alwaysUseRounding(true)
  .renderHorizontalGridLines(true)
  .xUnits(d3.time.hours)

/*  dc.barChart("#apMax")  */
apMax
  .width((window.innerWidth*0.4)*0.5)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 20, right: 45, bottom: 40, left: 50})
  .dimension(timeMaxDim)
  .group(apMaxGroup)
  .transitionDuration(500)
  .brushOn(false)
  .centerBar(true)
  .gap(1)                    // bar width
  .x(d3.time.scale().domain([minDate, maxDate]))
  .xUnits(d3.time.hours)
  .elasticY(true)
  .renderHorizontalGridLines(true)
  .colors('#EDC951')
  .valueAccessor(function (d){

    return numberFormat(d.value.max);
  }) ;

/*  dc.barChart("#vibMax")  */
vibMax
  .width((window.innerWidth*0.4)*0.5)
  .height((window.innerWidth*0.4)*0.5)
  .margins({top: 20, right: 40, bottom: 40, left: 50})
  .dimension(timeMaxDim)
  .group(vibMaxGroup)
  .transitionDuration(500)
  .brushOn(false)
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
  .margins({top: 20, right: 40, bottom: 40, left: 50})
  .dimension(timeMaxDim)
  .group(noDMaxGroup)
  .transitionDuration(500)
  .brushOn(false)
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
  .margins({top: 20, right: 40, bottom: 40, left: 50})
  .dimension(timeMaxDim)
  .group(noFMaxGroup)
  .transitionDuration(500)
  .brushOn(false)
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
        console.log(this);
        return this;
    };
    volumeMax.focusCharts([apMax, vibMax, noDMax, noFMax]);

  /*  dc.compositeChart("#avgCom")  */
    var active = 0, vibration = 0, vibX = 0, vibY = 0, vibZ = 0;
    avgCom
/*      .renderArea(true)
      .renderHorizontalGridLines(true)*/
      .width(window.innerWidth*0.4)
      .height((window.innerWidth*0.4)*0.5)
       .margins({top: 20, right: 40, bottom: 30, left: 40})
      .dimension(todayDim)
      .transitionDuration(500)
//      .elasticY(true)
      .y(d3.scale.linear().domain([0, 150]))
      .rangeChart(avgVib)
      .brushOn(false)
      .mouseZoomable(true)
      .x(d3.time.scale().domain([minDate, maxDate]))
      .round(d3.time.day.round)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
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
       .margins({top: 20, right: 0, bottom: 30, left: 40})
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
    .renderVerticalGridLines(true)
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

  /*  dc.compositeChart("#avgVib")  */
  var translate = 15;
    groupBar
//      .renderArea(true)
      .width(window.innerWidth*0.4)    
      .height((window.innerWidth*0.4)*0.5)
      .margins({top: 40, right: 60, bottom: 25, left: 40})
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
      .renderHorizontalGridLines(true)    
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
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
//    .rangeChart(volumeMax)
    .seriesAccessor(function(d) {
      return eventName[d.key[0]];})
    .keyAccessor(function(d) {return +d.key[1];})
    .valueAccessor(function(d) {return +d.value.max;})
    .colors(d3.scale.ordinal().range(["#CC333F", "#EDC951", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399", "#FFB2F5"]))
    .legend(dc.legend().x(10).y(0).itemHeight(13).gap(5).legendWidth(140).itemWidth(70));

    dc.renderAll();
});

}