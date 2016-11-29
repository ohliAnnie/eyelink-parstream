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

function drawChart() {
  // var barchart = dc.barChart('#bar-chart');
  var volumeChart = dc.barChart('#volumn-chart');
  var moveChart = dc.lineChart('#move-chart');
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
    var minDate  = new Date('2016-11-01T00:00:00');
    var maxDate = new Date("2016-11-30T00:00:00");

    // {"node_id":"0001.00000001","event_time":"2016-11-25 15:42:34.0","event_type":"1",
    //  "active_power":19.618999481201172,"ampere":183.35400390625,"als_level":null,
    //  "dimming_level":null,"noise_decibel":0,"noise_frequency":null,"vibration_x":null,
    //  "vibration_y":null,"vibration_z":null}

    var data = out_data.rtnData[0];

    data = [
      {node_id: "0001.00000001", event_time: "2016-11-25 01:00:00.0", event_type: "1", active_power: 10, ampere: 7, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-25 10:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:10},
      {node_id: "0001.00000001", event_time: "2016-11-25 14:05:22.0", event_type: "1", active_power: 20, ampere: 4, als_level:5},
      {node_id: "0001.00000001", event_time: "2016-11-26 10:05:22.0", event_type: "81", active_power: 20, ampere: 4, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-26 01:00:00.0", event_type: "1", active_power: 10, ampere: 7, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-26 10:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:10},
      {node_id: "0001.00000001", event_time: "2016-11-26 14:05:22.0", event_type: "1", active_power: 20, ampere: 4, als_level:5},
      {node_id: "0001.00000001", event_time: "2016-11-26 10:05:22.0", event_type: "81", active_power: 20, ampere: 4, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-27 01:00:00.0", event_type: "1", active_power: 10, ampere: 7, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-27 10:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:10},
      {node_id: "0001.00000001", event_time: "2016-11-28 14:05:22.0", event_type: "1", active_power: 20, ampere: 4, als_level:5},
      {node_id: "0001.00000001", event_time: "2016-11-28 10:05:22.0", event_type: "81", active_power: 20, ampere: 4, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-28 11:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:3},
      {node_id: "0001.00000001", event_time: "2016-11-28 12:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-28 13:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-28 14:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-28 15:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-28 16:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-30 10:05:22.0", event_type: "81", active_power: 20, ampere: 4, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-30 01:00:00.0", event_type: "1", active_power: 10, ampere: 7, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-30 10:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:10},
      {node_id: "0001.00000001", event_time: "2016-11-30 14:05:22.0", event_type: "1", active_power: 20, ampere: 4, als_level:5},
      {node_id: "0001.00000001", event_time: "2016-11-30 10:05:22.0", event_type: "81", active_power: 20, ampere: 4, als_level:2},
      {node_id: "0001.00000001", event_time: "2016-11-30 11:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:3},
      {node_id: "0001.00000001", event_time: "2016-11-30 12:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-30 13:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-30 14:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-30 15:05:21.0", event_type: "81", active_power: 10, ampere: 10, als_level:7},
      {node_id: "0001.00000001", event_time: "2016-11-30 16:05:21.0", event_type: "1", active_power: 10, ampere: 10, als_level:7},
    ];

    // data = [
    //   {node_id: "0001.00000001", event_time: "2016-11-27", event_type: "17", active_power: 10, ampere: 10},
    //   {node_id: "0001.00000001", event_time: "2016-11-28", event_type: "17", active_power: 10, ampere: 10},
    //   {node_id: "0001.00000001", event_time: "2016-11-29", event_type: "17", active_power: 20, ampere: 4},
    // ];

    var cnt_event_type = 0,
        cnt_fault_type = 0;
    data.forEach(function (d) {
      // console.log('date : ' + df.parse("2016-11-28"));
      d.dd = df.parse(d.event_time);
      d.month = d3.time.month(d.dd);
      d.day = d3.time.day(d.dd);
      // d.month = d3.time.month(d.dd); // pre-calculate month for better performance
      // d.VOLTAGE = +d.VOLTAGE;
      d.cnt_event_type = ++cnt_event_type;
      if (d.event_type == '81')
        d.cnt_fault_type = ++cnt_fault_type;
      else
        d.cnt_fault_type = cnt_fault_type;
      d.ampere = d.ampere;
      // d.ampere += d.ampere;
      // d.POWER_FACTOR = +d.POWER_FACTOR;
      // d.active_power += d.active_power;
      // d.REACTIVE_POWER = +d.REACTIVE_POWER;
      // d.APPARENT_POWER = +d.APPARENT_POWER;
      // d.AMOUNT_OF_ACTIVE_POWER = +d.AMOUNT_OF_ACTIVE_POWER;
      // d.check = +0.85;
      // console.log(d);
    });

    console.log(data);

    var ndx = crossfilter(data);

    // console.log(ndx);
    var apDim = ndx.dimension(function (d) {
      return [+d.event_type, +d.dd];
    });

    // console.log(apDim);
    var ampereGroup = apDim.group().reduceSum(function(d) {
      return d.cnt_event_type;
    });

    var moveDays = ndx.dimension(function (d) {
      return d.day;
    })

    var volumnByDayGroup = moveDays.group().reduceCount(function (d) {
      return d.event_type;
    })
    // console.log(ampereGroup);

    // var indexAvgByMonthGroup = moveDays.group().reduce(
    //     // add
    //     function (p, v) {
    //       console.log(moveDays.group().size());
    //       console.log(p);
    //         ++p.hours;
    //         p.total += p.cnt_event;
    //         p.avg += p.cnt_event;
    //         return p;
    //     },
    //     // remove
    //     function (p, v) {
    //         --p.hours;
    //         p.total -= cnt_event;
    //         p.avg -= p.cnt_event;
    //         return p;
    //     },
    //     // initial
    //     function () {
    //         return {hours: 0, cnt_event: 0, cnt_failure: 0};
    //     }
    // );

    console.log('moveDays.group() size : ' + moveDays.group().size());
    var indexAvgByMonthGroup = moveDays.group().reduce(
        // add
        function (p, v) {
          console.log(p);
          console.log(v);
          return p+1;
        },
        // remove
        function (p, v) {
          return p-1;
        },
        // initial
        function () {
          return 0;
        }
    );

    // Group by total movement within month
    var monthlyMoveGroup = moveDays.group().reduceCount(function (d) {
      console.log(moveDays.group().size());
      return d.event_type;
    });

    volumeChart
      .width(620)
      .height(60)
      .margins({top: 10, right: 50, bottom: 30, left: 40})
      .dimension(moveDays)
      .group(volumnByDayGroup)
      .centerBar(true)
      .gap(10)
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
      .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
      .brushOn(false)
      .group(indexAvgByMonthGroup, 'Daily Event Count')
      .valueAccessor(function (d) {
        return d.value.avg;
      })
      .stack(monthlyMoveGroup, 'Daily Error Count', function (d) {
        return d.value;
      })
      // Title can be called by any stack layer.
      .title(function (d) {
        var value = d.value.avg ? d.value.avg : d.value;
        if (isNaN(value)) {
          value = 0;
        }
        return dateFormat(d.key) + '\n' + numberFormat(value);
      });

    seriesChart
      .width(620)
      .height(250)
      .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
      .x(d3.time.scale().domain([minDate, maxDate]))
      .brushOn(false)
      .yAxisLabel("Values")
      .xAxisLabel("Time")
      .clipPadding(10)
      .elasticY(true)
      .dimension(apDim)
      .group(ampereGroup)
      .mouseZoomable(true)
      .seriesAccessor(function(d) {return "Expt: " + d.key[0];})
      .keyAccessor(function(d) {return +d.key[1];})
      .valueAccessor(function(d) {return +d.value;})
      .legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
    seriesChart.yAxis().tickFormat(function(d) {return d3.format(',d')(d);});
    seriesChart.margins().left += 40;

    dc.renderAll();
  });
}


