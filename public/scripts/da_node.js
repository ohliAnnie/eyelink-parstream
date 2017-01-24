function drawChart() {

  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  if ($('#factor0').is(':checked') === true) {
    var factor = $('#factor0').val();
  } else if ($('#factor1').is(':checked') === true) {
    var factor = $('#factor1').val();
  } else if ($('#factor2').is(':checked') === true) {
    var factor = $('#factor2').val();
  } else if ($('#factor3').is(':checked') === true) {
    var factor = $('#factor3').val();
  } 
  $.ajax({
    url: "/analysis/restapi/getClusterNodePower" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;        
        var set = [];
        var max = 0;
        console.log(sdate+','+edate);
        data.forEach(function(d){
          var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
          d.event_time = df.parse(d.event_time);
         if(factor === 'ampere') {
          set.push({ time:d.event_time, id: d.node_id, value: parseFloat(d.ampere)});
          if(d.ampere > max)
            max = d.ampere;
         } else if(factor === 'voltage') {
          set.push({ time:d.event_time, id: d.node_id, value: parseFloat(d.voltage)});
          if(d.voltage > max)
            max = d.voltage;
        } else if(factor === 'active_power') {
          set.push({ time:d.event_time, id: d.node_id, value: parseFloat(d.active_power) });        
          if(d.active_power > max)
            max = d.active_power;
        } else if(factor === 'power_factor') {
          set.push({ time:d.event_time, id: d.node_id, value: parseFloat(d.power_factor) });
          if(d.power_factor > max)
            max = d.power_factor;
        }
        });
        drawNode(set, sdate, edate, max);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawNode(data, sdate, edate, max) {
  var nodeLine = dc.seriesChart('#nodeLine');

  var minDate = new Date(sdate);  
  var maxDate = new Date(edate);

  var nyx = crossfilter(data);

  idDim = nyx.dimension(function(d) { return [d.id, d.time]; });  
  timeGroup = idDim.group().reduceSum(function(d) {  return d.value; });

  nodeLine
    .width(window.innerWidth*0.3)
    .height(385)
    .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
    .x(d3.time.scale().domain([minDate, maxDate ]))
    .round(d3.time.second.round)
    .xUnits(d3.time.seconds)
//    .y(d3.scale.linear().domain([0, (max*2)]))
    .elasticY(true)
    .brushOn(false)
    .yAxisLabel("value")
    .xAxisLabel("Time")
    .clipPadding(10)
    .dimension(idDim)
    .group(timeGroup)
    .mouseZoomable(true)
    .seriesAccessor(function(d) {
      return "Id: " + d.key[0];})
    .keyAccessor(function(d) {return d.key[1];})
    .valueAccessor(function(d) {return d.value;})
    .legend(dc.legend().x(window.innerWidth*0.1).y(0).itemHeight(13).gap(5).legendWidth(140).itemWidth(70));  

  
  dc.renderAll();


}