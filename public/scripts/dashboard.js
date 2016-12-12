'use strict';
function displayCount() {
  var bill = new Odometer({ el: $('#bill')[0], format: '(,ddd).dd' });
  var pbill = new Odometer({ el: $('#pbill')[0], format: '(,ddd).dd' });
  var power = new Odometer({ el: $('#power')[0], format: '(,ddd)' });
  var ppower = new Odometer({ el: $('#ppower')[0], format: '(,ddd)' });
  var eventCount = new Odometer({ el: $('#event-count')[0], format: '(,ddd)' });
  var peventCount = new Odometer({ el: $('#pevent-count')[0], format: '(,ddd)' });
  var falutCount = new Odometer({ el: $('#fault-count')[0], format: '(,ddd)' });
  var pfalutCount = new Odometer({ el: $('#pfault-count')[0], format: '(,ddd)' });
  $.ajax({
    url: "/dashboard/restapi/getDashboardSection1",
    dataType: "json",
    type: "GET",
    data: '',
    success: function(result) {
      // console.log(result);
      if (result.rtnCode.code == "0000") {
        // TO-DO json data 수신 방식 점검 필요 by 배성한
        //- $("#successmsg").html(result.message);
        var data = result.rtnData[0][0];
        bill.update(data.today_power_charge);
        pbill.update(data.active_power_percent);
        //- if (data.active_power_percent < 0) {
        //-   pbill.attr('class','growth down');
        //- } else {
        //-   pbill.attr('class','growth up');
        //- }
        power.update(data.today_active_power);
        ppower.update(data.active_power_percent)
        eventCount.update(data.today_event_cnt);
        peventCount.update(data.event_cnt_percent);
        falutCount.update(data.today_event_fault_cnt);
        pfalutCount.update(data.event_fault_cnt_percent);

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

function drawMap() {
  var bubbleMap = L.map('bubble-map').setView([37.467271, 127.042861], 13);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidG92ZW5iYWUiLCJhIjoiY2l3YnQwbDM0MDR3ZTJvcXVxb2JrNDBxbCJ9.nN-PfJ9x8hU9K8OwO_ti1g'
    // accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw'
  }).addTo(bubbleMap);

  // d3.json("/dashboard/restapi/getNodeGeo", function(data) {
  //   console.log(data);
  //   drawMarkerSelect(data);
  //   drawMarkerArea(data);
  // });

  function drawMarkerSelect(data) {
    var xf = crossfilter(data);
    var groupname = "marker-select";
    var facilities = xf.dimension(function(d) { return d.geo; });
    var facilitiesGroup = facilities.group().reduceCount();
    console.log(facilitiesGroup.size());
    dc.leafletMarkerChart("#bubble-map .map",groupname)
        .dimension(facilities)
        .group(facilitiesGroup)
        .width(600)
        .height(400)
        .center([37.467271, 127.042861])
        .zoom(7)
        .cluster(true);
    // var types = xf.dimension(function(d) { return d.type; });
    // var typesGroup = types.group().reduceCount();
    // dc.pieChart("#demo1 .pie",groupname)
    //     .dimension(types)
    //     .group(typesGroup)
    //     .width(200)
    //     .height(200)
    //     .renderLabel(true)
    //     .renderTitle(true)
    //     .ordering(function (p) {
    //       return -p.value;
    //     });
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
        .zoom(7)
        .renderPopup(false)
        .filterByArea(true);
    // var types = xf.dimension(function(d) { return d.type; });
    // var typesGroup = types.group().reduceCount();
    // dc.pieChart("#demo2 .pie",groupname)
    //     .dimension(types)
    //     .group(typesGroup)
    //     .width(200)
    //     .height(200)
    //     .renderLabel(true)
    //     .renderTitle(true)
    //     .ordering(function (p) {
    //       return -p.value;
    //     });
    dc.renderAll(groupname);
  }
}

function drawChart() {
  // var barchart = dc.barChart('#bar-chart');
  var volumeChart = dc.barChart('#volumn-chart');
  var moveChart = dc.lineChart('#move-chart');
  var plot01Chart = dc.boxPlot('#plot01-chart');
  var plot02Chart = dc.boxPlot('#plot02-chart');
  var plot03Chart = dc.boxPlot('#plot03-chart');
  var plot_pieChart = dc.pieChart("#plot_pie-chart");
  // var fluctuationChart = dc.barChart('#fluctuation-chart');
  var seriesChart = dc.seriesChart('#series-chart');
//   d3.json('/dashboard/restapi/fruits', function(error, counts) {
// //      console.log(counts);
//       if(error)
//           throw new Error(error);

//       counts = [
//         {event_time: "2016-11-28 10:05:21.0", "name": "apple", "cnt": 10},
//         {event_time: "2016-11-28 11:05:21.0", "name": "orange", "cnt": 15},
//         {event_time: "2016-11-28 12:05:21.0", "name": "banana", "cnt": 12},
//         // {event_time: "2016-11-28 13:05:21.0", "name": "grapefruit", "cnt": 2},
//         // {event_time: "2016-11-28 14:05:21.0", "name": "grapefruit", "cnt": 4},
//         // {event_time: "2016-11-28 15:05:21.0", "name": "pomegranate", "cnt": 1},
//         {event_time: "2016-11-28 16:05:21.0", "name": "lime", "cnt": 12},
//         {event_time: "2016-11-28 17:05:21.0", "name": "grape", "cnt": 50}
//       ];

//       var ndx            = crossfilter(counts),
//           fruitDimension = ndx.dimension(function(d) {return d.event_time;}),
//           sumGroup       = fruitDimension.group().reduceSum(function(d) {return d.cnt;});
//       barchart
//           .width(620)
//           .height(250)
//           .x(d3.scale.ordinal())
//           .xUnits(dc.units.ordinal)
//           .brushOn(false)
//           .xAxisLabel('Fruit')
//           .yAxisLabel('Quantity Sold')
//           .dimension(fruitDimension)
//           .barPadding(0.1)
//           .outerPadding(0.05)
//           .group(sumGroup);
//       barchart.render();
//   });

  d3.json("/dashboard/restapi/getReportRawData", function(err, out_data) {
    // if (err) throw Error(error);

    var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
    var df = d3.time.format('%Y-%m-%d %H:%M:%S.%L');
    var numberFormat = d3.format('.2f');
    var minDate  = new Date('2016-11-20T00:00:00');
    var maxDate = new Date("2016-12-12T00:00:00");

    var minDay  = new Date('2016-12-01T16:00:00');
    var maxDay = new Date("2016-12-12T16:00:00");

    // {"node_id":"0001.00000001","event_time":"2016-11-25 15:42:34.0","event_type":"1",
    //  "active_power":19.618999481201172,"ampere":183.35400390625,"als_level":null,
    //  "dimming_level":null,"noise_decibel":0,"noise_frequency":null,"vibration_x":null,
    //  "vibration_y":null,"vibration_z":null}

    var data = out_data.rtnData[0];
    // console.log(out_data);

    // data = [
    //   {node_id: "0001.00000001", event_time: "2016-11-24 01:00:00.0", event_type: "1", active_power: 24.702, ampere: 54.4188, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-24 10:05:21.0", event_type: "1", active_power: 13.814, ampere: 176.736, als_level:10, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-24 14:05:22.0", event_type: "1", active_power: 85.417, ampere: 40.3235, als_level:5, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-25 01:00:00.0", event_type: "17", active_power: 0, ampere: 0, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000B", event_time: "2016-11-25 10:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:10, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-25 14:05:22.0", event_type: "1", active_power: 20, ampere: 4, als_level:5, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-26 10:05:22.0", event_type: "1", active_power: 20, ampere: 4, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-26 01:00:00.0", event_type: "17", active_power: 0, ampere: 0, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000B", event_time: "2016-11-26 10:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:10, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-26 14:05:22.0", event_type: "1", active_power: 20, ampere: 4, als_level:5, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-26 10:05:22.0", event_type: "1", active_power: 27, ampere: 4, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-27 01:00:00.0", event_type: "1", active_power: 10, ampere: 7, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-27 10:05:21.0", event_type: "33", active_power: 0, ampere: 0, als_level:0, vibration:120 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000C", event_time: "2016-11-28 14:05:22.0", event_type: "1", active_power: 14, ampere: 4, als_level:5, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-28 10:05:22.0", event_type: "1", active_power: 40, ampere: 4, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-28 11:05:21.0", event_type: "49", active_power: 0, ampere: 0, als_level:0, vibration:0 , noise_decibel:2.4, noise_frequency:13700},
    //   {node_id: "0001.00000001", event_time: "2016-11-28 12:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-28 13:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000C", event_time: "2016-11-28 14:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-28 15:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-28 16:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-30 10:05:22.0", event_type: "81", active_power: 20, ampere: 4, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-30 01:00:00.0", event_type: "1", active_power: 10, ampere: 7, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-30 10:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:10, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-30 14:05:22.0", event_type: "1", active_power: 20, ampere: 4, als_level:5, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000B", event_time: "2016-11-30 10:05:22.0", event_type: "81", active_power: 20, ampere: 4, als_level:2, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-30 11:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:3, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-11-30 12:05:21.0", event_type: "1", active_power: 27, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000C", event_time: "2016-11-30 13:05:21.0", event_type: "1", active_power: 85.417, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000B", event_time: "2016-11-30 14:05:21.0", event_type: "49", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:3.6, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-01 14:05:21.0", event_type: "33", active_power: 10, ampere: 10, als_level:7, vibration:120 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-01 15:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-01 15:06:21.0", event_type: "17", active_power: 0, ampere: 0, als_level:12, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000B", event_time: "2016-12-01 15:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-01 16:05:21.0", event_type: "1", active_power: 24.702, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-01 16:08:21.0", event_type: "33", active_power: 24.702, ampere: 10, als_level:7, vibration:50 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-01 16:07:21.0", event_type: "1", active_power: 13.814, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-02 14:05:21.0", event_type: "33", active_power: 10, ampere: 10, als_level:7, vibration:120 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000B", event_time: "2016-12-02 15:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-02 15:06:21.0", event_type: "17", active_power: 0, ampere: 0, als_level:12, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-02 15:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.00000001", event_time: "2016-12-02 16:05:21.0", event_type: "17", active_power: 24.702, ampere: 10, als_level:5, vibration:0 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "0001.0000000B", event_time: "2016-12-02 16:08:21.0", event_type: "33", active_power: 24.702, ampere: 10, als_level:7, vibration:50 , noise_decibel:0, noise_frequency:0},
    //   {node_id: "A0001.00000001", event_time: "2016-12-02 16:07:21.0", event_type: "1", active_power: 13.814, ampere: 10, als_level:7, vibration:0 , noise_decibel:0, noise_frequency:0},
    // ];

    var cnt_event_type = 0,
        cnt_fault_type = 0;
    data.forEach(function (d) {
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
    });

    console.log(data);

    var ndx = crossfilter(data);

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

    console.log('eventTypeDim.group() size : ' + eventTypeDim.group().size());
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
      .width(620)
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
      .width(620)
      .height(150)
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
      .width(200)
      .height(210)
      .margins({top: 10, right: 50, bottom: 30, left: 50})
      .dimension(apDim)
      .group(apArrayGroup)
      .elasticY(true)
      .elasticX(true);

    plot02Chart
      .width(200)
      .height(210)
      .margins({top: 10, right: 50, bottom: 30, left: 50})
      .dimension(noiseDim)
      .group(noiseArrayGroup)
      .elasticY(true)
      .elasticX(true);

    plot03Chart
      .width(200)
      .height(210)
      .margins({top: 10, right: 50, bottom: 30, left: 50})
      .dimension(vibDim)
      .group(vibArrayGroup)
      .elasticY(true)
      .elasticX(true);

    plot_pieChart
      .width(150)
      .height(140)
      .radius(60)
      .dimension(nodeDim)
      .group(nodeGroup);

    seriesChart
      .width(620)
      .height(210)
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

    dc.renderAll();
  });
}


