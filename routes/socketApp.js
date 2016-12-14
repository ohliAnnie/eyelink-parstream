var socketio = require('socket.io');
var CONSTS = require('./consts');
var DashboardProvider = require('./dao/parstream/db-dashboard').DashboardProvider;
var dashboardProvider = new DashboardProvider();

function initSocket(app, callback) {
  app.io = socketio();
  app.io.sockets.on('connection', function(socket) {
    socket.on('join', function(data) {
      console.log(data);
      // DB Query
      app.io.sockets.emit('getRealData-emit in join', 'raw~~~~');
    });
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

    }, 60000)
  });

}

module.exports.initSocket = initSocket;