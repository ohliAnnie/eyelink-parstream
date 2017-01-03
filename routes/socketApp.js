var socketio = require('socket.io');
var CONSTS = require('./consts');
var DashboardProvider = require('./dao/' + global.config.fetchData.database + '/'+ global.config.fetchData.method + '-dashboard').DashboardProvider;
var dashboardProvider = new DashboardProvider();

function initSocket(app, callback) {
  app.io = socketio();
  app.io.sockets.on('connection', function(socket) {
    var count = 0;
    var recordCount = 0;
    // 1분마다 데이터가 추가로 입력되었는지 확인 후, 추가되었으면 Client에 알려준다.
    var intervalObject = setInterval(function() {

      // 오늘일자의 데이터에 대해서 Query를 수행한다.
      var in_data = {count:count, recordCount:recordCount};
      dashboardProvider.selectSingleQueryByID("selectCountEventRawDataByToDay", in_data, function(err, out_data, params) {
        // console.log(out_data);
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {
        }

        count++;
        console.log(count, 'seconds passed');
        if (out_data[0].length > params.recordCount) {
          recordCount = out_data[0][0].cnt;
          console.log('socketApp/initSocket -> recordCount : %s, params.recordCount : %s', recordCount, params.recordCount);
          app.io.sockets.emit('refreshData', {count:count, recordCount:recordCount});
        }
        // if (count == 5) {
        //   console.log('exiting');
        //   clearInterval(intervalObject);
        // }
      });

    }, 30000);

    // Dashboard Alarm에 Event List 출력을 위해서 데이터를 조회해서 Client로 전송한다.
    socket.on('getEventListForAlarm', function(data) {
      console.log('socketApp/initSocket -> getEventListForAlarm : data : %s', data);
      // DB Query
      var in_data = {last_pos:data};
      dashboardProvider.selectSingleQueryByID("selectEventListForAlarm", in_data, function(err, out_data, params) {
        console.log('socketApp/initSocket -> getEventListForAlarm -> out_data : %j', out_data[0]);
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        } else {
        }
        app.io.sockets.emit('sendEventListForAlarm', out_data[0]);
      });
    });
  });

}

module.exports.initSocket = initSocket;