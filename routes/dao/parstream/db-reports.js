var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var asyncjs = require('async');
var Utils = require('../../util');

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/jdbc-4.2.9.jar']);
}

var config = {
  // Required
  url: 'jdbc:parstream://m2u-da.eastus.cloudapp.azure.com:9043/eyelink',
  drivername: 'com.parstream.ParstreamDriver',
  minpoolsize: 1,
  maxpoolsize: 10,
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
  // Event Raw Data 조회
  "selectEventRawData" :
        "    select node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "   status_power_meter, "+
        "         vibration_x, vibration_y, vibration_z"+
        "    from tb_node_raw"+ 
        "    where event_year=2016 and event_month=12  " +
        "    and event_day in (1,2,3,4,5,6,7) "+
        "    and node_id in ('0001.00000007', '0002.00000022') " +
        "     order by event_time",
//        "  where year = date_part('YEAR', current_date()) "+
//        "    and month = date_part('MONTH', current_date())" +
//        "    and day = date_part('DAY', current_date())",

// test Data
  "testData" :
        "   select event_time, ampere, voltage, power_factor, active_power,  reactive_power,  apparent_power "+
           "    from tb_node_raw"+
        "  where event_year = date_part('YEAR', current_date()) "+
        "    and event_month = date_part('MONTH', current_date())" +
        "  and event_day = 11 " +
        "    and event_type = 1" +
        "   order by event_time",

  // Event Raw Data 조회
  "selectEventRawDataOld" :
        "    select node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "         vibration_x, vibration_y, vibration_z, "+
        "         (vibration_x + vibration_y + vibration_z) / 3 as vibration" +
        "    from tb_node_raw"+
        "  where event_time >= timestamp #START_TIMESTAMP# " +
        "    and event_time < timestamp #END_TIMESTAMP# ",
};

ReportsProvider = function() {

}

// 단건에 대해서 Query를 수행한다.
ReportsProvider.prototype.selectSingleQueryByID = function (queryId, datas, callback) {
  console.log('db-report/selectSingleQueryByID -> queryID : ' + queryId)
  // console.log('db-report/selectSingleQueryByID -> data : ' + datas);

  console.time('db-report/selectSingleQueryByID -> ' + queryId+'-total');
  console.time('db-report/selectSingleQueryByID -> ' + queryId+'-reserve');

  parstream.reserve(function(err, connObj) {
    if (connObj) {
      console.timeEnd('db-report/selectSingleQueryByID -> ' + queryId+'-reserve');
      console.log("db-report/selectSingleQueryByID -> Using connection: " + connObj.uuid);
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
                  // SQL 내 파라메타를 변경해준다.
                  var sSql = Utils.replaceSql(sqlList[queryId], datas);
                  console.log('db-report/selectSingleQueryByID -> ' + sSql);
                  statement.execute(sSql,
                                         function(err, resultset) {
                    if (err) {
                      callback(err)
                    } else {
                      resultset.toObjArray(function(err, results) {
                        if (results.length > 0) {
                          console.log("db-report/selectSingleQueryByID -> Query Count : " + results.length);
                          callback(null, results);
                        } else {
                          console.log('db-report/selectSingleQueryByID -> no data found');
                          callback(null, null);
                        }
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
          console.log('db-report/selectSingleQueryByID -> released connection!!!');
          if (err) {
            console.log(err.message);
          }
          console.timeEnd('db-report/selectSingleQueryByID -> ' + queryId+'-total');
          callback(err, results, datas);
        })
      });
    }
  });
};

// 복수건에 대해서 Query를 수행한다.
ReportsProvider.prototype.selectMultiQueryByID = function (queryId, datas, callback) {
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

exports.ReportsProvider = ReportsProvider;
