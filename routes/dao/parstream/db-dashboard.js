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
  url: 'jdbc:parstream://m2u-parstream.eastus.cloudapp.azure.com:9043/eyelink',
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
  "selectEventRawDataOld" :
        "    select node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "         vibration_x, vibration_y, vibration_z, "+
        "         (vibration_x + vibration_y + vibration_z) / 3 as vibration" +
        "    from tb_node_raw"+
        "  where event_time >= timestamp #START_TIMESTAMP# " +
        "    and event_time < timestamp #END_TIMESTAMP# ",

  // Event Raw Data 조회
  "selectEventRawData" :
        "    select node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "         vibration_x, vibration_y, vibration_z, "+
        "         (vibration_x + vibration_y + vibration_z) / 3 as vibration" +
        "    from tb_node_raw"+
        "  where year = date_part('YEAR', current_date()) "+
        "    and month = date_part('MONTH', current_date())" +
        "    and day = date_part('DAY', current_date()) ",

  // Event Count on Today
  "selectCountEventRawDataByToDay" :
        "    select count(*) as cnt " +
        "    from tb_node_raw"+
        "  where year = date_part('YEAR', current_date()) "+
        "    and month = date_part('MONTH', current_date())" +
        "    and day = date_part('DAY', current_date()) ",

  // Event Raw Data for Event Alarm
  "selectEventListForAlarm" :
        "    select node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "         vibration_x, vibration_y, vibration_z, "+
        "         (vibration_x + vibration_y + vibration_z) / 3 as vibration" +
        "    from tb_node_raw"+
        "  where year = date_part('YEAR', current_date()) "+
        "    and month = date_part('MONTH', current_date())" +
        "    and day = date_part('DAY', current_date()) " +
        "   order by event_time desc " +
        "   limit 8 offset #last_pos# ",
};

DashboardProvider = function() {

}

// 단건에 대해서 Query를 수행한다.
DashboardProvider.prototype.selectSingleQueryByID = function (queryId, datas, callback) {
  console.log('db-Dashboard/selectSingleQueryByID -> queryID : ' + queryId)
  // console.log('db-Dashboard/selectSingleQueryByID -> data : ' + datas);

  console.time('db-Dashboard/selectSingleQueryByID -> ' + queryId+'-total');
  console.time('db-Dashboard/selectSingleQueryByID -> ' + queryId+'-reserve');
  parstream.reserve(function(err, connObj) {
    if (connObj) {
      console.timeEnd('db-Dashboard/selectSingleQueryByID -> ' + queryId+'-reserve');
      console.log("db-Dashboard/selectSingleQueryByID -> Using connection: " + connObj.uuid);
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
                  console.time('db-Dashboard/selectSingleQueryByID -> ' + queryId+'-executeQuery');
                  // SQL 내 파라메타를 변경해준다.
                  var sSql = Utils.replaceSql(sqlList[queryId], datas);
                  console.log('db-Dashboard/selectSingleQueryByID -> ' + sSql);
                  statement.execute(sSql,
                                         function(err, resultset) {
                    if (err) {
                      callback(err)
                    } else {
                      console.timeEnd('db-Dashboard/selectSingleQueryByID -> ' + queryId+'-executeQuery');
                      console.time('db-Dashboard/selectSingleQueryByID -> ' + queryId+'-resultset.toObjArray');
                      // console.log(results);
                      resultset.toObjArray(function(err, results) {
                        if (results.length > 0) {
                          console.log("db-Dashboard/selectSingleQueryByID -> Query Count : " + results.length);
                          callback(null, results);
                        } else {
                          console.log('db-Dashboard/selectSingleQueryByID -> no data found');
                          callback(null, null);
                        }
                      //   // console.log(results);
                      //   console.timeEnd(queryId+'-resultset.toObjArray');
                      });
                      // callback(null, resultset);
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
          console.log('db-Dashboard/selectSingleQueryByID -> released connection!!!');
          if (err) {
            console.log(err.message);
          }
          console.timeEnd('db-Dashboard/selectSingleQueryByID -> ' + queryId+'-total');
          callback(err, results, datas);
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
