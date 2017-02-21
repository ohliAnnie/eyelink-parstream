var fs = require('fs');
var parse = require('csv-parse');
var sleep = require('sleep');
require('date-utils');
var Utils = require('../routes/util');
var QueryProvider = require('../routes/dao/parstream/nodelib-db').QueryProvider;
var queryProvider = new QueryProvider();
var svr = "http://localhost:5223";
var http = require('http');
// var request = require("supertest");
var request = require("request");
var async = require("async");

var opts = {
    host: 'm2u-parstream.eastus.cloudapp.azure.com',
    // host: 'm2u-da.eastus.cloudapp.azure.com',
    port: 9042,
    size: 5,
}

var parstream = require("../routes/dao/parstream/m2u-parstream").createClient(opts);
// console.log(parstream);

var tb_node_raw = fs.readFileSync('../source/tb_node_raw_simul.csv', 'utf8');
parse(tb_node_raw, {comment:"#"}, function(csv_err, csv_data){
  if (csv_err) {
    return console.log(csv_err);
  }
  console.log("Data Simulator Start!!!!")
  console.log('total : %d', csv_data.length);

  stopflag = parseJson();
  console.log("Flag stop : %s ", stopflag);

  parstream.connect(function(err) {
    if (err) {
      console.log('error');
    } else {
      // while(stopflag !== "Y")  {
        loopPowerData(csv_data);
        stopflag = parseJson();
        console.log("Flag stop : %s ", stopflag);
      // }
    }
  });

  console.log("Data Simulator Finished!!!!")
});

function parseJson() {
  var fs_flag = fs.readFileSync('../source/dataSimul.json');
  var js_flag = JSON.parse(fs_flag);
  return js_flag.stop;
}

function loopPowerData(csv_data) {
  for(var cd=1; cd< csv_data.length ; cd+=1){
  // for(var cd=1; cd< 5 ; cd++){
    var d = new Date();
    console.log('time : %s', d.toFormat('YYYY-MM-DD HH24:MI:SS'))
    async.waterfall([
      function(callback){
        console.log('first : %d', cd);
        var out_data = makeJsonData(csv_data[cd])
        callback(null, out_data, '');
      },
      function(jsonData, arg2, callback){
        console.log('second : %s, %s', jsonData.node_id, jsonData.event_time);
        var sql = makeQuery(jsonData);
        callback(null, sql);
      },
      // function(arg1, callback){
      //   // arg1은 '셋'이다.
      //   console.log('third : %s', arg1);

      //   var parstream = require("../routes/dao/parstream/m2u-parstream").createClient(opts);
      //   // console.log(parstream);
      //   parstream.connect(function(err) {
      //     if (err) {
      //       console.log('error');
      //       callback(err);
      //     }
      //   });
      //   callback(null, parstream);
      // },
      function(query, callback){
        // arg1은 '셋'이다.
        console.log('forth : ');
        // var query = "select "
        parstream.query(query, function(err, result) {
          console.log('query in ')
          if (err) {
            console.log('error');
            callback(err);
          }
          callback(null, '끝');
        });
      }
    ], function (err, result) {
        console.log('last : err - %s, result - %s', err, result);
        // done();
       // result에는 '끝'이 담겨 온다.
       sleep.sleep(5)
    });
  }
}

function makeJsonData(dataIn) {
  var node_id = dataIn[0];
  var ldateTemp = dataIn[2].split('.');
  // var ldate = new Date(dataIn[3]);
  var d = new Date();
  ldate = d.toFormat('YYYY-MM-DD HH24:MI:SS');
  dataIn[2] = ldate;
  console.log(dataIn[0] + ", " + dataIn[3] + ", " + ldate);

  // // for test log,lat
  // if (dataIn[22] == "") {
  //   if (node_id == "0001.00000001") {
  //     dataIn[22] = "37.5166";
  //   } else {
  //     dataIn[22] = "35.17944";
  //   }
  // }
  // if (dataIn[21] == "") {
  //   if (node_id == "0001.00000001") {
  //     dataIn[21] = "127.029";
  //   } else {
  //     dataIn[21] = "129.07556";
  //   }
  // }
  console.log(dataIn[11] + ", " + dataIn[21]);

  // console.log("node_id : " + node_id);
  var s_logs = {
    "event_time" : ldate,
    "node_id" : node_id,
    "event_type" : dataIn[1],
    "measure_time" : dataIn[2],
    "voltage" : dataIn[4],
    "ampere" : dataIn[5],
    "power_factor" : dataIn[6],
    "active_power" : dataIn[7],
    "reactive_power" : dataIn[8],
    "apparent_power" : dataIn[9],
    "amount_active_power" : dataIn[10],
    "als_level" : (dataIn[11]===''? 'NULL': dataIn[11]),
    "dimming_level" : (dataIn[12]===''? 'NULL': dataIn[12]),
    "vibration_x" : (dataIn[13]===''? 'NULL': dataIn[13]),
    "vibration_y" : (dataIn[14]===''? 'NULL': dataIn[14]),
    "vibration_z" : (dataIn[15]===''? 'NULL': dataIn[15]),
    "vibration_max" : (dataIn[16]===''? 'NULL': dataIn[16]),
    "noise_origin_decibel" :(dataIn[17]===''? 'NULL': dataIn[17]),
    "noise_origin_frequency" : (dataIn[18]===''? 'NULL': dataIn[18]),
    "noise_decibel" : (dataIn[19]===''? 'NULL': dataIn[19]),
    "noise_frequency" :(dataIn[20]===''? 'NULL': dataIn[20]),
    "gps_longitude" : (dataIn[21]===''? 'NULL': dataIn[21]),
    "gps_latitude" : (dataIn[21]===''? 'NULL': dataIn[22]),
    "gps_altitude" : (dataIn[23]===''? 'NULL': dataIn[23]),
    "gps_satellite_count" : (dataIn[24]===''? 'NULL': dataIn[24]),
    "status_als" : (dataIn[25]===''? 'NULL': dataIn[25]),
    "status_gps" : (dataIn[26]===''? 'NULL': dataIn[26]),
    "status_noise" : (dataIn[27]===''? 'NULL': dataIn[27]),
    "status_vibration" : (dataIn[28]===''? 'NULL': dataIn[28]),
    "status_power_meter" : (dataIn[29]===''? 'NULL': dataIn[29]),
    "status_emergency_led_active" : (dataIn[30]===''? 'NULL': dataIn[30]),
    "status_self_diagnostics_led_active" : (dataIn[31]===''? 'NULL': dataIn[31]),
    "status_active_mode" : (dataIn[32]===''? 'NULL': dataIn[32]),
    "status_led_on_off_type" : (dataIn[33]===''? 'NULL': dataIn[33]),
    "reboot_time" : (dataIn[34]===''? 'NULL': dataIn[34]),
    "event_remain" : (dataIn[35]===''? 'NULL': dataIn[35]),
    "failfirmwareupdate" : (dataIn[36]===''? 'NULL': dataIn[36]),
    "node_geo" : {
      "lat" : dataIn[22],
      "lon" : dataIn[21],
    }}
  return s_logs;
}

function insertDataToSvr(raw_data, callback) {
  request({
      url: svr + "/simulator/restapi/addNodeEventData",
      method: "POST",
      json: true,   // <--Very important!!!
      body: raw_data
  }, function (error, response, body){
      console.log(response);
  });

  // request(svr)
  //   .post("/simulator/restapi/addNodeEventData")
  //   .send(raw_data)
  //   // .expect('Content-Type', /json/)
  //   .expect(200, function(err, res) {
  //     // if (err) return done(err);
  //     // console.log(res.header);
  //     // res.body.rtnCode.code.should.be.equal('D001');
  //     callback(null, '0000');
  //   });
}

function makeQuery(raw_data) {
  var sql = "insert into tb_node_raw ";
  sql += "select date_part('YEAR', current_date()) as event_year,";
  sql += "      date_part('MONTH', current_date()) as event_month,";
  sql += "      date_part('DAY', current_date()) as event_day,";
  sql += "      timestamp '" + raw_data.event_time + "' as measure_time,";
  sql += "      timestamp '" + raw_data.event_time + "' as event_time,";
  sql += "      '" + raw_data.node_id + "' as node_id,";
  sql += "      " + raw_data.event_type + " as event_type,";
  sql += "      " + raw_data.voltage + " as voltage,";
  sql += "      " + raw_data.ampere + " as ampere,";
  sql += "      " + raw_data.power_factor + " as power_factor,";
  sql += "      " + raw_data.active_power + " as active_power,";
  sql += "      " + raw_data.reactive_power + " as reactive_power,";
  sql += "      " + raw_data.apparent_power + " as apparent_power,";
  sql += "      " + raw_data.amount_active_power + " as amount_active_power,";
  sql += "      " + raw_data.als_level + " as als_level,";
  sql += "      " + raw_data.dimming_level + " as dimming_level,";
  sql += "      " + raw_data.vibration_x + " as vibration_x,";
  sql += "      " + raw_data.vibration_y + " as vibration_y,";
  sql += "      " + raw_data.vibration_z + " as vibration_z,";
  sql += "      " + raw_data.vibration_max + " as vibration_max,";
  sql += "      " + raw_data.noise_origin_decibel + " as noise_origin_decibel,";
  sql += "      " + raw_data.noise_origin_frequency + " as noise_origin_frequency,";
  sql += "      " + raw_data.noise_decibel + " as noise_decibel,";
  sql += "      " + raw_data.noise_frequency + " as noise_frequency,";
  sql += "      " + raw_data.gps_longitude + " as gps_longitude,";
  sql += "      " + raw_data.gps_latitude + " as gps_latitude,";
  sql += "      " + raw_data.gps_altitude + " as gps_altitude,";
  sql += "      " + raw_data.gps_satellite_count + " as gps_satellite_count,";
  sql += "      " + raw_data.status_als + " as status_als,";
  sql += "      " + raw_data.status_gps + " as status_gps,";
  sql += "      " + raw_data.status_noise + " as status_noise,";
  sql += "      " + raw_data.status_vibration + " as status_vibration,";
  sql += "      " + raw_data.status_power_meter + " as status_power_meter,";
  sql += "      " + raw_data.status_emergency_led_active + " as status_emergency_led_active,";
  sql += "      " + raw_data.status_self_diagnostics_led_active + " as status_self_diagnostics_led_active,";
  sql += "      " + raw_data.status_active_mode + " as status_active_mode,";
  sql += "      " + raw_data.status_led_on_off_type + " as status_led_on_off_type,";
  sql += "      " + raw_data.reboot_time + " as reboot_time,";
  sql += "      " + raw_data.event_remain + " as event_remain,";
  sql += "      " + raw_data.failfirmwareupdate + " as failfirmwareupdate";

  console.log(sql);
  // insertQuery(sql, function(err, out_data) {
  //   // var rtnCode = CONSTS.getErrData(out_data);
  //   if (err) { console.log(err);
  //     // rtnCode = CONSTS.getErrData(out_data);
  //     console.log(out_data);
  //   }
  //   // res.json({rtnCode: rtnCode});
  // });
  return sql;
}

// Insert Query를 수행한다.
insertQuery = function (query, callback) {
  var vTimeStamp = Date.now();
  // console.log('insertQuery -> (%s)', query)

  // console.log(opts);
  // no pool method
  var parstream = require("../routes/dao/parstream/m2u-parstream").createClient(opts);
  // console.log(parstream);
  parstream.connect(function(err) {
    if (err) {
      console.log('error');
      callback(err);
    } else {
      console.log('connected');
      console.time('insertQuery -> ('+ vTimeStamp +') executeQuery');
      parstream.query(query, function(err) {
        if (err) {
          console.log(err)
          callback(err);
        }
        console.timeEnd('insertQuery -> ('+ vTimeStamp +') executeQuery');
        console.log('insert data')
        parstream.close();
        callback(err, 'D001');
      });
    }
  });
};

