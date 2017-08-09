if ( process.argv[2] == null ) {
  printUsage();
  process.exit();
}


var fs = require('fs');
var sleep = require('system-sleep');
var parse = require('csv-parse');
var moment = require('moment-timezone');
var datetime = require('node-datetime');
var xml2js = require('xml2js');

var express = require('express');
var router = express.Router();
var QueryProvider = require('./nodelib-es').QueryProvider;
var queryProvider = new QueryProvider();

const log4js = require('log4js');
log4js.configure({
  appenders: { datagen: { type: 'file', filename: 'datagen.log' } },
  categories: { default: { appenders: ['datagen'], level: 'debug' } }
});
const logger = log4js.getLogger('datagen');

const datafilepath = process.argv[2];
const nodeId = process.argv[3];
const type = 'corecode';
const initialDataInDays = ( process.argv[4] == null ? 0 : process.argv[4] );  

var lineReader = require('readline').createInterface({
  input: fs.createReadStream(datafilepath)
});

var notMatchedCount = 0;
var matchedCount = 0;
var curDate;

loadQuery('./dbquery.xml');

// 한 달 분량의 데이터를 선입력하기 위한 변수 선언.
var initialDataProcessed = false;
var processedDays = 0;

var cur_datetime = moment(datetime.create().format('Y-m-d H:M:S'));
var prev_month_datetime = cur_datetime.subtract(1, 'months');

// sample data 
// 0002.00000038,49,2016-11-17 11:49:01.533,2016-11-17 11:49:01,,,,,,,,,,,,,,11,100,1.1,10000,,,,,,,,,,,,,,,0,

// 실제 라인 단위로 데이터 읽어와서 처리하는 로직 시작.
lineReader.on('line', function (line) {

  if ( line.startsWith(nodeId) ) {
      matchedCount += 1;
      logger.info('Processing data : ', line);

      var data_arr = line.split(',');

      // 한국 시간으로 변경하기
      var cur_kor_datetime = prev_month_datetime.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
      var event_date = data_arr[3].split(' ')[0];

      if ( curDate == null ) {
          curDate = event_date;
      }
      if ( curDate !== event_date ){
          logger.debug('Changing date. curDate: ',curDate,', event_date: ',event_date);
          processedDays += 1;
          prev_month_datetime.add(processedDays, 'days');
          curDate = event_date;

          if ( processedDays >= initialDataInDays ){

              initialDataProcessed = true;
              
              logger.debug('=======================================');
              logger.debug('=========== ' + initialDataInDays + ' days passed ============');
              logger.debug('=======================================');
          }
      }

      // 이벤트 타임을 현재 일자에 맞게 변경하기 (입력시 필요한 값으로 변경)
      data_arr[3] = cur_kor_datetime.split(' ')[0] + ' ' + data_arr[3].split(' ')[1];

      var curDateTime = moment(cur_kor_datetime, 'YYYY-MM-DD HH:mm:ss');
      var eventDateTime = moment(data_arr[3], 'YYYY-MM-DD HH:mm:ss');
      var diffSeconds = eventDateTime.diff(curDateTime, 'seconds');
      
      logger.debug('curDateTime : ',event_date + ' ' + cur_kor_datetime.split(' ')[1],', eventDateTime : ',data_arr[3],', diffSeconds : ',diffSeconds);

      var index = 'corecode-' + cur_kor_datetime.split(' ')[0];

      if ( !initialDataProcessed ){
          sleep(100);
          insertData(index, type, data_arr.join(','));
      } 
      else {

          if ( diffSeconds <= 0 ) {
              sleep(100);
              insertData(index, type, data_arr.join(','));
          } else if ( diffSeconds > 0 ){
            
              logger.info('Waiting ', diffSeconds, ' seconds.....');

              sleep(diffSeconds * 1000);
              insertData(index, type, data_arr.join(','));
          }
      }
  } else {
    notMatchedCount += 1;
  }
  
})
.on('close', function() {

  console.log('matched : ', matchedCount, ', unmatched: ', notMatchedCount, ', total : ', (matchedCount + notMatchedCount));
  
});

function printUsage() {
  console.log('Usage : $ node dataSimulator.js [data source file path] [node id] {days for initial data}');
  console.log('    []: required, {}: optional');
  console.log('');
  console.log('Ex. $ node dataSimulator.js ./source.csv 0002.00000039 30');
}
function insertData(index, type, linedata){
  // console.log('inserting data : ', linedata);
  logger.debug('Inserting data - index: ', index, ', data : ', linedata);
  
  queryProvider.insertData(type, 'insertData', makeJsonData(index, type, linedata));
}

function loadQuery(queryFilePath) {
  var parser = new xml2js.Parser();
  // console.log('initApps/loadQuery -> ' + queryFilePath);
  fs.readFile(queryFilePath, function(err, data) {
    parser.parseString(data, function (err, result) {
    // console.log('initApps/loadQuery -> xml file');
      // result = cleanXML(result);
      result = JSON.stringify(result);
      // console.log('initApps/loadQuery -> %j', result);
      result = JSON.parse(result)
      // console.log('initApps/loadQuery : ' + result.dashboard[0]);
      // console.log('Done');
      global.query = result;
      // console.log('global.query : ', result);
    });
  });
}

function makeJsonData(index, type, data) {

  var linedataArr = data.split(',');
  var s_logs = {
    "index" : index,
    "type" : type,
    "node_id" : linedataArr[0],
    "event_type" : linedataArr[1],
    "measure_time" : linedataArr[2],
    "event_time" : linedataArr[3],
    "voltage" : linedataArr[4] || 'NULL',
    "ampere" : linedataArr[5] || 'NULL',
    "power_factor" : linedataArr[6] || 'NULL',
    "active_power" : linedataArr[7] || 'NULL',
    "reactive_power" : linedataArr[8] || 'NULL',
    "apparent_power" : linedataArr[9] || 'NULL',
    "amount_active_power" : linedataArr[10] || 'NULL',
    "als_level" : linedataArr[11] || 'NULL',
    "dimming_level" : linedataArr[12] || 'NULL',
    "vibration_x" : linedataArr[13] || 'NULL',
    "vibration_y" : linedataArr[14] || 'NULL',
    "vibration_z" : linedataArr[15] || 'NULL',
    "vibration_max" : linedataArr[16] || 'NULL',
    "noise_origin_decibel" :linedataArr[17] || 'NULL',
    "noise_origin_frequency" : linedataArr[18] || 'NULL',
    "noise_decibel" : linedataArr[19] || 'NULL',
    "noise_frequency" :linedataArr[20] || 'NULL',
    "gps_longitude" : linedataArr[21] || 'NULL',
    "gps_latitude" : linedataArr[21] || 'NULL',
    "gps_altitude" : linedataArr[23] || 'NULL',
    "gps_satellite_count" : linedataArr[24] || 'NULL',
    "status_als" : linedataArr[25] || 'NULL',
    "status_gps" : linedataArr[26] || 'NULL',
    "status_noise" : linedataArr[27] || 'NULL',
    "status_vibration" : linedataArr[28] || 'NULL',
    "status_power_meter" : linedataArr[29] || 'NULL',
    "status_emergency_led_active" : linedataArr[30] || 'NULL',
    "status_self_diagnostics_led_active" : linedataArr[31] || 'NULL',
    "status_active_mode" : linedataArr[32] || 'NULL',
    "status_led_on_off_type" : linedataArr[33] || 'NULL',
    "reboot_time" : linedataArr[34] || 'NULL',
    "event_remain" : linedataArr[35] || 'NULL',
    "failfirmwareupdate" : linedataArr[36] || 'NULL'
  }
  return s_logs;
}

