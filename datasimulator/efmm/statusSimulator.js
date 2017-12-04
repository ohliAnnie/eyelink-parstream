validateArguments(process.argv);

function validateArguments(args) {
  if ( args.length < 5 ) {
    printUsage();
    process.exit();
  }
  var dataTypes = ['a','m'];
  var dataType = args[3].toLowerCase();
  if ( dataTypes.indexOf(dataType) == -1 ) {
    printUsage();
    process.exit();
  }
}

function printUsage() {
  /**
  스택번호는 엘라스틱서치의 인덱스 생성시 사용
  데이타 타입은 알람데이터인지 일반데이터인지를 구분
  데이타 소스 디렉토리 내의 모든 파일을 읽어서 데이터 등록
  **/
  console.log('EFMM Status Simulator v1.0')
  console.log('');
  console.log('Usage : $ node statusSimulator.js [stack number] [data type] [data source dir path]');
  console.log('     []: required');
  console.log('Data Types:');
  console.log('     A, a : Alarm');
  console.log('     M, m : Motor');
  console.log('');
  console.log('Ex. $ node statusSimulator.js 1 a /home/data/alarmdata');
}

const stackNo = process.argv[2];
const dataType = process.argv[3].toLowerCase();
const sourceDir = process.argv[4];
const bulkSize = 200;
const sleepMilisPerItem = 10;

global.log4js = require('log4js');
log4js.configure({
  appenders: { datastore: {type: 'file', filename: './statusSimulator_'+stackNo + '_' + dataType + '.log', 'maxLogSize': 1024000, backups: 5 } },
  categories: { default: { appenders: ['datastore'], level: 'info' } }
});
global.logger = log4js.getLogger('dataStore');

logger.info('=================================================');
logger.info('==== EFMM Status Simulator has been started. ====');
logger.info('=================================================');

var sleep = require('system-sleep');
var fs = require('fs');
var moment = require('moment-timezone');
var DateUtil = require('../../routes/util');
var CONSTS = require('../../routes/consts');
var readLineObj = require('readline');
var QueryProvider = require('./nodelib-es').QueryProvider;
var queryProvider = new QueryProvider();
const dttmFormat = 'YYYY-MM-DD HH:mm:ss';
var type = 'status';

logger.info('== Stact No.    : ', stackNo);
logger.info('== Data Type    : ', dataType);
logger.info('== Source Dir   : ', sourceDir);
logger.info('=========================================================');

var nopf = 0;  // Number of Processed Files

var files = fs.readdirSync(sourceDir);
var isDone = false;
var x = 0;
var loopCount = 1;
while(true){
  logger.info('============== Loop ' + loopCount +' Started ==============');
  for ( var i = 0 ; i < files.length ; i++ ) {
    isDone = false;
    processData(sourceDir, files[i], files.length, ++x);
    while(!isDone) { sleep(10000); }
  }
}

function processData(dirPath, file, nof, x) {

  logger.info('Start processing file ['+file+'] ' + '(' + x + '/' + nof + ')');

  var fullpath = dirPath + '/' + file;

  logger.debug('Processing file ab-path :', fullpath);

  var lineReader = readLineObj.createInterface({
    input: fs.createReadStream(fullpath)
  });

  var rowsProcessed = 0;  // Processed row numbers == Elapsed seconds
  var index = '';
  var processTime = moment(new Date());

// 실제 라인 단위로 데이터 읽어와서 처리하는 로직 시작.
  lineReader.on('line', function (line) {
    if ( rowsProcessed ) {  // 헤더 부분은 처리하지 않도록 하기 위한 조건
      logger.trace('['+file+'] Processing data : ', line);

      var localDttm = processTime.format(dttmFormat);

      logger.debug('localDttm : ', localDttm);

      var utcDttm = DateUtil.getDateLocal2UTC(localDttm, CONSTS.DATEFORMAT.DATETIME,'Y');
      var dataArr = line.split(',');
      if ( dataType == 'a') // 알람 데이터의 경우 가장 좌측 컬럼이 null
        dataArr.shift();

      var indexHeader = CONSTS.SCHEMA_EFMM.EFMM_STACKING_STATUS.INDEX + '-';
      var indexDate = utcDttm.substr(0,10).replace(/-/g,'.');
      index = indexHeader + indexDate;

      var linedataArr = [utcDttm];
      linedataArr = linedataArr.concat(dataArr);

      var jsonData;
      if ( dataType == 'm' ) {
        jsonData = makeJsonForData(stackNo, linedataArr)
      } else {
        jsonData = makeJsonForAlarmData(stackNo, linedataArr);
      }

      logger.debug('['+file+'] Saving data..... on index \'' + index + '\'');
      saveData(index, CONSTS.SCHEMA_EFMM.EFMM_STACKING_STATUS.TYPE, jsonData);
      var curTime = moment(new Date());
      logger.debug('curTime : ',curTime.format(dttmFormat));
      var timeDiffInMillis = curTime.diff(processTime, 'milliseconds');
      logger.debug('timeDiffInMillis : ',timeDiffInMillis);
      if ( timeDiffInMillis < 1000 ){
        sleep(Math.abs(timeDiffInMillis));
      }
      processTime.add(1, 'seconds'); // 1초 증가
    }
    if ( rowsProcessed > 0  && rowsProcessed % 1000 == 0 )
      logger.info('['+file+'] 1000 rows processed.');
    rowsProcessed++;
  })
  .on('close', function() {
    logger.info('['+file+'] Total ' + (rowsProcessed-1) + ' rows processed.');
    isDone = true;
  });
}

function saveData(index, type, data) {
  var doc = {index:index, type:type, id:data.dtTransmitted, body: data };
  logger.trace('saveData : ', doc)
  queryProvider.insert(doc);
}

function makeJsonForData(cid, data) {

  var linedataArr = data;
  var flag = "stacking";
  var type2 = "realtime";
  var sensorType = "motor";

  var jsonData = {
    // "index" : index
    // , "type" : type
    // , "body" : {
        "flag" : flag
      , "type2" : type2
      , "cid" : cid
      , "sensorType" : sensorType
      , "dtTransmitted" : linedataArr[0]
      , "data" : [{
          "measure_time" : linedataArr[0]
        , "sepa_unwind"              : parseInt(linedataArr[1] ) || 0
        , "sepa_epc"                 : parseInt(linedataArr[2] ) || 0
        , "feeding_roll"             : parseInt(linedataArr[3] ) || 0
        , "an_el_supply_x"           : parseInt(linedataArr[4] ) || 0
        , "ca_el_supply_x"           : parseInt(linedataArr[5] ) || 0
        , "an_align_y1"              : parseInt(linedataArr[6] ) || 0
        , "an_align_y2"              : parseInt(linedataArr[7] ) || 0
        , "an_align_x"               : parseInt(linedataArr[8] ) || 0
        , "an_el_supply_z"           : parseInt(linedataArr[9] ) || 0
        , "ca_el_supply_z"           : parseInt(linedataArr[10]) || 0
        , "ca_align_y1"              : parseInt(linedataArr[11]) || 0
        , "ca_align_y2"              : parseInt(linedataArr[12]) || 0
        , "ca_align_x"               : parseInt(linedataArr[13]) || 0
        , "sepa_guide_y"             : parseInt(linedataArr[14]) || 0
        , "sub_epc"                  : parseInt(linedataArr[15]) || 0
        , "swing_s"                  : parseInt(linedataArr[16]) || 0
        , "swing_an_z"               : parseInt(linedataArr[17]) || 0
        , "swing_ca_z"               : parseInt(linedataArr[18]) || 0
        , "stack_table_z"            : parseInt(linedataArr[19]) || 0
        , "stack_anode_mandrel_x1"   : parseInt(linedataArr[20]) || 0
        , "stack_anode_mandrel_x2"   : parseInt(linedataArr[21]) || 0
        , "stack_anode_mandrel_z"    : parseInt(linedataArr[22]) || 0
        , "stack_cathode_mandrel_x1" : parseInt(linedataArr[23]) || 0
        , "stack_cathode_mandrel_x2" : parseInt(linedataArr[24]) || 0
        , "stack_cathode_mandrel_z"  : parseInt(linedataArr[25]) || 0
        , "cutter_y"                 : parseInt(linedataArr[26]) || 0
        , "pull_s"                   : parseInt(linedataArr[27]) || 0
        , "pull_y"                   : parseInt(linedataArr[28]) || 0
        , "winder_x1"                : parseInt(linedataArr[29]) || 0
        , "winder_x2"                : parseInt(linedataArr[30]) || 0
        , "winder_s1"                : parseInt(linedataArr[31]) || 0
        , "winder_s2"                : parseInt(linedataArr[32]) || 0
        , "bonding_x"                : parseInt(linedataArr[33]) || 0
        , "bonding_z"                : parseInt(linedataArr[34]) || 0
        , "turn_table_x"             : parseInt(linedataArr[35]) || 0
        , "turn_table_s"             : parseInt(linedataArr[36]) || 0
        , "unloader_y"               : parseInt(linedataArr[37]) || 0
        , "an_mgn_l_z"               : parseInt(linedataArr[38]) || 0
        , "an_el_l_z"                : parseInt(linedataArr[39]) || 0
        , "ca_mgn_l_z"               : parseInt(linedataArr[40]) || 0
        , "ca_el_l_z"                : parseInt(linedataArr[41]) || 0
        , "unloader_z"               : parseInt(linedataArr[42]) || 0
        , "stack_sepa_guide_z"       : parseInt(linedataArr[43]) || 0
        , "swing_an_z-sub"           : parseInt(linedataArr[44]) || 0
        , "swing_ca_z-sub"			     : parseInt(linedataArr[45]) || 0
      }]
    // }
  }
  return jsonData;
}

function makeJsonForAlarmData(cid, data) {

  var linedataArr = data;
  var flag = "stacking";
  var type2 = "realtime";
  var sensorType = "alarm";

  var jsonData = {
    // "index" : index
    // , "type" : type
    // , "body" : {
        "flag" : flag
      , "type2" : type2
      , "cid" : cid
      , "sensorType" : "alarm"
      , "dtTransmitted" : linedataArr[0]
      , "data" : [{
          "measure_time" : linedataArr[0]
        , "L10000" : parseInt(linedataArr[1])
        , "L10001" : parseInt(linedataArr[2])
        , "L10002" : parseInt(linedataArr[3])
        , "L10003" : parseInt(linedataArr[4])
        , "L10004" : parseInt(linedataArr[5])
        , "L10005" : parseInt(linedataArr[6])
        , "L10006" : parseInt(linedataArr[7])
        , "L10007" : parseInt(linedataArr[8])
        , "L10008" : parseInt(linedataArr[9])
        , "L10009" : parseInt(linedataArr[10])
        , "L10010" : parseInt(linedataArr[11])
        , "L10011" : parseInt(linedataArr[12])
        , "L10012" : parseInt(linedataArr[13])
        , "L10013" : parseInt(linedataArr[14])
        , "L10014" : parseInt(linedataArr[15])
        , "L10015" : parseInt(linedataArr[16])
        , "L10016" : parseInt(linedataArr[17])
        , "L10017" : parseInt(linedataArr[18])
        , "L10018" : parseInt(linedataArr[19])
        , "L10019" : parseInt(linedataArr[20])
        , "L10020" : parseInt(linedataArr[21])
        , "L10021" : parseInt(linedataArr[22])
        , "L10022" : parseInt(linedataArr[23])
        , "L10023" : parseInt(linedataArr[24])
        , "L10024" : parseInt(linedataArr[25])
        , "L10025" : parseInt(linedataArr[26])
        , "L10026" : parseInt(linedataArr[27])
        , "L10027" : parseInt(linedataArr[28])
        , "L10028" : parseInt(linedataArr[29])
        , "L10029" : parseInt(linedataArr[30])
        , "L10030" : parseInt(linedataArr[31])
        , "L10031" : parseInt(linedataArr[32])
        , "L10032" : parseInt(linedataArr[33])
        , "L10033" : parseInt(linedataArr[34])
        , "L10034" : parseInt(linedataArr[35])
        , "L10035" : parseInt(linedataArr[36])
        , "L10036" : parseInt(linedataArr[37])
        , "L10037" : parseInt(linedataArr[38])
        , "L10038" : parseInt(linedataArr[39])
        , "L10039" : parseInt(linedataArr[40])
        , "L10040" : parseInt(linedataArr[41])
        , "L10041" : parseInt(linedataArr[42])
        , "L10042" : parseInt(linedataArr[43])
        , "L10043" : parseInt(linedataArr[44])
        , "L10044" : parseInt(linedataArr[45])
        , "L10045" : parseInt(linedataArr[46])
        , "L10046" : parseInt(linedataArr[47])
        , "L10047" : parseInt(linedataArr[48])
        , "L10048" : parseInt(linedataArr[49])
        , "L10049" : parseInt(linedataArr[50])
        , "L10050" : parseInt(linedataArr[51])
        , "L10051" : parseInt(linedataArr[52])
        , "L10052" : parseInt(linedataArr[53])
        , "L10053" : parseInt(linedataArr[54])
        , "L10054" : parseInt(linedataArr[55])
        , "L10055" : parseInt(linedataArr[56])
        , "L10056" : parseInt(linedataArr[57])
        , "L10057" : parseInt(linedataArr[58])
        , "L10058" : parseInt(linedataArr[59])
        , "L10059" : parseInt(linedataArr[60])
        , "L10060" : parseInt(linedataArr[61])
        , "L10061" : parseInt(linedataArr[62])
        , "L10062" : parseInt(linedataArr[63])
        , "L10063" : parseInt(linedataArr[64])
        , "L10064" : parseInt(linedataArr[65])
        , "L10065" : parseInt(linedataArr[66])
        , "L10066" : parseInt(linedataArr[67])
        , "L10067" : parseInt(linedataArr[68])
        , "L10068" : parseInt(linedataArr[69])
        , "L10069" : parseInt(linedataArr[70])
        , "L10070" : parseInt(linedataArr[71])
        , "L10071" : parseInt(linedataArr[72])
        , "L10072" : parseInt(linedataArr[73])
        , "L10073" : parseInt(linedataArr[74])
        , "L10074" : parseInt(linedataArr[75])
        , "L10075" : parseInt(linedataArr[76])
        , "L10076" : parseInt(linedataArr[77])
        , "L10077" : parseInt(linedataArr[78])
        , "L10078" : parseInt(linedataArr[79])
        , "L10079" : parseInt(linedataArr[80])
        , "L10080" : parseInt(linedataArr[81])
        , "L10081" : parseInt(linedataArr[82])
        , "L10082" : parseInt(linedataArr[83])
        , "L10083" : parseInt(linedataArr[84])
        , "L10084" : parseInt(linedataArr[85])
        , "L10085" : parseInt(linedataArr[86])
        , "L10086" : parseInt(linedataArr[87])
        , "L10087" : parseInt(linedataArr[88])
        , "L10088" : parseInt(linedataArr[89])
        , "L10089" : parseInt(linedataArr[90])
        , "L10090" : parseInt(linedataArr[91])
        , "L10091" : parseInt(linedataArr[92])
        , "L10092" : parseInt(linedataArr[93])
        , "L10093" : parseInt(linedataArr[94])
        , "L10094" : parseInt(linedataArr[95])
        , "L10095" : parseInt(linedataArr[96])
        , "L10096" : parseInt(linedataArr[97])
        , "L10097" : parseInt(linedataArr[98])
        , "L10098" : parseInt(linedataArr[99])
        , "L10099" : parseInt(linedataArr[100])
        , "L10100" : parseInt(linedataArr[101])
        , "L10101" : parseInt(linedataArr[102])
        , "L10102" : parseInt(linedataArr[103])
        , "L10103" : parseInt(linedataArr[104])
        , "L10104" : parseInt(linedataArr[105])
        , "L10105" : parseInt(linedataArr[106])
        , "L10106" : parseInt(linedataArr[107])
        , "L10107" : parseInt(linedataArr[108])
        , "L10108" : parseInt(linedataArr[109])
        , "L10109" : parseInt(linedataArr[110])
        , "L10110" : parseInt(linedataArr[111])
        , "L10111" : parseInt(linedataArr[112])
        , "L10112" : parseInt(linedataArr[113])
        , "L10113" : parseInt(linedataArr[114])
        , "L10114" : parseInt(linedataArr[115])
        , "L10115" : parseInt(linedataArr[116])
        , "L10116" : parseInt(linedataArr[117])
        , "L10117" : parseInt(linedataArr[118])
        , "L10118" : parseInt(linedataArr[119])
        , "L10119" : parseInt(linedataArr[120])
        , "L10120" : parseInt(linedataArr[121])
        , "L10121" : parseInt(linedataArr[122])
        , "L10122" : parseInt(linedataArr[123])
        , "L10123" : parseInt(linedataArr[124])
        , "L10124" : parseInt(linedataArr[125])
        , "L10125" : parseInt(linedataArr[126])
        , "L10126" : parseInt(linedataArr[127])
        , "L10127" : parseInt(linedataArr[128])
        , "L10128" : parseInt(linedataArr[129])
        , "L10129" : parseInt(linedataArr[130])
        , "L10130" : parseInt(linedataArr[131])
        , "L10131" : parseInt(linedataArr[132])
        , "L10132" : parseInt(linedataArr[133])
        , "L10133" : parseInt(linedataArr[134])
        , "L10134" : parseInt(linedataArr[135])
        , "L10135" : parseInt(linedataArr[136])
        , "L10136" : parseInt(linedataArr[137])
        , "L10137" : parseInt(linedataArr[138])
        , "L10138" : parseInt(linedataArr[139])
        , "L10139" : parseInt(linedataArr[140])
        , "L10140" : parseInt(linedataArr[141])
        , "L10141" : parseInt(linedataArr[142])
        , "L10142" : parseInt(linedataArr[143])
        , "L10143" : parseInt(linedataArr[144])
        , "L10144" : parseInt(linedataArr[145])
        , "L10145" : parseInt(linedataArr[146])
        , "L10146" : parseInt(linedataArr[147])
        , "L10147" : parseInt(linedataArr[148])
        , "L10148" : parseInt(linedataArr[149])
        , "L10149" : parseInt(linedataArr[150])
        , "L10150" : parseInt(linedataArr[151])
        , "L10151" : parseInt(linedataArr[152])
        , "L10152" : parseInt(linedataArr[153])
        , "L10153" : parseInt(linedataArr[154])
        , "L10154" : parseInt(linedataArr[155])
        , "L10155" : parseInt(linedataArr[156])
        , "L10156" : parseInt(linedataArr[157])
        , "L10157" : parseInt(linedataArr[158])
        , "L10158" : parseInt(linedataArr[159])
        , "L10159" : parseInt(linedataArr[160])
        , "L10160" : parseInt(linedataArr[161])
        , "L10161" : parseInt(linedataArr[162])
        , "L10162" : parseInt(linedataArr[163])
        , "L10163" : parseInt(linedataArr[164])
        , "L10164" : parseInt(linedataArr[165])
        , "L10165" : parseInt(linedataArr[166])
        , "L10166" : parseInt(linedataArr[167])
        , "L10167" : parseInt(linedataArr[168])
        , "L10168" : parseInt(linedataArr[169])
        , "L10169" : parseInt(linedataArr[170])
        , "L10170" : parseInt(linedataArr[171])
        , "L10171" : parseInt(linedataArr[172])
        , "L10172" : parseInt(linedataArr[173])
        , "L10173" : parseInt(linedataArr[174])
        , "L10174" : parseInt(linedataArr[175])
        , "L10175" : parseInt(linedataArr[176])
        , "L10176" : parseInt(linedataArr[177])
        , "L10177" : parseInt(linedataArr[178])
        , "L10178" : parseInt(linedataArr[179])
        , "L10179" : parseInt(linedataArr[180])
        , "L10180" : parseInt(linedataArr[181])
        , "L10181" : parseInt(linedataArr[182])
        , "L10182" : parseInt(linedataArr[183])
        , "L10183" : parseInt(linedataArr[184])
        , "L10184" : parseInt(linedataArr[185])
        , "L10185" : parseInt(linedataArr[186])
        , "L10186" : parseInt(linedataArr[187])
        , "L10187" : parseInt(linedataArr[188])
        , "L10188" : parseInt(linedataArr[189])
        , "L10189" : parseInt(linedataArr[190])
        , "L10190" : parseInt(linedataArr[191])
        , "L10191" : parseInt(linedataArr[192])
        , "L10192" : parseInt(linedataArr[193])
        , "L10193" : parseInt(linedataArr[194])
        , "L10194" : parseInt(linedataArr[195])
        , "L10195" : parseInt(linedataArr[196])
        , "L10196" : parseInt(linedataArr[197])
        , "L10197" : parseInt(linedataArr[198])
        , "L10198" : parseInt(linedataArr[199])
        , "L10199" : parseInt(linedataArr[200])
        , "L10200" : parseInt(linedataArr[201])
        , "L10201" : parseInt(linedataArr[202])
        , "L10202" : parseInt(linedataArr[203])
        , "L10203" : parseInt(linedataArr[204])
        , "L10204" : parseInt(linedataArr[205])
        , "L10205" : parseInt(linedataArr[206])
        , "L10206" : parseInt(linedataArr[207])
        , "L10207" : parseInt(linedataArr[208])
        , "L10208" : parseInt(linedataArr[209])
        , "L10209" : parseInt(linedataArr[210])
        , "L10210" : parseInt(linedataArr[211])
        , "L10211" : parseInt(linedataArr[212])
        , "L10212" : parseInt(linedataArr[213])
        , "L10213" : parseInt(linedataArr[214])
        , "L10214" : parseInt(linedataArr[215])
        , "L10215" : parseInt(linedataArr[216])
        , "L10216" : parseInt(linedataArr[217])
        , "L10217" : parseInt(linedataArr[218])
        , "L10218" : parseInt(linedataArr[219])
        , "L10219" : parseInt(linedataArr[220])
        , "L10220" : parseInt(linedataArr[221])
        , "L10221" : parseInt(linedataArr[222])
        , "L10222" : parseInt(linedataArr[223])
        , "L10223" : parseInt(linedataArr[224])
        , "L10224" : parseInt(linedataArr[225])
        , "L10225" : parseInt(linedataArr[226])
        , "L10226" : parseInt(linedataArr[227])
        , "L10227" : parseInt(linedataArr[228])
        , "L10228" : parseInt(linedataArr[229])
        , "L10229" : parseInt(linedataArr[230])
        , "L10230" : parseInt(linedataArr[231])
        , "L10231" : parseInt(linedataArr[232])
        , "L10232" : parseInt(linedataArr[233])
        , "L10233" : parseInt(linedataArr[234])
        , "L10234" : parseInt(linedataArr[235])
        , "L10235" : parseInt(linedataArr[236])
        , "L10236" : parseInt(linedataArr[237])
        , "L10237" : parseInt(linedataArr[238])
        , "L10238" : parseInt(linedataArr[239])
        , "L10239" : parseInt(linedataArr[240])
        , "L10240" : parseInt(linedataArr[241])
        , "L10241" : parseInt(linedataArr[242])
        , "L10242" : parseInt(linedataArr[243])
        , "L10243" : parseInt(linedataArr[244])
        , "L10244" : parseInt(linedataArr[245])
        , "L10245" : parseInt(linedataArr[246])
        , "L10246" : parseInt(linedataArr[247])
        , "L10247" : parseInt(linedataArr[248])
        , "L10248" : parseInt(linedataArr[249])
        , "L10249" : parseInt(linedataArr[250])
        , "L10250" : parseInt(linedataArr[251])
        , "L10251" : parseInt(linedataArr[252])
        , "L10252" : parseInt(linedataArr[253])
        , "L10253" : parseInt(linedataArr[254])
        , "L10254" : parseInt(linedataArr[255])
        , "L10255" : parseInt(linedataArr[256])
        , "L10256" : parseInt(linedataArr[257])
        , "L10257" : parseInt(linedataArr[258])
        , "L10258" : parseInt(linedataArr[259])
        , "L10259" : parseInt(linedataArr[260])
        , "L10260" : parseInt(linedataArr[261])
        , "L10261" : parseInt(linedataArr[262])
        , "L10262" : parseInt(linedataArr[263])
        , "L10263" : parseInt(linedataArr[264])
        , "L10264" : parseInt(linedataArr[265])
        , "L10265" : parseInt(linedataArr[266])
        , "L10266" : parseInt(linedataArr[267])
        , "L10267" : parseInt(linedataArr[268])
        , "L10268" : parseInt(linedataArr[269])
        , "L10269" : parseInt(linedataArr[270])
        , "L10270" : parseInt(linedataArr[271])
        , "L10271" : parseInt(linedataArr[272])
        , "L10272" : parseInt(linedataArr[273])
        , "L10273" : parseInt(linedataArr[274])
        , "L10274" : parseInt(linedataArr[275])
        , "L10275" : parseInt(linedataArr[276])
        , "L10276" : parseInt(linedataArr[277])
        , "L10277" : parseInt(linedataArr[278])
        , "L10278" : parseInt(linedataArr[279])
        , "L10279" : parseInt(linedataArr[280])
        , "L10280" : parseInt(linedataArr[281])
        , "L10281" : parseInt(linedataArr[282])
        , "L10282" : parseInt(linedataArr[283])
        , "L10283" : parseInt(linedataArr[284])
        , "L10284" : parseInt(linedataArr[285])
        , "L10285" : parseInt(linedataArr[286])
        , "L10286" : parseInt(linedataArr[287])
        , "L10287" : parseInt(linedataArr[288])
        , "L10288" : parseInt(linedataArr[289])
        , "L10289" : parseInt(linedataArr[290])
        , "L10290" : parseInt(linedataArr[291])
        , "L10291" : parseInt(linedataArr[292])
        , "L10292" : parseInt(linedataArr[293])
        , "L10293" : parseInt(linedataArr[294])
        , "L10294" : parseInt(linedataArr[295])
        , "L10295" : parseInt(linedataArr[296])
        , "L10296" : parseInt(linedataArr[297])
        , "L10297" : parseInt(linedataArr[298])
        , "L10298" : parseInt(linedataArr[299])
        , "L10299" : parseInt(linedataArr[300])
        , "L10300" : parseInt(linedataArr[301])
        , "L10301" : parseInt(linedataArr[302])
        , "L10302" : parseInt(linedataArr[303])
        , "L10303" : parseInt(linedataArr[304])
        , "L10304" : parseInt(linedataArr[305])
        , "L10305" : parseInt(linedataArr[306])
        , "L10306" : parseInt(linedataArr[307])
        , "L10307" : parseInt(linedataArr[308])
        , "L10308" : parseInt(linedataArr[309])
        , "L10309" : parseInt(linedataArr[310])
        , "L10310" : parseInt(linedataArr[311])
        , "L10311" : parseInt(linedataArr[312])
        , "L10312" : parseInt(linedataArr[313])
        , "L10313" : parseInt(linedataArr[314])
        , "L10314" : parseInt(linedataArr[315])
        , "L10315" : parseInt(linedataArr[316])
        , "L10316" : parseInt(linedataArr[317])
        , "L10317" : parseInt(linedataArr[318])
        , "L10318" : parseInt(linedataArr[319])
        , "L10319" : parseInt(linedataArr[320])
        , "L10320" : parseInt(linedataArr[321])
        , "L10321" : parseInt(linedataArr[322])
        , "L10322" : parseInt(linedataArr[323])
        , "L10323" : parseInt(linedataArr[324])
        , "L10324" : parseInt(linedataArr[325])
        , "L10325" : parseInt(linedataArr[326])
        , "L10326" : parseInt(linedataArr[327])
        , "L10327" : parseInt(linedataArr[328])
        , "L10328" : parseInt(linedataArr[329])
        , "L10329" : parseInt(linedataArr[330])
        , "L10330" : parseInt(linedataArr[331])
        , "L10331" : parseInt(linedataArr[332])
        , "L10332" : parseInt(linedataArr[333])
        , "L10333" : parseInt(linedataArr[334])
        , "L10334" : parseInt(linedataArr[335])
        , "L10335" : parseInt(linedataArr[336])
        , "L10336" : parseInt(linedataArr[337])
        , "L10337" : parseInt(linedataArr[338])
        , "L10338" : parseInt(linedataArr[339])
        , "L10339" : parseInt(linedataArr[340])
        , "L10340" : parseInt(linedataArr[341])
        , "L10341" : parseInt(linedataArr[342])
        , "L10342" : parseInt(linedataArr[343])
        , "L10343" : parseInt(linedataArr[344])
        , "L10344" : parseInt(linedataArr[345])
        , "L10345" : parseInt(linedataArr[346])
        , "L10346" : parseInt(linedataArr[347])
        , "L10347" : parseInt(linedataArr[348])
        , "L10348" : parseInt(linedataArr[349])
        , "L10349" : parseInt(linedataArr[350])
        , "L10350" : parseInt(linedataArr[351])
        , "L10351" : parseInt(linedataArr[352])
        , "L10352" : parseInt(linedataArr[353])
        , "L10353" : parseInt(linedataArr[354])
        , "L10354" : parseInt(linedataArr[355])
        , "L10355" : parseInt(linedataArr[356])
        , "L10356" : parseInt(linedataArr[357])
        , "L10357" : parseInt(linedataArr[358])
        , "L10358" : parseInt(linedataArr[359])
        , "L10359" : parseInt(linedataArr[360])
        , "L10360" : parseInt(linedataArr[361])
        , "L10361" : parseInt(linedataArr[362])
        , "L10362" : parseInt(linedataArr[363])
        , "L10363" : parseInt(linedataArr[364])
        , "L10364" : parseInt(linedataArr[365])
        , "L10365" : parseInt(linedataArr[366])
        , "L10366" : parseInt(linedataArr[367])
        , "L10367" : parseInt(linedataArr[368])
        , "L10368" : parseInt(linedataArr[369])
        , "L10369" : parseInt(linedataArr[370])
        , "L10370" : parseInt(linedataArr[371])
        , "L10371" : parseInt(linedataArr[372])
        , "L10372" : parseInt(linedataArr[373])
        , "L10373" : parseInt(linedataArr[374])
        , "L10374" : parseInt(linedataArr[375])
        , "L10375" : parseInt(linedataArr[376])
        , "L10376" : parseInt(linedataArr[377])
        , "L10377" : parseInt(linedataArr[378])
        , "L10378" : parseInt(linedataArr[379])
        , "L10379" : parseInt(linedataArr[380])
        , "L10380" : parseInt(linedataArr[381])
        , "L10381" : parseInt(linedataArr[382])
        , "L10382" : parseInt(linedataArr[383])
        , "L10383" : parseInt(linedataArr[384])
        , "L10384" : parseInt(linedataArr[385])
        , "L10385" : parseInt(linedataArr[386])
        , "L10386" : parseInt(linedataArr[387])
        , "L10387" : parseInt(linedataArr[388])
        , "L10388" : parseInt(linedataArr[389])
        , "L10389" : parseInt(linedataArr[390])
        , "L10390" : parseInt(linedataArr[391])
        , "L10391" : parseInt(linedataArr[392])
        , "L10392" : parseInt(linedataArr[393])
        , "L10393" : parseInt(linedataArr[394])
        , "L10394" : parseInt(linedataArr[395])
        , "L10395" : parseInt(linedataArr[396])
        , "L10396" : parseInt(linedataArr[397])
        , "L10397" : parseInt(linedataArr[398])
        , "L10398" : parseInt(linedataArr[399])
        , "L10399" : parseInt(linedataArr[400])
        , "L10400" : parseInt(linedataArr[401])
        , "L10401" : parseInt(linedataArr[402])
        , "L10402" : parseInt(linedataArr[403])
        , "L10403" : parseInt(linedataArr[404])
        , "L10404" : parseInt(linedataArr[405])
        , "L10405" : parseInt(linedataArr[406])
        , "L10406" : parseInt(linedataArr[407])
        , "L10407" : parseInt(linedataArr[408])
        , "L10408" : parseInt(linedataArr[409])
        , "L10409" : parseInt(linedataArr[410])
        , "L10410" : parseInt(linedataArr[411])
        , "L10411" : parseInt(linedataArr[412])
        , "L10412" : parseInt(linedataArr[413])
        , "L10413" : parseInt(linedataArr[414])
        , "L10414" : parseInt(linedataArr[415])
        , "L10415" : parseInt(linedataArr[416])
        , "L10416" : parseInt(linedataArr[417])
        , "L10417" : parseInt(linedataArr[418])
        , "L10418" : parseInt(linedataArr[419])
        , "L10419" : parseInt(linedataArr[420])
        , "L10420" : parseInt(linedataArr[421])
        , "L10421" : parseInt(linedataArr[422])
        , "L10422" : parseInt(linedataArr[423])
        , "L10423" : parseInt(linedataArr[424])
        , "L10424" : parseInt(linedataArr[425])
        , "L10425" : parseInt(linedataArr[426])
        , "L10426" : parseInt(linedataArr[427])
        , "L10427" : parseInt(linedataArr[428])
        , "L10428" : parseInt(linedataArr[429])
        , "L10429" : parseInt(linedataArr[430])
        , "L10430" : parseInt(linedataArr[431])
        , "L10431" : parseInt(linedataArr[432])
        , "L10432" : parseInt(linedataArr[433])
        , "L10433" : parseInt(linedataArr[434])
        , "L10434" : parseInt(linedataArr[435])
        , "L10435" : parseInt(linedataArr[436])
        , "L10436" : parseInt(linedataArr[437])
        , "L10437" : parseInt(linedataArr[438])
        , "L10438" : parseInt(linedataArr[439])
        , "L10439" : parseInt(linedataArr[440])
        , "L10440" : parseInt(linedataArr[441])
        , "L10441" : parseInt(linedataArr[442])
        , "L10442" : parseInt(linedataArr[443])
        , "L10443" : parseInt(linedataArr[444])
        , "L10444" : parseInt(linedataArr[445])
        , "L10445" : parseInt(linedataArr[446])
        , "L10446" : parseInt(linedataArr[447])
        , "L10447" : parseInt(linedataArr[448])
        , "L10448" : parseInt(linedataArr[449])
        , "L10449" : parseInt(linedataArr[450])
        , "L10450" : parseInt(linedataArr[451])
        , "L10451" : parseInt(linedataArr[452])
        , "L10452" : parseInt(linedataArr[453])
        , "L10453" : parseInt(linedataArr[454])
        , "L10454" : parseInt(linedataArr[455])
        , "L10455" : parseInt(linedataArr[456])
        , "L10456" : parseInt(linedataArr[457])
        , "L10457" : parseInt(linedataArr[458])
        , "L10458" : parseInt(linedataArr[459])
        , "L10459" : parseInt(linedataArr[460])
        , "L10460" : parseInt(linedataArr[461])
        , "L10461" : parseInt(linedataArr[462])
        , "L10462" : parseInt(linedataArr[463])
        , "L10463" : parseInt(linedataArr[464])
        , "L10464" : parseInt(linedataArr[465])
        , "L10465" : parseInt(linedataArr[466])
        , "L10466" : parseInt(linedataArr[467])
        , "L10467" : parseInt(linedataArr[468])
        , "L10468" : parseInt(linedataArr[469])
        , "L10469" : parseInt(linedataArr[470])
        , "L10470" : parseInt(linedataArr[471])
        , "L10471" : parseInt(linedataArr[472])
        , "L10472" : parseInt(linedataArr[473])
        , "L10473" : parseInt(linedataArr[474])
        , "L10474" : parseInt(linedataArr[475])
        , "L10475" : parseInt(linedataArr[476])
        , "L10476" : parseInt(linedataArr[477])
        , "L10477" : parseInt(linedataArr[478])
        , "L10478" : parseInt(linedataArr[479])
        , "L10479" : parseInt(linedataArr[480])
        , "L10480" : parseInt(linedataArr[481])
        , "L10481" : parseInt(linedataArr[482])
        , "L10482" : parseInt(linedataArr[483])
        , "L10483" : parseInt(linedataArr[484])
        , "L10484" : parseInt(linedataArr[485])
        , "L10485" : parseInt(linedataArr[486])
        , "L10486" : parseInt(linedataArr[487])
        , "L10487" : parseInt(linedataArr[488])
        , "L10488" : parseInt(linedataArr[489])
        , "L10489" : parseInt(linedataArr[490])
        , "L10490" : parseInt(linedataArr[491])
        , "L10491" : parseInt(linedataArr[492])
        , "L10492" : parseInt(linedataArr[493])
        , "L10493" : parseInt(linedataArr[494])
        , "L10494" : parseInt(linedataArr[495])
        , "L10495" : parseInt(linedataArr[496])
        , "L10496" : parseInt(linedataArr[497])
        , "L10497" : parseInt(linedataArr[498])
        , "L10498" : parseInt(linedataArr[499])
        , "L10499" : parseInt(linedataArr[500])
        , "L10500" : parseInt(linedataArr[501])
        , "L10501" : parseInt(linedataArr[502])
        , "L10502" : parseInt(linedataArr[503])
        , "L10503" : parseInt(linedataArr[504])
        , "L10504" : parseInt(linedataArr[505])
        , "L10505" : parseInt(linedataArr[506])
        , "L10506" : parseInt(linedataArr[507])
        , "L10507" : parseInt(linedataArr[508])
        , "L10508" : parseInt(linedataArr[509])
        , "L10509" : parseInt(linedataArr[510])
        , "L10510" : parseInt(linedataArr[511])
        , "L10511" : parseInt(linedataArr[512])
        , "L10512" : parseInt(linedataArr[513])
        , "L10513" : parseInt(linedataArr[514])
        , "L10514" : parseInt(linedataArr[515])
        , "L10515" : parseInt(linedataArr[516])
        , "L10516" : parseInt(linedataArr[517])
        , "L10517" : parseInt(linedataArr[518])
        , "L10518" : parseInt(linedataArr[519])
        , "L10519" : parseInt(linedataArr[520])
        , "L10520" : parseInt(linedataArr[521])
        , "L10521" : parseInt(linedataArr[522])
        , "L10522" : parseInt(linedataArr[523])
        , "L10523" : parseInt(linedataArr[524])
        , "L10524" : parseInt(linedataArr[525])
        , "L10525" : parseInt(linedataArr[526])
        , "L10526" : parseInt(linedataArr[527])
        , "L10527" : parseInt(linedataArr[528])
        , "L10528" : parseInt(linedataArr[529])
        , "L10529" : parseInt(linedataArr[530])
        , "L10530" : parseInt(linedataArr[531])
        , "L10531" : parseInt(linedataArr[532])
        , "L10532" : parseInt(linedataArr[533])
        , "L10533" : parseInt(linedataArr[534])
        , "L10534" : parseInt(linedataArr[535])
        , "L10535" : parseInt(linedataArr[536])
        , "L10536" : parseInt(linedataArr[537])
        , "L10537" : parseInt(linedataArr[538])
        , "L10538" : parseInt(linedataArr[539])
        , "L10539" : parseInt(linedataArr[540])
        , "L10540" : parseInt(linedataArr[541])
        , "L10541" : parseInt(linedataArr[542])
        , "L10542" : parseInt(linedataArr[543])
        , "L10543" : parseInt(linedataArr[544])
        , "L10544" : parseInt(linedataArr[545])
        , "L10545" : parseInt(linedataArr[546])
        , "L10546" : parseInt(linedataArr[547])
        , "L10547" : parseInt(linedataArr[548])
        , "L10548" : parseInt(linedataArr[549])
        , "L10549" : parseInt(linedataArr[550])
        , "L10550" : parseInt(linedataArr[551])
        , "L10551" : parseInt(linedataArr[552])
        , "L10552" : parseInt(linedataArr[553])
        , "L10553" : parseInt(linedataArr[554])
        , "L10554" : parseInt(linedataArr[555])
        , "L10555" : parseInt(linedataArr[556])
        , "L10556" : parseInt(linedataArr[557])
        , "L10557" : parseInt(linedataArr[558])
        , "L10558" : parseInt(linedataArr[559])
        , "L10559" : parseInt(linedataArr[560])
        , "L10560" : parseInt(linedataArr[561])
        , "L10561" : parseInt(linedataArr[562])
        , "L10562" : parseInt(linedataArr[563])
        , "L10563" : parseInt(linedataArr[564])
        , "L10564" : parseInt(linedataArr[565])
        , "L10565" : parseInt(linedataArr[566])
        , "L10566" : parseInt(linedataArr[567])
        , "L10567" : parseInt(linedataArr[568])
        , "L10568" : parseInt(linedataArr[569])
        , "L10569" : parseInt(linedataArr[570])
        , "L10570" : parseInt(linedataArr[571])
        , "L10571" : parseInt(linedataArr[572])
        , "L10572" : parseInt(linedataArr[573])
        , "L10573" : parseInt(linedataArr[574])
        , "L10574" : parseInt(linedataArr[575])
        , "L10575" : parseInt(linedataArr[576])
        , "L10576" : parseInt(linedataArr[577])
        , "L10577" : parseInt(linedataArr[578])
        , "L10578" : parseInt(linedataArr[579])
        , "L10579" : parseInt(linedataArr[580])
        , "L10580" : parseInt(linedataArr[581])
        , "L10581" : parseInt(linedataArr[582])
        , "L10582" : parseInt(linedataArr[583])
        , "L10583" : parseInt(linedataArr[584])
        , "L10584" : parseInt(linedataArr[585])
        , "L10585" : parseInt(linedataArr[586])
        , "L10586" : parseInt(linedataArr[587])
        , "L10587" : parseInt(linedataArr[588])
        , "L10588" : parseInt(linedataArr[589])
        , "L10589" : parseInt(linedataArr[590])
        , "L10590" : parseInt(linedataArr[591])
        , "L10591" : parseInt(linedataArr[592])
        , "L10592" : parseInt(linedataArr[593])
        , "L10593" : parseInt(linedataArr[594])
        , "L10594" : parseInt(linedataArr[595])
        , "L10595" : parseInt(linedataArr[596])
        , "L10596" : parseInt(linedataArr[597])
        , "L10597" : parseInt(linedataArr[598])
        , "L10598" : parseInt(linedataArr[599])
        , "L10599" : parseInt(linedataArr[600])
        , "L10600" : parseInt(linedataArr[601])
        , "L10601" : parseInt(linedataArr[602])
        , "L10602" : parseInt(linedataArr[603])
        , "L10603" : parseInt(linedataArr[604])
        , "L10604" : parseInt(linedataArr[605])
        , "L10605" : parseInt(linedataArr[606])
        , "L10606" : parseInt(linedataArr[607])
        , "L10607" : parseInt(linedataArr[608])
        , "L10608" : parseInt(linedataArr[609])
        , "L10609" : parseInt(linedataArr[610])
        , "L10610" : parseInt(linedataArr[611])
        , "L10611" : parseInt(linedataArr[612])
        , "L10612" : parseInt(linedataArr[613])
        , "L10613" : parseInt(linedataArr[614])
        , "L10614" : parseInt(linedataArr[615])
        , "L10615" : parseInt(linedataArr[616])
        , "L10616" : parseInt(linedataArr[617])
        , "L10617" : parseInt(linedataArr[618])
        , "L10618" : parseInt(linedataArr[619])
        , "L10619" : parseInt(linedataArr[620])
        , "L10620" : parseInt(linedataArr[621])
        , "L10621" : parseInt(linedataArr[622])
        , "L10622" : parseInt(linedataArr[623])
        , "L10623" : parseInt(linedataArr[624])
        , "L10624" : parseInt(linedataArr[625])
        , "L10625" : parseInt(linedataArr[626])
        , "L10626" : parseInt(linedataArr[627])
        , "L10627" : parseInt(linedataArr[628])
        , "L10628" : parseInt(linedataArr[629])
        , "L10629" : parseInt(linedataArr[630])
        , "L10630" : parseInt(linedataArr[631])
        , "L10631" : parseInt(linedataArr[632])
        , "L10632" : parseInt(linedataArr[633])
        , "L10633" : parseInt(linedataArr[634])
        , "L10634" : parseInt(linedataArr[635])
        , "L10635" : parseInt(linedataArr[636])
        , "L10636" : parseInt(linedataArr[637])
        , "L10637" : parseInt(linedataArr[638])
        , "L10638" : parseInt(linedataArr[639])
        , "L10639" : parseInt(linedataArr[640])
        , "L10640" : parseInt(linedataArr[641])
        , "L10641" : parseInt(linedataArr[642])
        , "L10642" : parseInt(linedataArr[643])
        , "L10643" : parseInt(linedataArr[644])
        , "L10644" : parseInt(linedataArr[645])
        , "L10645" : parseInt(linedataArr[646])
        , "L10646" : parseInt(linedataArr[647])
        , "L10647" : parseInt(linedataArr[648])
        , "L10648" : parseInt(linedataArr[649])
        , "L10649" : parseInt(linedataArr[650])
        , "L10650" : parseInt(linedataArr[651])
        , "L10651" : parseInt(linedataArr[652])
        , "L10652" : parseInt(linedataArr[653])
        , "L10653" : parseInt(linedataArr[654])
        , "L10654" : parseInt(linedataArr[655])
        , "L10655" : parseInt(linedataArr[656])
        , "L10656" : parseInt(linedataArr[657])
        , "L10657" : parseInt(linedataArr[658])
        , "L10658" : parseInt(linedataArr[659])
        , "L10659" : parseInt(linedataArr[660])
        , "L10660" : parseInt(linedataArr[661])
        , "L10661" : parseInt(linedataArr[662])
        , "L10662" : parseInt(linedataArr[663])
        , "L10663" : parseInt(linedataArr[664])
        , "L10664" : parseInt(linedataArr[665])
        , "L10665" : parseInt(linedataArr[666])
        , "L10666" : parseInt(linedataArr[667])
        , "L10667" : parseInt(linedataArr[668])
        , "L10668" : parseInt(linedataArr[669])
        , "L10669" : parseInt(linedataArr[670])
        , "L10670" : parseInt(linedataArr[671])
        , "L10671" : parseInt(linedataArr[672])
        , "L10672" : parseInt(linedataArr[673])
        , "L10673" : parseInt(linedataArr[674])
        , "L10674" : parseInt(linedataArr[675])
        , "L10675" : parseInt(linedataArr[676])
        , "L10676" : parseInt(linedataArr[677])
        , "L10677" : parseInt(linedataArr[678])
        , "L10678" : parseInt(linedataArr[679])
        , "L10679" : parseInt(linedataArr[680])
        , "L10680" : parseInt(linedataArr[681])
        , "L10681" : parseInt(linedataArr[682])
        , "L10682" : parseInt(linedataArr[683])
        , "L10683" : parseInt(linedataArr[684])
        , "L10684" : parseInt(linedataArr[685])
        , "L10685" : parseInt(linedataArr[686])
        , "L10686" : parseInt(linedataArr[687])
        , "L10687" : parseInt(linedataArr[688])
        , "L10688" : parseInt(linedataArr[689])
        , "L10689" : parseInt(linedataArr[690])
        , "L10690" : parseInt(linedataArr[691])
        , "L10691" : parseInt(linedataArr[692])
        , "L10692" : parseInt(linedataArr[693])
        , "L10693" : parseInt(linedataArr[694])
        , "L10694" : parseInt(linedataArr[695])
        , "L10695" : parseInt(linedataArr[696])
        , "L10696" : parseInt(linedataArr[697])
        , "L10697" : parseInt(linedataArr[698])
        , "L10698" : parseInt(linedataArr[699])
        , "L10699" : parseInt(linedataArr[700])
        , "L10700" : parseInt(linedataArr[701])
        , "L10701" : parseInt(linedataArr[702])
        , "L10702" : parseInt(linedataArr[703])
        , "L10703" : parseInt(linedataArr[704])
        , "L10704" : parseInt(linedataArr[705])
        , "L10705" : parseInt(linedataArr[706])
        , "L10706" : parseInt(linedataArr[707])
        , "L10707" : parseInt(linedataArr[708])
        , "L10708" : parseInt(linedataArr[709])
        , "L10709" : parseInt(linedataArr[710])
        , "L10710" : parseInt(linedataArr[711])
        , "L10711" : parseInt(linedataArr[712])
        , "L10712" : parseInt(linedataArr[713])
        , "L10713" : parseInt(linedataArr[714])
        , "L10714" : parseInt(linedataArr[715])
        , "L10715" : parseInt(linedataArr[716])
        , "L10716" : parseInt(linedataArr[717])
        , "L10717" : parseInt(linedataArr[718])
        , "L10718" : parseInt(linedataArr[719])
        , "L10719" : parseInt(linedataArr[720])
        , "L10720" : parseInt(linedataArr[721])
        , "L10721" : parseInt(linedataArr[722])
        , "L10722" : parseInt(linedataArr[723])
        , "L10723" : parseInt(linedataArr[724])
        , "L10724" : parseInt(linedataArr[725])
        , "L10725" : parseInt(linedataArr[726])
        , "L10726" : parseInt(linedataArr[727])
        , "L10727" : parseInt(linedataArr[728])
        , "L10728" : parseInt(linedataArr[729])
        , "L10729" : parseInt(linedataArr[730])
        , "L10730" : parseInt(linedataArr[731])
        , "L10731" : parseInt(linedataArr[732])
        , "L10732" : parseInt(linedataArr[733])
        , "L10733" : parseInt(linedataArr[734])
        , "L10734" : parseInt(linedataArr[735])
        , "L10735" : parseInt(linedataArr[736])
        , "L10736" : parseInt(linedataArr[737])
        , "L10737" : parseInt(linedataArr[738])
        , "L10738" : parseInt(linedataArr[739])
        , "L10739" : parseInt(linedataArr[740])
        , "L10740" : parseInt(linedataArr[741])
        , "L10741" : parseInt(linedataArr[742])
        , "L10742" : parseInt(linedataArr[743])
        , "L10743" : parseInt(linedataArr[744])
        , "L10744" : parseInt(linedataArr[745])
        , "L10745" : parseInt(linedataArr[746])
        , "L10746" : parseInt(linedataArr[747])
        , "L10747" : parseInt(linedataArr[748])
        , "L10748" : parseInt(linedataArr[749])
        , "L10749" : parseInt(linedataArr[750])
        , "L10750" : parseInt(linedataArr[751])
        , "L10751" : parseInt(linedataArr[752])
        , "L10752" : parseInt(linedataArr[753])
        , "L10753" : parseInt(linedataArr[754])
        , "L10754" : parseInt(linedataArr[755])
        , "L10755" : parseInt(linedataArr[756])
        , "L10756" : parseInt(linedataArr[757])
        , "L10757" : parseInt(linedataArr[758])
        , "L10758" : parseInt(linedataArr[759])
        , "L10759" : parseInt(linedataArr[760])
        , "L10760" : parseInt(linedataArr[761])
        , "L10761" : parseInt(linedataArr[762])
        , "L10762" : parseInt(linedataArr[763])
        , "L10763" : parseInt(linedataArr[764])
        , "L10764" : parseInt(linedataArr[765])
        , "L10765" : parseInt(linedataArr[766])
        , "L10766" : parseInt(linedataArr[767])
        , "L10767" : parseInt(linedataArr[768])
        , "L10768" : parseInt(linedataArr[769])
        , "L10769" : parseInt(linedataArr[770])
        , "L10770" : parseInt(linedataArr[771])
        , "L10771" : parseInt(linedataArr[772])
        , "L10772" : parseInt(linedataArr[773])
        , "L10773" : parseInt(linedataArr[774])
        , "L10774" : parseInt(linedataArr[775])
        , "L10775" : parseInt(linedataArr[776])
        , "L10776" : parseInt(linedataArr[777])
        , "L10777" : parseInt(linedataArr[778])
        , "L10778" : parseInt(linedataArr[779])
        , "L10779" : parseInt(linedataArr[780])
        , "L10780" : parseInt(linedataArr[781])
        , "L10781" : parseInt(linedataArr[782])
        , "L10782" : parseInt(linedataArr[783])
        , "L10783" : parseInt(linedataArr[784])
        , "L10784" : parseInt(linedataArr[785])
        , "L10785" : parseInt(linedataArr[786])
        , "L10786" : parseInt(linedataArr[787])
        , "L10787" : parseInt(linedataArr[788])
        , "L10788" : parseInt(linedataArr[789])
        , "L10789" : parseInt(linedataArr[790])
        , "L10790" : parseInt(linedataArr[791])
        , "L10791" : parseInt(linedataArr[792])
        , "L10792" : parseInt(linedataArr[793])
        , "L10793" : parseInt(linedataArr[794])
        , "L10794" : parseInt(linedataArr[795])
        , "L10795" : parseInt(linedataArr[796])
        , "L10796" : parseInt(linedataArr[797])
        , "L10797" : parseInt(linedataArr[798])
        , "L10798" : parseInt(linedataArr[799])
        , "L10799" : parseInt(linedataArr[800])
        , "L10800" : parseInt(linedataArr[801])
        , "L10801" : parseInt(linedataArr[802])
        , "L10802" : parseInt(linedataArr[803])
        , "L10803" : parseInt(linedataArr[804])
        , "L10804" : parseInt(linedataArr[805])
        , "L10805" : parseInt(linedataArr[806])
        , "L10806" : parseInt(linedataArr[807])
        , "L10807" : parseInt(linedataArr[808])
        , "L10808" : parseInt(linedataArr[809])
        , "L10809" : parseInt(linedataArr[810])
        , "L10810" : parseInt(linedataArr[811])
        , "L10811" : parseInt(linedataArr[812])
        , "L10812" : parseInt(linedataArr[813])
        , "L10813" : parseInt(linedataArr[814])
        , "L10814" : parseInt(linedataArr[815])
        , "L10815" : parseInt(linedataArr[816])
        , "L10816" : parseInt(linedataArr[817])
        , "L10817" : parseInt(linedataArr[818])
        , "L10818" : parseInt(linedataArr[819])
        , "L10819" : parseInt(linedataArr[820])
        , "L10820" : parseInt(linedataArr[821])
        , "L10821" : parseInt(linedataArr[822])
        , "L10822" : parseInt(linedataArr[823])
        , "L10823" : parseInt(linedataArr[824])
        , "L10824" : parseInt(linedataArr[825])
        , "L10825" : parseInt(linedataArr[826])
        , "L10826" : parseInt(linedataArr[827])
        , "L10827" : parseInt(linedataArr[828])
        , "L10828" : parseInt(linedataArr[829])
        , "L10829" : parseInt(linedataArr[830])
        , "L10830" : parseInt(linedataArr[831])
      }]
    // }
  }
  return jsonData;
}
