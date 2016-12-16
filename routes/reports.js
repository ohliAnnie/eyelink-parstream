var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();
var ReportsProvider = require('./dao/parstream/db-reports').ReportsProvider;

var reportsProvider = new ReportsProvider();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  res.render('./reports/main', { title: 'EyeLink for ParStream' });
});


router.get('/d3', function(req, res, next) {
  res.render('./reports/d3', { title: 'EyeLInk D3 Reports' });
});

router.get('/test', function(req, res, next) {
  res.render('./reports/test', { title: 'Test' });
});


// query Report
router.get('/restapi/getReportRawData', function(req, res, next) {
  console.log('reports/restapi/getReportRawData');
  var in_data = {MERGE:'Y'};
  reportsProvider.selectSingleQueryByID("selectEventRawData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    // MERGE = 'Y'이면 이전 날짜의 RawData를 합쳐준다.
    if (params.MERGE === 'Y')
      out_data = Utils.mergeLoadedData(out_data);

    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });

});
  
// query Report
router.get('/restapi/testData', function(req, res, next) {
  console.log('reports/restapi/testData');
  var in_data = {MERGE:'Y'};
  reportsProvider.selectSingleQueryByID("testData", in_data, function(err, out_data, params) {
    // console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
  
    res.json({rtnCode: rtnCode, rtnData: out_data[0]});
  });

});

router.get('/NYX', function(req, res, next) {
  var data =
[{"event_type":1,"event_time":"2016-12-08 22:18:08","active_power":58.566,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-08 22:18:30","active_power":99.564,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-09 17:58:08","active_power":121.367,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-09 17:59:03","active_power":102.273,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-09 17:59:10","active_power":123.172,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-09 17:59:59","active_power":146.277,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-09 18:06:06","active_power":144.499,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-09 18:06:07","active_power":75.703,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-09 18:06:26","active_power":17.425,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-06 15:43:33","active_power":null,"als_level":5,"dimming_level":8,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-07 09:55:30","active_power":null,"als_level":3,"dimming_level":11,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-08 22:18:29","active_power":null,"als_level":1,"dimming_level":12,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 17:56:16","active_power":null,"als_level":5,"dimming_level":4,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 17:57:16","active_power":null,"als_level":6,"dimming_level":5,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 17:58:55","active_power":null,"als_level":2,"dimming_level":28,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:01:55","active_power":null,"als_level":0,"dimming_level":22,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:02:53","active_power":null,"als_level":4,"dimming_level":29,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:04:32","active_power":null,"als_level":2,"dimming_level":11,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:04:57","active_power":null,"als_level":1,"dimming_level":4,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:06:34","active_power":null,"als_level":1,"dimming_level":30,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:21:16","active_power":null,"als_level":2,"dimming_level":24,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:36:55","active_power":null,"als_level":3,"dimming_level":15,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:38:14","active_power":null,"als_level":0,"dimming_level":30,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-09 18:44:42","active_power":null,"als_level":2,"dimming_level":3,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-08 22:17:03","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":69,"vibration_y":184,"vibration_z":104,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 17:49:43","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":252,"vibration_y":194,"vibration_z":46,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 17:56:35","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":49,"vibration_y":94,"vibration_z":244,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 17:58:39","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":36,"vibration_y":54,"vibration_z":136,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 17:59:08","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":180,"vibration_y":30,"vibration_z":247,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 18:03:19","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":165,"vibration_y":80,"vibration_z":4,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 18:04:13","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":68,"vibration_y":87,"vibration_z":61,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 18:05:38","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":32,"vibration_y":72,"vibration_z":217,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 18:06:51","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":244,"vibration_y":71,"vibration_z":118,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 18:15:35","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":131,"vibration_y":25,"vibration_z":191,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":33,"event_time":"2016-12-09 18:24:30","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":182,"vibration_y":11,"vibration_z":147,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":49,"event_time":"2016-12-06 15:42:33","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":1.7,"noise_frequency":1500,"status_power_meter":null},
{"event_type":49,"event_time":"2016-12-06 16:08:27","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":0.5,"noise_frequency":11500,"status_power_meter":null},
{"event_type":49,"event_time":"2016-12-09 18:01:36","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":2.7,"noise_frequency":10800,"status_power_meter":null},
{"event_type":49,"event_time":"2016-12-09 18:06:27","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":2.4,"noise_frequency":19900,"status_power_meter":null},
{"event_type":49,"event_time":"2016-12-09 18:08:01","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":0.8,"noise_frequency":19300,"status_power_meter":null},
{"event_type":49,"event_time":"2016-12-09 18:56:33","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":0.4,"noise_frequency":2000,"status_power_meter":null},
{"event_type":49,"event_time":"2016-12-09 19:02:49","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":3.1,"noise_frequency":3200,"status_power_meter":null},
{"event_type":49,"event_time":"2016-12-09 19:20:11","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":1.1,"noise_frequency":12700,"status_power_meter":null},
{"event_type":81,"event_time":"2016-12-08 22:17:36","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":0},
{"event_type":81,"event_time":"2016-12-08 22:18:27","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":0},
{"event_type":81,"event_time":"2016-12-09 17:50:20","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":0},
{"event_type":81,"event_time":"2016-12-09 17:57:08","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":1},
{"event_type":81,"event_time":"2016-12-09 17:58:50","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":1},
{"event_type":81,"event_time":"2016-12-09 18:00:39","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":0},
{"event_type":81,"event_time":"2016-12-09 18:03:26","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":1},
{"event_type":81,"event_time":"2016-12-09 18:05:14","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":0},
{"event_type":81,"event_time":"2016-12-09 18:06:37","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":0},
{"event_type":81,"event_time":"2016-12-09 18:24:24","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":0},
{"event_type":81,"event_time":"2016-12-09 18:48:48","active_power":null,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":0},
{"event_type":1,"event_time":"2016-12-10 12:03:42","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-10 20:13:08","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-10 20:57:40","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-11 11:03:33","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-11 11:48:03","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-11 21:26:32","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-11 22:11:05","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-12 05:51:05","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-12 18:07:55","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-12 18:37:33","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 06:59:31","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 10:12:24","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 10:27:13","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 10:42:02","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 21:19:45","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 21:49:28","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 22:19:06","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 22:48:49","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 23:18:27","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":1,"event_time":"2016-12-13 23:48:10","active_power":0.000,"als_level":null,"dimming_level":null,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:34","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:34","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:34","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:38","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:44","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:47","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:52","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:52","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:51:59","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:04","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:04","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:07","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:07","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:11","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:11","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:15","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:18","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:21","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:24","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:32","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:32","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:35","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:35","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:38","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:52:41","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:53:47","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:53:50","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:53:50","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:56:47","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:56:47","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:57:05","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:57:05","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:57:11","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:57:11","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:59:37","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:59:37","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:59:40","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 12:59:40","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 13:01:50","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 13:01:50","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 13:01:57","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 13:02:01","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-10 13:02:01","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 06:05:24","active_power":null,"als_level":5,"dimming_level":9,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:18:38","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:18:43","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:20:15","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:20:15","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:21:33","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:21:33","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:21:36","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:21:36","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:22:26","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:22:26","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:22:29","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:22:29","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:23:00","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:23:00","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:23:16","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:40","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:43","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:43","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:46","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:46","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:49","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:49","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:52","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:52","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:55","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:55","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:58","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:25:58","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:26:16","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:26:16","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:26:19","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:26:19","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:27:54","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:27:57","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:28:00","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:29:53","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:30:06","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:30:09","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:31:14","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:31:38","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 13:34:53","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 15:59:15","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:02:14","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:02:14","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:02:42","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:02:42","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:04:58","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:04:58","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:06:12","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:06:12","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:07:11","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:07:27","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:07:45","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:07:45","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:08:47","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:08:58","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:09:14","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:09:14","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:09:28","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:09:59","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:10:13","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:10:39","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:11:00","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:11:17","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:11:49","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:11:49","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:11:54","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:11:58","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:05","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:22","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:26","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:26","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:35","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:43","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:43","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:55","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:55","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:58","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:12:58","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:14:42","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:14:46","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:14:46","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:14:49","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:14:49","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:14:57","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:14:57","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:15:13","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:15:18","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:15:18","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:15:21","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:15:25","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:15:31","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:02","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:05","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:05","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:13","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:27","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:29","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:29","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:55","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:16:57","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:01","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:03","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:03","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:05","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:06","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:06","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:10","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:12","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:15","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:18","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:22","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:26","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:27","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:31","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:31","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:33","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:35","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:38","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:44","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:44","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:48","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:52","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:52","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:57","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:57","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:58","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:17:58","active_power":null,"als_level":0,"dimming_level":0,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:18:06","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:18:07","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:18:07","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:18:25","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:18:25","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:18:26","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 16:18:26","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-12 18:07:55","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-13 06:59:31","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null},
{"event_type":17,"event_time":"2016-12-13 10:12:24","active_power":null,"als_level":7,"dimming_level":31,"vibration_x":null,"vibration_y":null,"vibration_z":null,"noise_decibel":null,"noise_frequency":null,"status_power_meter":null}]
  ;

  res.send(data);
});

// send pie-chart data
router.get('/piechart', function(req, res, next) {

  // For Test Data
  var data = [
    {
      "vender": "bada",
      "volume": 20
    },
    {
      "vender": "BlackBerry",
      "volume": 30
    },
    {
      "vender": "WebOS",
      "volume": 35
    },
    {
      "vender": "iOS",
      "volume": 190
    },
  ];

  res.send(data);
});

router.get('/homeC', function(req, res, next) {
	// 이미 로그인 여부를 세션에 user_id가 있는지로 확인
	var userInfo = req.session.userInfo;
	var user_id = userInfo.user_id;
	var data = {user_id : user_id};

 res.render('homeC', {
  title: '치과병원',
  mainmenu: mainmenu,
  rtnData: data});
});


module.exports = router;
