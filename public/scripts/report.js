

d3.json("/reports/NYX4", function(err, data){
  if(err) throw error;

  data.forEach(function(d){
    d.EVENT_TYPE = d.EVENT_TYPE;
    console.log(d);
  });

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var eventDim = nyx.dimension(function(d) {
    var event = '';
    switch(d.EVENT_TYPE){
      case 1 :
        event = 'POWER';
        break;
      case 17 :
        event = 'POWER';
        break;
      case 33 : 
        event = 'POWER';
        break;
      case 49 :
        event = 'POWER';
        break;
      case 65 :
        event = 'GPS';
        break;
      case 81 : 
        event = 'POWER';
        break;
      case 153 :
        event = 'REBOOT';
        break;

    }
    console.log(d.EVENT_TYPE);
    console.log(event);
    return event;
  })

  var eventChart = dc.pieChart('#eventChart');

  eventChart  /* dc.pieChart('#eventChart') */
    .width(300)
    .height(300)
    .radius(200)
    .dimension()
    .group()
    .label(function(d){
    }) 

});