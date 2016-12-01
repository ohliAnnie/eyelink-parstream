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
  // Dashboard Section 1
  "selectDashboardSection1" :
          "select today_active_power / 1000 * 85.9 as today_power_charge, " +
          "    yesterday_active_power / 1000 * 85.9 as yesterday_power_charge, " +
          "   today_active_power, yesterday_active_power, today_active_power/yesterday_active_power * 100 - 100 as active_power_percent, " +
          "      today_event_cnt, yesterday_event_cnt, today_event_cnt / yesterday_event_cnt * 100 - 100 as event_cnt_percent, " +
          "      today_event_fault_cnt, yesterday_event_fault_cnt, today_event_fault_cnt / yesterday_event_fault_cnt * 100 - 100 as event_fault_cnt_percent " +
          " from ( " +
          "   select sum(today_active_power) as today_active_power, sum(yesterday_active_power) as yesterday_active_power, " +
          "          sum(today_event_cnt) as today_event_cnt, sum(yesterday_event_cnt) as yesterday_event_cnt, " +
          "          sum(today_event_fault_cnt) as today_event_fault_cnt, sum(yesterday_event_fault_cnt) as yesterday_event_fault_cnt " +
          "     from ( " +
          "         select sum(amount_active_power) as today_active_power, 0.0 as yesterday_active_power, " +
          "              count(*) as today_event_cnt, cast(0 as int64) as yesterday_event_cnt, " +
          "              sum(case event_type when 81 then 1 else 0 end) as today_event_fault_cnt, " +
          "              cast(0 as uint64) as yesterday_event_fault_cnt " +
          "         from tb_node_raw " +
          "        where year = date_part('YEAR', current_date()) " +
          "          and month = date_part('MONTH', current_date()) " +
          "          and day = date_part('DAY', current_date()) " +
          "       UNION " +
          "       select 0.0 as today_active_power, sum(amount_active_power) as yesterday_active_power, " +
          "              cast(0 as int64) as today_event_cnt, count(*) as yesterday_event_cnt, " +
          "              cast(0 as uint64) as today_event_fault_cnt, " +
          "              sum(case event_type when 81 then 1 else 0 end) as yesterday_event_fault_cnt " +
          "         from tb_node_raw " +
          "        where year = date_part('YEAR', current_date()-1) " +
          "          and month = date_part('MONTH', current_date()-1) " +
          "          and day = date_part('DAY', current_date()-1) " +
          "      ))  ",
  // Event Raw Data 조회
  "selectEventRawData" :
        "    select node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "         vibration_x, vibration_y, vibration_z"+
        "    from tb_node_raw"+
        "  where year = date_part('YEAR', current_date()) "+
        "    and month = date_part('MONTH', current_date())",
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
                  // console.log(sqlList[queryId]);
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
