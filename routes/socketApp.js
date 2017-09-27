var Logger = require('./log4js-utils').Logger;
var logger = new Logger('socketApp');
var socketio = require('socket.io');
var CONSTS = require('./consts');
var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

function initSocket(app, callback) {
  logger.info('start initSocket()');
  app.io = socketio();
  app.io.sockets.on('connection', function(socket) {
    logger.debug('connection open');
    var count = 0;
    var recordCount = 0;
    // 1분마다 데이터가 추가로 입력되었는지 확인 후, 추가되었으면 Client에 알려준다.
    // var intervalObject = setInterval(function() {

    //   // 오늘일자의 데이터에 대해서 Query를 수행한다.
    //   var in_data = {count:count, recordCount:recordCount};
    //   queryProvider.selectSingleQueryByID("selectCountEventRawDataByToDay", in_data, function(err, out_data, params) {
    //     // logger.debug(out_data);
    //     var rtnCode = CONSTS.getErrData('0000');
    //     if (out_data == null) {
    //       rtnCode = CONSTS.getErrData('0001');
    //     } else {
    //     }

    //     count++;
    //     logger.debug(count, 'seconds passed');
    //     if (out_data[0].length > params.recordCount) {
    //       recordCount = out_data[0][0].cnt;
    //       logger.debug('recordCount : %s, params.recordCount : %s', recordCount, params.recordCount);
    //       app.io.sockets.emit('refreshData', {count:count, recordCount:recordCount});
    //     }
    //     // if (count == 5) {
    //     //   logger.debug('exiting');
    //     //   clearInterval(intervalObject);
    //     // }
    //   });

    // }, 30000);

    emitAlarmCount(app.io);

    // Dashboard Alarm에 Event List 출력을 위해서 데이터를 조회해서 Client로 전송한다.
    socket.on('getEventListForAlarm', function(data) {
      logger.debug(' getEventListForAlarm : data : %s', data);
      // DB Query
      var in_data = {last_pos:data};
      queryProvider.selectSingleQueryByID("selectEventListForAlarm", in_data, function(err, out_data, params) {
        logger.debug('getEventListForAlarm -> out_data : %j', out_data[0]);
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {
        }
        app.io.sockets.emit('sendEventListForAlarm', out_data[0]);
      });
    });

    // recevie Alarm Data from Agent, Data Analytics
    socket.on('receiveAlarmData', function(data) {
      logger.debug('receiveAlarmData Sucess : data ' + JSON.stringify(data));
      saveAlarmData(app.io, data);
    });

    // socket test module
    socket.on('receiveSocketEventTest', function(data) {
      logger.debug('receiveSocketEventTest Sucess : data ', JSON.stringify(data));
      var out_data = {code : '0000', message : 'SUCCESS'};
      app.io.sockets.emit('sendEventSocketEventTest', out_data);
    });
  });

}

function saveAlarmData(io, data, cb) {
  var management = require('./nodeManagement' + global.config.pcode);
  management.saveAlarmData(data, function(odata) {
    logger.debug(odata);
    var out_data = {
      code : odata.rtnCode.code,
      message : odata.rtnCode.message};
    logger.debug('saveAlarmData : data ' + JSON.stringify(out_data));
    emitAlarmCount(io);
  });
}

function emitAlarmCount(io) {
  var management = require('./nodeManagement' + global.config.pcode);
  management.selectAlarmList(function(data) {
    var out_data = {
      code : '0000',
      message : 'SUCCESS',
      count : data.rtnCount};
    logger.debug('emitAlarmCount : data ' + JSON.stringify(out_data));
    io.sockets.emit('returnAlarmData', out_data);
  });
}

module.exports.initSocket = initSocket;