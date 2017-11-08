if ( process.argv[2] == null) {
  printUsage();
  process.exit();
}

global.log4js = require('log4js');
log4js.configure({
  'appenders':
  {
      'console' :
      {
        'type': 'console'
      },
      'file' :
      {
        'type': 'file',
        'filename': './datacollector.log',
        'maxLogSize': 1024000,
        'backups': 5,
        'category': 'eyelink'
      }
  },
  'categories' :
  {
    'default' : { 'appenders': ['console', 'file'], 'level' : 'info'}
  }
});
var logger = log4js.getLogger('dataSimulator');

logger.info('Data Simulator has been started.');

logger.info(__dirname);

var fs = require('fs');
var sleep = require('system-sleep');
var moment = require('moment-timezone');
var datetime = require('node-datetime');
var xml2js = require('xml2js');
var Utils = require('../../routes/util');
var CONSTS = require('../../routes/consts');
var readline = require('linebyline');
var QueryProvider = require('../../routes/dao/elasticsearch/nodelib-es').QueryProvider;
var queryProvider = new QueryProvider();


const datafilepath = process.argv[2];
const type = 'efmm';
const bulkSize = 100;

logger.info('=========================================================');
logger.info('== Data File Path        : ', datafilepath);
logger.info('=========================================================');

// Directory 내 파일 list를 읽는다.
fs.readdir(datafilepath, function(err, files) {
  files.forEach(function(file) {
    //
    var match = file.match(/.json/);
    if (match !== null) {
      logger.info('read file : %s', file);
      var lineReader = readline(datafilepath+'/'+file);

      // 실제 라인 단위로 데이터 읽어와서 처리하는 로직 시작.
      lineReader.on('line', function(line, lineCount, byteCount) {
        logger.info('parsing data : %s, %d, %s, %s', file, lineCount, byteCount, line);
      })
      .on('error', function(e) {

      })
      .on('close', function() {
        logger.info('matched : ', matchedCount, ', unmatched: ', notMatchedCount, ', total : ', (matchedCount + notMatchedCount));
        logger.info('Data Simulator finished successfully.');
      });

    }

  })
});


var notMatchedCount = 0;
var matchedCount = 0;
var curDate;

loadQuery('./dbquery.xml');

// sample csv line data
// 0002.00000038,49,2016-11-17 11:49:01.533,2016-11-17 11:49:01,,,,,,,,,,,,,,11,100,1.1,10000,,,,,,,,,,,,,,,0,

// var cur_datetime = moment(datetime.create().format('Y-m-d H:M:S'));


function printUsage() {
  console.log('Usage : $ node dataSimulator.js [data source file path]');
  console.log('    []: required, {}: optional');
  console.log('');
  console.log('Ex. $ node dataSimulator.js ./stacking.json');
}

function insertData(index, type, linedata){

  logger.debug('Inserting data - index: ',index,', data : ',linedata);
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
    "voltage" : parseFloat(linedataArr[4]) || 0,
    "ampere" : parseFloat(linedataArr[5]) || 0,
    "power_factor" : parseFloat(linedataArr[6]) || 0,
    "active_power" : parseFloat(linedataArr[7]) || 0,
    "reactive_power" : parseFloat(linedataArr[8]) || 0,
    "apparent_power" : parseFloat(linedataArr[9]) || 0,
    "amount_of_active_power" : parseFloat(linedataArr[10]) || 0,
    "als_level" : parseInt(linedataArr[11]) || 0,
    "dimming_level" : parseInt(linedataArr[12]) || 0,
    "vibration_x" : parseInt(linedataArr[13]) || 0,
    "vibration_y" : parseInt(linedataArr[14]) || 0,
    "vibration_z" : parseInt(linedataArr[15]) || 0,
    "vibration_max" : parseInt(linedataArr[16]) || 0,
    "noise_origin_decibel" : parseFloat(linedataArr[17]) || 0,
    "noise_origin_frequency" : parseInt(linedataArr[18]) || 0,
    "noise_decibel" : parseFloat(linedataArr[19]) || 0,
    "noise_frequency" : parseInt(linedataArr[20]) || 0,
    "gps_longitude" : parseFloat(linedataArr[21]) || 0,
    "gps_latitude" : parseFloat(linedataArr[21]) || 0,
    "gps_altitude" : parseFloat(linedataArr[23]) || 0,
    "gps_satellite_count" : parseInt(linedataArr[24]) || 0,
    "status_als" : parseInt(linedataArr[25]) || 0,
    "status_gps" : parseInt(linedataArr[26])|| 0,
    "status_noise" : parseInt(linedataArr[27]) || 0,
    "status_vibration" : parseInt(linedataArr[28]) || 0,
    "status_power_meter" : parseInt(linedataArr[29]) || 0,
    "status_emergency_led_active" : parseInt(linedataArr[30]) || 0,
    "status_self_diagnostics_led_active" : parseInt(linedataArr[31]) || 0,
    "status_active_mode" : parseInt(linedataArr[32]) || 0,
    "status_led_on_off_type" : parseInt(linedataArr[33]) || 0,
    "reboot_time" : linedataArr[34] || 'NULL',
    "event_remain" : parseInt(linedataArr[35]) || 0,
    "failfirmwareupdate" : parseInt(linedataArr[36]) || 0
  }
  return s_logs;
}

