var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');

console.log(1);
if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['/routers/dao/drivers/jdbc-4.2.9.jar']);
}

console.log(2);
var config = {
  // Required
  url: 'jdbc:parstream://m2u-parstream.eastus.cloudapp.azure.com:9043/eyelink',

  // Optional
  drivername: 'com.parstream.ParstreamDriver',
  minpoolsize: 1,
  maxpoolsize: 5,

  // Note that if you sepecify the user and password as below, they get
  // converted to properties and submitted to getConnection that way.  That
  // means that if your driver doesn't support the 'user' and 'password'
  // properties this will not work.  You will have to supply the appropriate
  // values in the properties object instead.
  user: 'parstream',
  password: 'Rornfldkf!2',
  properties: {}
};

console.log(3);
var parstream = new JDBC(config);
console.log(4);
parstream.initialize(function(err) {
  if (err) {
    console.log(err);
  }
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
