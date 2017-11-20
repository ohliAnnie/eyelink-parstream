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
var logger = log4js.getLogger('dataCollector');

logger.info('Data Collector has been started.');

logger.info(__dirname);

var fs = require('fs');
var Utils = require('../../routes/util');
var CONSTS = require('../../routes/consts');
var readline = require('linebyline');
var QueryProvider = require('../../routes/dao/elasticsearch/nodelib-es').QueryProvider;
var queryProvider = new QueryProvider();


const datafilepath = process.argv[2];
const bulkSize = 100;     // bulk insert 하는 데이터 count

logger.info('=========================================================');
logger.info('== Data File Path        : ', datafilepath);
logger.info('=========================================================');

var listJsonData = [];
var totalCount = 0;
// Directory 내 파일 list를 읽는다.
fs.readdirSync(datafilepath).forEach(function(file) {
  //
  var match = file.match(/.json/);
  if (match !== null) {
    logger.info('read file : %s', file);

    var lineReader = readline(datafilepath+'/'+file);

    // 실제 라인 단위로 데이터 읽어와서 처리하는 로직 시작.
    lineReader.on('line', function(line, lineCount, byteCount) {
      totalCount++;
      logger.info('%s - json data : %d, %d, %s', file, lineCount, byteCount, line);
      makeListData(file, JSON.parse(line));
    })
    .on('error', function(e) {

    })
    .on('close', function() {
      logger.info('lineRead close start');
      // bulkSize를 다 채우지 못한고 listJsonData에 남은 데이터 DB Insert 처리
      for(var i=0; i<listJsonData.length; i++) {
        var item = listJsonData[i];
        if (item.listData.length > 0) {
          // logger.debug('listData[0] : %s', JSON.stringify(item));
          var index = makeIndexName(item.listData[0]);
          // logger.debug('last data - index : %s, data : %s', JSON.stringify(index), JSON.stringify(item.listData));
          insertData(index, item.listData);
          item.listData = [];
        }
      }

      // logger.debug('listJsonData : %s', JSON.stringify(listJsonData, null, 2));
      logger.info('totalCount : %s', totalCount);
      logger.info('Data Collector finished successfully.');
    });
  }
});

function makeListData(fileName, jData) {
  // logger.debug('start makeListData');
  // 이미 listJsonData에 file명으로 key가 존재하는지 체크
  //   - 존재하면 jsonData.data에 jData만 push
  //   - 존재하지 않으면 list에 jsonData를 추가하고 jData에 Push
  var isExist = false;
  var jsonData;
  for(var i=0; i<listJsonData.length; i++) {
    var item = listJsonData[i];
    if (item.name == fileName) {
      isExist = true;
      jsonData = item;
    }
  };

  // ElasticSearch dateType으로 날짜 형식을 변환
  changeDate(jData);

  logger.debug('name : %s, exist : %s', fileName, isExist);
  if (isExist == true) {
    jsonData.listData.push(jData);

    // listData가 bulkSize가 되면 DB에 Insert한 후 jsonData.listData를 초기화.
    logger.debug('list data length : %s', jsonData.listData.length);
    if (jsonData.listData.length == bulkSize) {
      var index = makeIndexName(jData);
      insertData(index, jsonData.listData);
      jsonData.listData = [];
    }
  } else {
    var item = {name : fileName, listData : []};
    // logger.debug(item);
    item.listData.push(jData);
    listJsonData.push(item);
  }
  // logger.debug('listJsonData2 : %s', JSON.stringify(listJsonData));

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

function printUsage() {
  console.log('Usage : $ node dataCollector.js [data source file path]');
  console.log('    []: required, {}: optional');
  console.log('');
  console.log('Ex. $ node dataCollector.js ./source/efmm');
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