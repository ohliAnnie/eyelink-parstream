var parstream = require('parstream');
var pool = parstream.createPool({
  size: 2,
  host: 'm2u-parstream.eastus.cloudapp.azure.com',
  port: 9043,
});

var sqlList = {
  // Event 발생 건수 조회
  "selectSuccessCount" : "select count(*) cnt from tb_node_raw",
};

DashboardProvider = function() {

}

// 단건에 대해서 Query를 수행한다.
DashboardProvider.prototype.selectSingleQueryByID = function (queryId, datas, callback) {
  console.log('queryID : ' + queryId)
  console.log('data : ' + datas);

  // pool.query('select count(*) cnt from tb_node_raw', function(err, data) {
  //   console.log(data);
  //   callback(null, data);
  // });

  var cb = this.callback;

  pool.connect(function (err) {
    if (err) {
      pool.close();
      callback(err);
      return;
    }
    console.log('connected');
    // pool.close();
    // console.log('disconnected');

    console.log(sqlList[queryId]);
    pool.query(sqlList[queryId], function(err, rows) {
      console.log('querying');
      if (err) {
        pool.close();
        console.error("err : " + err);
        callback(err);
      } else {
        console.log("rows : " + JSON.stringify(rows));
        callback(err, rows);
        pool.close();
      }
    });
  });
};

// 복수건에 대해서 Query를 수행한다.
DashboardProvider.prototype.selectMultiQueryByID = function (queryId, datas, callback) {
  console.log('queryID : ' + queryId)
  console.log('data : ' + datas);
  pool.getConnection(function (err, conn) {
    if (err) {
      conn.release();
      callback(err);
      return;
    }
    conn.query(sqlList[queryId], datas, function(err, rows) {
      if (err) {
        conn.release();
        console.error("err : " + err);
        callback(err);
      } else {
        conn.release();
        console.log("rows : " + JSON.stringify(rows));
        callback(null, rows);
      }
    });
  });
};

exports.DashboardProvider = DashboardProvider;
