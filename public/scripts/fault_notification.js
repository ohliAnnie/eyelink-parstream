'use strict';
function drawMarkerSelect2(ndx, data, mapMarkerChart, mapPieChart) {
  // console.log(data);
  var dimGeo = ndx.dimension(function(d) { return d.geo; });
  var dimGeoGroup = dimGeo.group().reduceCount();
  console.log('dimGeoGroup : %s', dimGeoGroup.size());
  // console.log($('#bubble-map .map'));
  mapMarkerChart
      .dimension(dimGeo)
      .group(dimGeoGroup)
      // .width(600)
      // .height(400)
      .center([37.467271, 127.042861])
      .zoom(9)
      .cluster(true);
  var zone = ndx.dimension(function(d) { return d.zone_id; });
  var zoneGroup = zone.group().reduceCount();
  console.log('zoneGroup : %s', zoneGroup.size());
  mapPieChart
      .dimension(zone)
      .group(zoneGroup)
      .radius(55)
      // .width(150)
      // .height(150)
      .renderLabel(true)
      .renderTitle(true)
      .ordering(function (p) {
        return -p.value;
      });
  // dc.renderAll(groupname);
}

function drawChart() {
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  $.ajax({
    url: "/reports/restapi/getTbRawDataByPeriodPower" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;        
        drawPower(data, sdate, edate);
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

function drawPower(data, sdate, edate) {

    var markerName = "fault";
  var dayCount = dc.barChart('#dayCount', markerName);
  var groupCount = dc.pieChart('#groupCount', markerName);
  var dataTable = dc.dataTable('.dataTable', markerName);
  var mapMarkerChart = dc_leaflet.markerChart("#bubble-map-map", markerName);
  var mapPieChart = dc.pieChart('#bubble-map-pie', markerName);

  var minDate = new Date(sdate);  
  var maxDate = new Date(edate);

  var group_id = new Array();

  var msHour = 1000*60*60;
  var gap = (maxDate-minDate)/(24 * msHour);
  var maxCnt = 0;
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];  
   // 데이터 가공
  var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
  var timeFormat = d3.time.format.utc("%H:%M");
  data.forEach(function(d) {          
    var a = d.event_time.split(" ");
    var b = a[1].split(":");
    d.date = d.event_time;
    d.event_time = df.parse(d.event_time);
    d.today = d3.time.day(d.event_time);        
    d.ampere = parseFloat(d.ampere);
    d.apparent_power = parseFloat(d.apparent_power);    
    d.active_power = parseFloat(d.active_power);
    d.amount_active_power = parseFloat(d.amount_active_power);
    d.voltage = parseFloat(d.voltage);         
    d.geo = d.gps_latitude + ',' + d.gps_longitude;
     if(d.zone_id === 'ZONE-4')
          d.zone_id = 'ZONE-04';
  });

  var nyx = crossfilter(data);
  var all = nyx.groupAll();
 
 drawMarkerSelect2(nyx, data, mapMarkerChart, mapPieChart);

// Dimension by today
  var todayDim = nyx.dimension(function (d) {  return d.today;   });
  var powerSumGroup = todayDim.group().reduceCount(function(d) {
    return 1;
  });

// Dimension by Node_ID
  var zoneDim = nyx.dimension(function(d) {               
    return d.zone_id; });
  var zonePieGroup = zoneDim.group().reduceCount(function(d) {        
    return 1;
  });

   /* dc.barChart('#dayCount') */
  dayCount
    .width(window.innerWidth*0.3)
    .height((window.innerWidth*0.4)*0.5)
    .margins({top: 15, right: 50, bottom: 40, left: 40})
    .transitionDuration(500)
    .dimension(todayDim)
    .group(powerSumGroup)
    .elasticY(true)
    .brushOn(true)
    .centerBar(true)
    .gap(gap)         
    .x(d3.time.scale().domain([minDate, maxDate]))
    .round(d3.time.days.round)
    .alwaysUseRounding(true)
    .renderHorizontalGridLines(true)
    .xUnits(d3.time.days);

  /* dc.pieChart('#groupCount') */
groupCount
    .width(window.innerWidth*0.2)
    .height((window.innerWidth*0.4)*0.5)
    .radius((window.innerWidth*0.3)*0.2)
    .dimension(zoneDim)
    .group(zonePieGroup)    
    .drawPaths(true)
    .legend(dc.legend())    
    .renderLabel(true);
/*    .colors(d3.scale.ordinal().range(["#EDC951", "#CC333F", "#756bb1", "#31a354", "#fd8d3c", "#00A0B0", "#003399", "#FFB2F5"]));*/

  /* dc.dataTable('.dataTable') */
dataTable
    .dimension(todayDim)
    .group(function (d) {
            var format = d3.format('02d');
            return d.today.getFullYear() + '/' + format((d.today.getMonth() + 1)) + '/' + format(d.today.getDate());
     })
    .size(10)     
    .columns([ 
             {
                label : 'date',
                format: function(d) {
                  var a = d.date.split('.')
                  return a[0];
                }
              },            
             'zone_id',
             'node_id',
            'ampere',
            'voltage',
            'active_power',            
            'amount_active_power',
            'apparent_power'
    ])
    .sortBy(function (d) {        return d.event_time;    })    
    .order(d3.ascending)    
    .on('renderlet', function (table) {
        table.selectAll('.dataTable').classed('info', true);
    });
  dc.renderAll(markerName);

  
}

