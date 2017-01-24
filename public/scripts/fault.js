
function drawMap() {

  function drawMarkerSelect(data) {
    var xf = crossfilter(data);
    var groupname = "marker-select";
    var facilities = xf.dimension(function(d) { return d.geo; });
    var facilitiesGroup = facilities.group().reduceCount();
    console.log('facilitiesGroup : %s', facilitiesGroup.size());
    dc_leaflet.markerChart("#bubble-map .map",groupname)
        .dimension(facilities)
        .group(facilitiesGroup)
        .width(600)
        .height(400)
        .center([37.467271, 127.042861])
        .zoom(13)
        .cluster(true);
    dc.renderAll(groupname);
  }
  function drawMarkerArea(data) {
    var xf = crossfilter(data);
    var groupname = "marker-area";
    var facilities = xf.dimension(function(d) { return d.geo; });
    var facilitiesGroup = facilities.group().reduceCount();
    dc.leafletMarkerChart("#bubble-map .map",groupname)
        .dimension(facilities)
        .group(facilitiesGroup)
        .width(600)
        .height(400)
        .center([37.467271, 127.042861])
        .zoom(8)
        .renderPopup(false)
        .filterByArea(true);
    dc.renderAll(groupname);
  }
}

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
  var markerName = "dashboardChart";
  // var barchart = dc.barChart('#bar-chart');
  var volumeChart = dc.barChart('#volumn-chart', markerName);
  var moveChart = dc.lineChart('#move-chart', markerName);
  var plot01Chart = dc.boxPlot('#plot01-chart', markerName);
  var plot02Chart = dc.boxPlot('#plot02-chart', markerName);
  var plot03Chart = dc.boxPlot('#plot03-chart', markerName);
  var plot_pieChart = dc.pieChart("#plot_pie-chart", markerName);
  // var fluctuationChart = dc.barChart('#fluctuation-chart');
  var seriesChart = dc.seriesChart('#series-chart', markerName);
  var mapMarkerChart = dc_leaflet.markerChart("#bubble-map-map", markerName);
  var mapPieChart = dc.pieChart('#bubble-map-pie', markerName);

  d3.json("/dashboard/restapi/getDashboardRawData", function(err, out_data) {
    // if (err) throw Error(error);

    var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
    var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
    var numberFormat = d3.format('.2f');
    var maxDate = new Date();;
    var minDate  = addDays(new Date(), -20);
    // console.log(minDate);
    // console.log(maxDate);

    var maxDay = new Date();
    var minDay  = addDays(new Date(), -20);

    // {"node_id":"0001.00000001","event_time":"2016-11-25 15:42:34.0","event_type":"1",
    //  "active_power":19.618999481201172,"ampere":183.35400390625,"als_level":null,
    //  "dimming_level":null,"noise_decibel":0,"noise_frequency":null,"vibration_x":null,
    //  "vibration_y":null,"vibration_z":null}

    var data = out_data.rtnData;
    // console.log(out_data);

    var cnt_event_type = 0,
        cnt_fault_type = 0;
    data.forEach(function (d) {
      // console.log(d);
      // console.log('date : ' + df.parse("2016-11-28"));
      d.dd = df.parse(d.event_time);
      d.month = d3.time.month(d.dd);
      d.day = d3.time.day(d.dd);
      d.hour = d.event_time.substring(11,13);
      // console.log(d.hour);

      // d.month = d3.time.month(d.dd); // pre-calculate month for better performance
      // d.VOLTAGE = +d.VOLTAGE;
      if (d.event_type == '81')
        d.event_type_fault = 1;
      d.ampere = d.ampere;
      // d.ampere += d.ampere;
      // d.POWER_FACTOR = +d.POWER_FACTOR;
      // d.active_power += d.active_power;
      // d.REACTIVE_POWER = +d.REACTIVE_POWER;
      // d.APPARENT_POWER = +d.APPARENT_POWER;
      // d.AMOUNT_OF_ACTIVE_POWER = +d.AMOUNT_OF_ACTIVE_POWER;
      // d.check = +0.85;
      // console.log(d);
      d.active_power += d.active_power;
      d.geo = d.gps_latitude + ',' + d.gps_longitude;
      // d.geo = (d.node_id === '0001.00000001') ? '37.457271, 127.042861':'37.468271, 127.032861';
    });

    // console.log(data);

    var ndx = crossfilter(data);

    drawMarkerSelect2(ndx, data, mapMarkerChart, mapPieChart);

    var moveDays = ndx.dimension(function (d) {
      return d.day;
    })

    var volumnByDayGroup = moveDays.group().reduceCount(function (d) {
      return d.event_type;
    })
    // console.log(ampereGroup);

    var faultCntByDayGroup = moveDays.group().reduce(
        // add
        function (p, v) {
          // console.log('add');
          ++p.hours;
          p.event_type_count += 1;
          return p;
        },
        // remove
        function (p, v) {
          // console.log('remove');
          --p.hours;
          p.event_type_count -= 1;
          return p;
        },
        // initial
        function () {
          // console.log('init');
          return {hours: 0, event_type_count: 0};
        }
    );

    console.log('moveDays.group() size : ' + moveDays.group().size());

    // Group by total movement within month
    var dailyMoveGroup = moveDays.group().reduceSum(function (d) {
      return d.event_type == '81'? 1 : 0;
    });

    var active_powerGroup = moveDays.groupAll().reduce(
          function (p, v) {
            console.log(v);
              ++p.n;
              p.tot += p.active_power;
              console.log(p);
              return p;
          },
          function (p, v) {
              --p.n;
              p.tot -= v.active_power;
              return p;
          },
          function () { return {n:0,active_power:0}; }
      );

    var avg_active_power = function(d) {
      console.log(d);
      return d.n ? d.tot / d.n : 0;
    };

    var apDim = ndx.dimension(function(d) {return "Active Power";});
    var apArrayGroup     = apDim.group().reduce(
      function(p,v) {
        p.push(v.active_power);
        return p;
      },
      function(p,v) {
        p.splice(p.indexOf(v.active_power), 1);
        return p;
      },
      function() {
        return [];
      }
    );

    var noiseDim = ndx.dimension(function(d) {return "Noise";});
    var noiseArrayGroup     = noiseDim.group().reduce(
      function(p,v) {
        p.push(v.noise_decibel);
        return p;
      },
      function(p,v) {
        p.splice(p.indexOf(v.noise_decibel), 1);
        return p;
      },
      function() {
        return [];
      }
    );

    var vibDim = ndx.dimension(function(d) {return "Vibration";});
    var vibArrayGroup     = vibDim.group().reduce(
      function(p,v) {
        p.push(v.vibration);
        return p;
      },
      function(p,v) {
        p.splice(p.indexOf(v.vibration), 1);
        return p;
      },
      function() {
        return [];
      }
    );

    var nodeDim = ndx.dimension(function(d) {
      return +d.event_type;}
    );
    var nodeGroup = nodeDim.group();

    var eventTypeDim = ndx.dimension(function (d) {
      return [+d.event_type, +d.hour];
    });

    // console.log('eventTypeDim.group() size : ' + eventTypeDim.group().size());
    var eventTypeGroup = eventTypeDim.group().reduceCount(function(d) {
      var p = 0;
      if (d.event_type == '1') {
        p = d.active_power;
      } else if (d.event_type == '17') {
        p = d.als_level;
      } else if (d.event_type == '33') {
        p = d.vibration;
      } else if (d.event_type == '49') {
        p = d.noise_decibel;
      } else {
        p = 0;
      }
      // console.log(d);
      // console.log('=> p : ' + p);
      return p;
    });

    volumeChart
      .width(600)
      .height(60)
      .margins({top: 0, right: 50, bottom: 20, left: 40})
      .dimension(moveDays)
      .group(volumnByDayGroup)
      .centerBar(true)
      .gap(1)
      .x(d3.time.scale().domain([minDate, maxDate]))
      .round(d3.time.day.round)
      .alwaysUseRounding(true)
      .xUnits(d3.time.days);

    moveChart
      .renderArea(true)
      // .width(620)
      // .height(150)
      .transitionDuration(1000)
      .margins({top: 30, right: 50, bottom: 25, left: 40})
      .dimension(moveDays)
      .mouseZoomable(true)
      .rangeChart(volumeChart)
      .x(d3.time.scale().domain([minDate, maxDate]))
      .round(d3.time.day.round)
      .xUnits(d3.time.days)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .legend(dc.legend().x(500).y(10).itemHeight(13).gap(5))
      .brushOn(false)
      .group(faultCntByDayGroup, 'Daily Event Count')
      .valueAccessor(function (d) {
        return d.value.event_type_count;
      })
      .stack(dailyMoveGroup, 'Daily Error Count', function (d) {
        return d.value;
      })
      // Title can be called by any stack layer.
      .title(function (d) {
        var value = d.value.event_type_count ? d.value.event_type_count : d.value;
        if (isNaN(value)) {
          value = 0;
        }
        return 'day : ' + dateFormat(d.key) + '\n count : ' + numberFormat(value);
      });

    plot01Chart
      // .width('100%')
      // .height(210)
      .margins({top: 10, right: 50, bottom: 30, left: 50})
      .dimension(apDim)
      .group(apArrayGroup)
      .elasticY(true)
      .elasticX(true);

    plot02Chart
      // .width(200)
      // .height(210)
      .margins({top: 10, right: 50, bottom: 30, left: 50})
      .dimension(noiseDim)
      .group(noiseArrayGroup)
      .elasticY(true)
      .elasticX(true);

    plot03Chart
      // .width(200)
      // .height(210)
      .margins({top: 10, right: 50, bottom: 30, left: 50})
      .dimension(vibDim)
      .group(vibArrayGroup)
      .elasticY(true)
      .elasticX(true);

    plot_pieChart
      // .width(150)
      // .height(140)
      .radius(60)
      .dimension(nodeDim)
      .group(nodeGroup);

    seriesChart
      // .width(620)
      // .height(210)
      .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
      .x(d3.scale.linear().domain([0,24]))
      .brushOn(false)
      .yAxisLabel("Values")
      .xAxisLabel("Time")
      .clipPadding(10)
      .renderHorizontalGridLines(true)
      .elasticY(true)
      .dimension(eventTypeDim)
      .group(eventTypeGroup)
      .mouseZoomable(true)
      .seriesAccessor(function(d) {
        // console.log(d);
        // console.log(d.key[0]);
        return "Event : " + d.key[0];
      })
      .keyAccessor(function(d) {
        return +d.key[1];
      })
      .valueAccessor(function(d) {
        // console.log(d);
        return +d.value;
      })
      .legend(dc.legend().x(520).y(10).itemHeight(13).gap(5).horizontal(1).legendWidth(50).itemWidth(50));
    seriesChart.yAxis().tickFormat(function(d) {return d;});
    seriesChart.margins().left += 40;

    // dc.renderAll();
    dc.renderAll(markerName);
  });
}

function processSocket() {
  // 소켓 이벤트 수행
  var socket = io.connect();

  socket.emit('getEventListForAlarm', 0);

  // 이벤트를 연결
  socket.on('refreshData', function(data) {
    // console.log(data);

    // 신규 Event List를 조회요청.
    socket.emit('getEventListForAlarm', 0);

    // display Count 4 type.
    displayCount();

    // draw Chart
    drawChart();

    // draw Map
    // drawMap();
  });

  // Event List 정보.
  socket.on('sendEventListForAlarm', function(data) {
    // console.log(data);
    // console.log(data.length);
    for (var i in data) {
      // console.log(data[i]);
      $('.tbl-alarm-list > tbody:first').prepend(makeAlarmList(data[data.length-i-1]));
    }
  })
}



