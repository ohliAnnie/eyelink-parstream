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
        'filename': './datasimulator.log',
        'maxLogSize': 1024000,
        'backups': 5,
        'category': 'eyelink'
      }
  },
  'categories' :
  {
    'default' : { 'appenders': ['console', 'file'], 'level' : 'debug'}
  }
});
var logger = log4js.getLogger('dataSimulator');

logger.info('Data Simulator has been started.');

logger.info(__dirname);

var fs = require('fs');
var sleep = require('system-sleep');
var Utils = require('../../routes/util');
var CONSTS = require('../../routes/consts');
var simuldata = require('../../source/efmm/stacking_simulate.json');
var QueryProvider = require('../../routes/dao/elasticsearch/nodelib-es').QueryProvider;
var queryProvider = new QueryProvider();

const bulkSize = 100;     // bulk insert 하는 데이터 count

// simuldata = JSON.parse(simuldata);

logger.info('=========================================================');
logger.info('== Simulate Data      : ', simuldata);
logger.info('=========================================================');

/*
  데이터 발생 조건
    - OEE 기준 : 24 시간 (9:00 ~ 익일 8:59)
    - 12:00 ~ 1:00, 6:00 ~ 7:00 meal time 발생
    - 장비별 4시간마다 1회 Real 교체에 따른 15분 short break 발생
    - 1일 최대 1회, 30분간 Random하게 down time 발생
    - 생산량은 1초당 3개 생산
    - 양품 : 초당 3개
*/
/*
  1초마다 1회 Random(1,1000) 실행 rdx값이
    - 1~990 : 양품 생산 이벤트 발생
    - 991~999 : 불량품 생산 이벤트 발생
    - 1000 : down_time 발생
*/
var accept_count = 0;
var reject_count = 0;
var cnt = 0;
var isInitOEE = false;
var cnt_init_oee = 0;
while(true) {
  var rdx = Utils.generateRandom(1, 1000);
  var curdate = Utils.getToday(CONSTS.DATEFORMAT.DATETIME);
  logger.debug('rdx : %s, today : %s', rdx, curdate);

  curdate = '2017-11-20 09:00:36';
  // 09:00 이면 OEE를 초기화하고 처리한다.
  if (isInitOEE == false && curdate.indexOf(curdate.substring(0,11) + '09:00') > -1) {
    logger.debug('init oee data');
    accept_count = 0;
    reject_count = 0;
    isInitOEE = true;
  } else if (curdate.indexOf(curdate.substring(0,11) + '09:01') > -1) {
    isInitOEE = false;
  }

  if (rdx <= 500) {
    // json data에서 날짜값과 양불량품개수 값을 변경
    setDataInEventData(simuldata.normal_accept, curdate);
    // 누적 양품 생산량 합산
    // simuldata.normal_accept
    logger.debug('stacking data -> normal_accept : %s', JSON.stringify(simuldata.normal_accept.data[0]));
  } else if (rdx > 500 && rdx < 1000) {
    // json data에서 날짜값과 양불량품개수 값을 변경
    setDataInEventData(simuldata.normal_reject, curdate);
    logger.debug('stacking data -> normal_reject : %s', JSON.stringify(simuldata.normal_reject.data[0]));
  } else if (rdx == 1000) {
    // json data에서 날짜값과 양불량품개수 값을 변경
    setDataInEventData(simuldata.down_time, curdate);
    logger.debug('stacking data -> down_time : %s', JSON.stringify(simuldata.down_time.data[0]));
  }

  // for test
  cnt++;
  if (cnt > 1000) break;

  sleep(1000);
}

function setDataInEventData(vJson, curdate) {

  accept_count = accept_count + vJson.data[0].accept_pieces;
  reject_count = reject_count + vJson.data[0].reject_pieces;
  vJson.dtTransmitted = curdate;
  vJson.data[0].dtSensed = curdate;
  vJson.data[0].total_accept_pieces = accept_count;
  vJson.data[0].total_reject_pieces = reject_count;
}

// ElasticSearch dateType으로 날짜 형식을 변환
function changeDate(jData) {
  jData.dtTransmitted = convertDateFormat(jData.dtTransmitted);
  for (var i=0; i<jData.data.length; i++) {
    jData.data[i].dtSensed = convertDateFormat(jData.data[i].dtSensed);
  }
}

function convertDateFormat(val) {
  var v;
  v = val.substring(0,4) + '/' +
    val.substring(4,6) + '/' +
    val.substring(6,8);
  if (val.length >= 14) {
    v = v + ' ' +
      val.substring(8,10) + ':' +
      val.substring(10,12) + ':' +
      val.substring(12,14);
  }
  return v;
}

// ElasticSearch에 입력을 위한 IndexName을 구성.
//   ex) efmm_notching_oee_2017.11.24
function makeIndexName(jData) {
  var indexName = 'EFMM_' + jData.flag.toUpperCase() + '_' + jData.sensorType.toUpperCase();
  var dt = '-' + jData.dtTransmitted.substring(0,10).replace(/\//g, '.');
  return {
    indexName : CONSTS.SCHEMA_EFMM[indexName].INDEX + dt,
    typeName : CONSTS.SCHEMA_EFMM[indexName].TYPE
  };
}

function insertData(index, listData){

  logger.debug('Inserting index : %s, data : %s', index, listData);
  var in_data = {
    index : index.indexName,
    type : index.typeName,
    body : listData
  };
  logger.debug('insertData - indata : %s', JSON.stringify(in_data));
  queryProvider.insertBulkQuery(in_data, function(err, out_data) {
    if (err) { console.log(err) };
    logger.debug(out_data);
    if(out_data.errors == false){
      // console.log(out_data);
      var rtnCode = CONSTS.getErrData("D001");
    }
    logger.info('finished insertData ');

    // cb(err);
  });
}