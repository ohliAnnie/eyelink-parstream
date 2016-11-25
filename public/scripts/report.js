  var eventChart = dc.pieChart('#eventChart');

d3.json("/reports/restapi/getReportRawData", function(err, data){
  if(err) throw error;
     console.log(data.rtnData[0]);
  data.rtnData[0].forEach(function(d){
        var event = '';
    switch(d.event_type){
      case "1" :   // 피워
        event = 'POWER';
        break;   
      case "17" :   // 조도
        event = 'ALS';
        break;    
      case "33" :     // 진동
        event = 'VIBRATION';
        break;
      case "49" :    // 노이즈
        event = 'NOISE';
        break;
      case "65" :    // GPS
        event = 'GPS';
        break;
      case "81" :     // 센서상태
        event = 'STREET LIGHT';
        break;
      case "153" :    // 재부팅
        event = 'REBOOT';
        break;
    }
    d.event_name= event;
  });

  var nyx = crossfilter(data.rtnData[0]);
  var all = nyx.groupAll();

  var eventDim = nyx.dimension(function(d) {
    console.log(d.event_name);
    return d.event_name;
  });

  var eventGroup = eventDim.group();

  eventChart  /* dc.pieChart('#eventChart') */
    .radius(150)
    .dimension(eventDim)
    .group(eventGroup)
    .label(function (d){
        if(eventChart.hasFilter() && !eventChart.hasFilter(d.key)) {
          return d.key + '(0%)';
        }
        var label = d.key;
        console.log(d.key);
        if(all.value()) {
          label += label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
        }
        return label;
    });
 //   eventChart.ordinalColors(['#3182bd', '#9ecae1', '#e6550d', '#fd8d3c', '#fdd0a2', '#31a354', '#a1d99b',  '#756bb1'])

    dc.renderAll();
});