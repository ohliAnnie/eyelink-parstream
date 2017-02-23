var fs = require('fs');
var parse = require('csv-parse');
require('date-utils');
var Utils = require('../routes/util');
var QueryProvider = require('../routes/dao/parstream/nodelib-db').QueryProvider;
var queryProvider = new QueryProvider();
var svr = "http://localhost:5223";
var async = require("async");
var exports = module.exports = DataSimulator = {}
var simulconfig = require('./dataSimul.json');

var opts = {
    host: simulconfig.database.host || 'localhost',
    // host: 'm2u-da.eastus.cloudapp.azure.com',
    port: simulconfig.database.port || 9042,
    size: 5,
}
console.log(opts);

var connectedDB = false;
var parstream = require("../routes/dao/parstream/m2u-parstream").createClient(opts);
// parstream.connect(function(err) {
//   if (err) {
//     console.log('init connect error!!!!');
//   } else {
//     connectedDB = true;
//     console.log('init connected!!!!');
//   }
// });

DataSimulator.process = function process(sFileName, isEvent) {
  console.log('fileName : %s', sFileName);
  var tb_node_raw = fs.readFileSync('../source/' + sFileName, 'utf8');
  parse(tb_node_raw, {comment:"#"}, function(csv_err, csv_data){
    if (csv_err) {
      return console.log(csv_err);
    }
    console.log("Data Simulator Start!!!!")
    console.log('total count in source data : %d', csv_data.length);

    var insertNode = [];
    var isInsert = false;
    for(var cd=0; cd<simulconfig.nodeid.length ; cd++) {
      if ((isEvent && Utils.generateRandom(0, 1)) || (!isEvent)) {
        isInsert = true;
        insertNode.push(simulconfig.nodeid[cd]);
      }
    }
    console.log('to insert node : %d',  insertNode.length);

    if (insertNode.length > 0) {
      async.waterfall([
        function(callback) {
          if (!connectedDB) {
            parstream.connect(function(err) {
              if (err) {
                callback(err, '');
              }
              console.log('db connected!!')
              callback(null, '')
            });
          } else {
            console.log('skip connect')
            callback(null, '')
          }

        }], function (err, result) {
          for(var cd=0; cd<insertNode.length ; cd++) {
              processingData(csv_data, insertNode[cd], cd, insertNode.length);
          }
        });

      // parstream.connect(function(err) {
      //   if (err) {
      //     console.log('connected error');
      //   } else {
      //     console.log('connected')
      //     for(var cd=0; cd<insertNode.length ; cd++) {
      //         processingData(csv_data, insertNode[cd], cd, insertNode.length);
      //     }
      //   }
      // });
    }
    //
  });
}

function parseJson() {
  var simulconfig = fs.readFileSync(__dirname + '/dataSimul.json');
  var simulconfig = JSON.parse(simulconfig);
  return simulconfig;
}

function processingData(csv_data, node_id, flag_s, flag_max) {
  var close_cnt  = 0;
  var datalen = csv_data.length;
  // source 데이터에서 random으로 데이터를 읽어서 처리함.
  var idx = Utils.generateRandom(1, datalen);
  var d = new Date();
  // console.log('time : %s', d.toFormat('YYYY-MM-DD HH24:MI:SS'))
  async.waterfall([
    function(callback){
      flag_s++
      // console.log('seq : %d', flag_s);
      var out_data = makeJsonData(csv_data[idx], node_id)
      callback(null, out_data, '');
    },
    function(jsonData, arg2, callback){
      console.log('%d : %s, %s, %s', flag_s, jsonData.node_id, jsonData.event_time, jsonData.event_type);
      var sql = makeQuery(jsonData);
      callback(null, sql);
    },
    function(query, callback){
      parstream.query(query, function(err, result) {
        // console.log('db insert ')
        if (err) {
          console.log('query error');
          callback(err);
        } else if (result.error) {
          callback(result.error, '');
        } else {
          callback(null, '');
        }
      });
    }
  ], function (err, result) {
      console.log('last : err - %s, flag : %d, %d', err, flag_s, flag_max);
      // insert 완료시 db connection close
      if (flag_s === flag_max) {
        parstream.close();
        console.log("Data Simulator Finished!!!!");
      }
  });
}

function makeJsonData(dataIn, nodeId) {
  var node_id = nodeId;
  // var ldateTemp = dataIn[2].split('.');
  // var ldate = new Date(dataIn[3]);
  var d = new Date();
  ldate = d.toFormat('YYYY-MM-DD HH24:MI:SS');
  dataIn[2] = ldate;
  // console.log(dataIn[0] + ", " + dataIn[3] + ", " + ldate);

  // console.log(dataIn[11] + ", " + dataIn[21]);

  // console.log("node_id : " + node_id);
  var s_logs = {
    "event_time" : ldate,
    "node_id" : node_id,
    "event_type" : dataIn[1],
    "measure_time" : ldate,
    "voltage" : dataIn[4] || 'NULL',
    "ampere" : dataIn[5] || 'NULL',
    "power_factor" : dataIn[6] || 'NULL',
    "active_power" : dataIn[7] || 'NULL',
    "reactive_power" : dataIn[8] || 'NULL',
    "apparent_power" : dataIn[9] || 'NULL',
    "amount_active_power" : dataIn[10] || 'NULL',
    "als_level" : dataIn[11] || 'NULL',
    "dimming_level" : dataIn[12] || 'NULL',
    "vibration_x" : dataIn[13] || 'NULL',
    "vibration_y" : dataIn[14] || 'NULL',
    "vibration_z" : dataIn[15] || 'NULL',
    "vibration_max" : dataIn[16] || 'NULL',
    "noise_origin_decibel" :dataIn[17] || 'NULL',
    "noise_origin_frequency" : dataIn[18] || 'NULL',
    "noise_decibel" : dataIn[19] || 'NULL',
    "noise_frequency" :dataIn[20] || 'NULL',
    "gps_longitude" : dataIn[21] || 'NULL',
    "gps_latitude" : dataIn[21] || 'NULL',
    "gps_altitude" : dataIn[23] || 'NULL',
    "gps_satellite_count" : dataIn[24] || 'NULL',
    "status_als" : dataIn[25] || 'NULL',
    "status_gps" : dataIn[26] || 'NULL',
    "status_noise" : dataIn[27] || 'NULL',
    "status_vibration" : dataIn[28] || 'NULL',
    "status_power_meter" : dataIn[29] || 'NULL',
    "status_emergency_led_active" : dataIn[30] || 'NULL',
    "status_self_diagnostics_led_active" : dataIn[31] || 'NULL',
    "status_active_mode" : dataIn[32] || 'NULL',
    "status_led_on_off_type" : dataIn[33] || 'NULL',
    "reboot_time" : dataIn[34] || 'NULL',
    "event_remain" : dataIn[35] || 'NULL',
    "failfirmwareupdate" : dataIn[36] || 'NULL',
    "node_geo" : {
      "lat" : dataIn[22],
      "lon" : dataIn[21],
    }}
  return s_logs;
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

  // console.log(sql);
  return sql;
}
