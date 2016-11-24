var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var asyncjs = require('async');

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/jdbc-4.2.9.jar']);
}

var config = {
  // Required
  url: 'jdbc:parstream://m2u-parstream.eastus.cloudapp.azure.com:9043/eyelink',
  drivername: 'com.parstream.ParstreamDriver',
  minpoolsize: 1,
  maxpoolsize: 5,
  properties: {
    user: 'parstream',
    password: 'Rornfldkf!2',
  }
};

var parstream = new JDBC(config);
parstream.initialize(function(err) {
  if (err) {
    console.log("error");
    console.log(err);
  }
});

var sqlList = {
  // Event 발생 건수 조회
  "selectSuccessCount" : "SELECT count(*) as cnt FROM tb_node_raw",
};

DashboardProvider = function() {

}

// 단건에 대해서 Query를 수행한다.
DashboardProvider.prototype.selectSingleQueryByID = function (queryId, datas, callback) {
  console.log('queryID : ' + queryId)
  console.log('data : ' + datas);

  parstream.reserve(function(err, connObj) {
    if (connObj) {
      console.log("Using connection: " + connObj.uuid);
      // Grab the Connection for use.
      var conn = connObj.conn;
      asyncjs.series([
        function(callback) {
          conn.createStatement(function(err, statement) {
            if (err) {
              callback(err);
            } else {
              statement.setFetchSize(100, function(err) {
                if (err) {
                  callback(err);
                } else {
                  console.log(sqlList[queryId]);
                  statement.executeQuery(sqlList[queryId],
                                         function(err, resultset) {
                    if (err) {
                      callback(err)
                    } else {
                      resultset.toObjArray(function(err, results) {
                        // if (results.length > 0) {
                        //   console.log("cnt: " + results[0].cnt);
                        // }
                        // console.log(results);
                        callback(null, results);
                      });
                    }
                  });
                }
              });
            }
          });
        }
      ], function(err, results) {
        // console.log(results);
        parstream.release(connObj, function(err) {
          console.log('released connection!!!');
          if (err) {
            console.log(err.message);
          }
          callback(err, results);
        })
      });
    }
  });

  // pool.query('select count(*) cnt from tb_node_raw', function(err, data) {
  //   console.log(data);
  //   callback(null, data);
  // });

  // var cb = this.callback;

  // pool.connect(function (err) {
  //   if (err) {
  //     pool.close();
  //     callback(err);
  //     return;
  //   }
  //   console.log('connected');
  //   // pool.close();
  //   // console.log('disconnected');

  //   console.log(sqlList[queryId]);
  //   pool.query(sqlList[queryId], function(err, rows) {
  //     console.log('querying');
  //     if (err) {
  //       pool.close();
  //       console.error("err : " + err);
  //       callback(err);
  //     } else {
  //       console.log("rows : " + JSON.stringify(rows));
  //       callback(err, rows);
  //       pool.close();
  //     }
  //   });
  // });
};

// 복수건에 대해서 Query를 수행한다.
DashboardProvider.prototype.selectMultiQueryByID = function (queryId, datas, callback) {
  // console.log('queryID : ' + queryId)
  // console.log('data : ' + datas);
  // pool.getConnection(function (err, conn) {
  //   if (err) {
  //     conn.release();
  //     callback(err);
  //     return;
  //   }
  //   conn.query(sqlList[queryId], datas, function(err, rows) {
  //     if (err) {
  //       conn.release();
  //       console.error("err : " + err);
  //       callback(err);
  //     } else {
  //       conn.release();
  //       console.log("rows : " + JSON.stringify(rows));
  //       callback(null, rows);
  //     }
  //   });
  // });
};

exports.DashboardProvider = DashboardProvider;
