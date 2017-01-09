var Utils = require('../../util');

var parstream = require("./m2u-parstream")

var opts = {
    host: 'm2u-parstream.eastus.cloudapp.azure.com',
    // host: 'm2u-da.eastus.cloudapp.azure.com',
    port: 9042,
    size: 5,
}
// var parstream =  parstream.createPool(opts);

var sqlList = {
  // Event 발생 건수 조회
  "selectSuccessCount" : "SELECT count(*) as cnt FROM tb_node_raw",
  // Dashboard Section 1
  "selectDashboardSection1" :
          "select today_active_power / 1000 * 85.9 as today_power_charge, " +
          "    yesterday_active_power / 1000 * 85.9 as yesterday_power_charge, " +
          "   today_active_power, yesterday_active_power, today_active_power/if(yesterday_active_power, yesterday_active_power, 1) * 100 - 100 as active_power_percent, " +
          "      today_event_cnt, yesterday_event_cnt, today_event_cnt / if(yesterday_event_cnt, yesterday_event_cnt, 1) * 100 - 100 as event_cnt_percent, " +
          "      today_event_fault_cnt, yesterday_event_fault_cnt, today_event_fault_cnt / if(yesterday_event_fault_cnt, yesterday_event_fault_cnt, 1) * 100 - 100 as event_fault_cnt_percent " +
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
          "        where event_year = date_part('YEAR', current_date()) " +
          "          and event_month = date_part('MONTH', current_date()) " +
          "          and event_day = date_part('DAY', current_date()) " +
          "       UNION " +
          "       select 0.0 as today_active_power, sum(amount_active_power) as yesterday_active_power, " +
          "              cast(0 as int64) as today_event_cnt, count(*) as yesterday_event_cnt, " +
          "              cast(0 as uint64) as today_event_fault_cnt, " +
          "              sum(case event_type when 81 then 1 else 0 end) as yesterday_event_fault_cnt " +
          "         from tb_node_raw " +
          "        where event_year = date_part('YEAR', current_date()-1) " +
          "          and event_month = date_part('MONTH', current_date()-1) " +
          "          and event_day = date_part('DAY', current_date()-1) " +
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
        "    and event_time < timestamp #END_TIMESTAMP#",

  // Event Raw Data 조회
  "selectEventRawData" :
        "    select node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "         vibration_x, vibration_y, vibration_z, "+
        "         gps_latitude, gps_longitude, gps_altitude, "+
        "         (vibration_x + vibration_y + vibration_z) / 3 as vibration" +
        "    from tb_node_raw"+
        "  where event_year = date_part('YEAR', current_date()) "+
        "    and event_month = date_part('MONTH', current_date())" +
        "    and event_day = date_part('DAY', current_date()) ",

  // Event Count on Today
  "selectCountEventRawDataByToDay" :
        "    select count(*) as cnt " +
        "    from tb_node_raw"+
        "  where event_year = date_part('YEAR', current_date()) "+
        "    and event_month = date_part('MONTH', current_date())" +
        "    and event_day = date_part('DAY', current_date()) ",

  // Event Raw Data for Event Alarm
  "selectEventListForAlarm" :
        "    select node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "         vibration_x, vibration_y, vibration_z, "+
        "         (vibration_x + vibration_y + vibration_z) / 3 as vibration" +
        "    from tb_node_raw"+
        "  where event_year = date_part('YEAR', current_date()) "+
        "    and event_month = date_part('MONTH', current_date())" +
        "    and event_day = date_part('DAY', current_date()) " +
        "   order by event_time desc " +
        "   limit 8 offset #last_pos# ",
};

DashboardProvider = function() {

}

// 단건에 대해서 Query를 수행한다.
DashboardProvider.prototype.selectSingleQueryByID = function (queryId, datas, callback) {
  var vTimeStamp = Date.now();
  console.time('nodelib-Dashboard/selectSingleQueryByID -> '+ queryId +' total ');
  console.log('nodelib-Dashboard/selectSingleQueryByID -> (%s) queryID', queryId)

  // no pool method
  var parstream = require('parstream').createClient(opts);

  parstream.connect(function(err) {
    if (err) {
      callback(err);
    } else {
      // SQL 내 파라메타를 변경해준다.
      var sSql = Utils.replaceSql(sqlList[queryId], datas);
      console.log('nodelib-Dashboard/selectSingleQueryByID -> ' + sSql);

      console.time('nodelib-Dashboard/selectSingleQueryByID -> ('+ queryId +') executeQuery');
      parstream.query(sSql, function(err, resultset) {
        console.timeEnd('nodelib-Dashboard/selectSingleQueryByID -> ('+ queryId +') executeQuery');
        console.log('nodelib-Dashboard/selectSingleQueryByID -> resultset : %j', resultset);

        // console.log(err);
        // occur error
        var err = null;
        if (typeof resultset.error === 'string') {
          console.log('nodelib-Dashboard/selectSingleQueryByID -> (%s) resultset error : %s', queryId, (typeof resultset.error === 'string'));
          err = resultset.error;
          console.timeEnd('nodelib-Dashboard/selectSingleQueryByID -> '+ queryId +' total ');
          parstream.close();
          callback(resultset.error, [[]], datas);
        } else {
          console.log('nodelib-Dashboard/selectSingleQueryByID -> (%s) resultset.rows.length : %d', queryId, resultset.rows.length);
          // console.log('nodelib-Dashboard/selectSingleQueryByID -> resultset type : %s', (typeof resultset === 'object'));
          // console.log('nodelib-Dashboard/selectSingleQueryByID -> resultset rows type : %s', (typeof resultset.rows === 'object'));
          console.timeEnd('nodelib-Dashboard/selectSingleQueryByID -> '+ queryId +' total ');
          parstream.close();
          callback(err, [resultset.rows], datas);
        }
        // parstream.close(function () {
        // })
      });
    }
  });
};

exports.DashboardProvider = DashboardProvider;