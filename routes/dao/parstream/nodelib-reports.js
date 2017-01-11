var Utils = require('../../util');

var m2uparstream = require("./m2u-parstream")
var opts = {
    host: 'm2u-parstream.eastus.cloudapp.azure.com',
    // host: 'm2u-da.eastus.cloudapp.azure.com',
    port: 9042,
    size: 5,
}
// var parstream =  parstream.createPool(opts);

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
        "    select b.zone_id, a.node_id, event_time, event_type, active_power, ampere,  "+
        "       als_level, dimming_level, "+
        "         noise_decibel, noise_frequency, "+
        "         vibration_x, vibration_y, vibration_z, "+        
        "         (vibration_x + vibration_y + vibration_z) / 3 as vibration, " +
        "         b.gps_latitude, b.gps_longitude, b.gps_altitude "+
        "    from tb_node_raw as a left outer join tb_node_info as b on a.node_id = b.node_id "+
        "  where event_time >= timestamp #START_TIMESTAMP# " +
        "    and event_time < timestamp #END_TIMESTAMP# ",

    // Power 조회
  "selectEventRawDataPower" :
        "    select b.zone_id, a.node_id, event_time, event_type, active_power, ampere,  "+
        "     voltage, power_factor, reactive_power, apparent_power, amount_active_power , "+
        "         b.gps_latitude, b.gps_longitude, b.gps_altitude "+
        "    from tb_node_raw as a left outer join tb_node_info as b on a.node_id = b.node_id "+
        "  where event_time >= timestamp #START_TIMESTAMP# " +
        "    and event_time < timestamp #END_TIMESTAMP# " +
        "    and event_type = 1 ",

    // Power All 조회
  "selectEventRawDataPowerAll" :
        "   select event_year, event_month, event_day, avg(active_power) AS active_power "+
        "      from tb_node_raw " +
        "      where  event_type = 1 " +
        "         and event_time >= timestamp #START_TIMESTAMP# " +
        "         and event_time < timestamp #END_TIMESTAMP# " +
        "       group by event_year, event_month, event_day " +
        "       order by event_year, event_month, event_day ",
};



ReportsProvider = function() {

}

// 단건에 대해서 Query를 수행한다.
ReportsProvider.prototype.selectSingleQueryByID = function (queryId, datas, callback) {

  var vTimeStamp = Date.now();
  console.time('nodelib-Reports/selectSingleQueryByID -> total '+ queryId);
  console.log('nodelib-Reports/selectSingleQueryByID -> (%s) queryID' + queryId)

  // no pool method
  var parstream = require("./m2u-parstream").createClient(opts);

  parstream.connect(function(err) {
    if (err) {
      callback(err);
    } else {
      // SQL 내 파라메타를 변경해준다.
      var sSql = Utils.replaceSql(sqlList[queryId], datas);
      // console.log('nodelib-Dashboard/selectSingleQueryByID -> ' + sSql);

      console.time('nodelib-Reports/selectSingleQueryByID -> executeQuery'+ queryId);
      parstream.query(sSql, function(err, resultset) {
        console.timeEnd('nodelib-Reports/selectSingleQueryByID -> executeQuery'+ queryId);
        // console.log('nodelib-Dashboard/selectSingleQueryByID -> resultset : %j', resultset);
        // occur error
        var err = null;
        if (typeof resultset.error === 'string') {
          console.log('nodelib-Reports/selectSingleQueryByID -> (%s) resultset error : %s', queryId, (typeof resultset.error === 'string'));
          err = resultset.error;
          console.timeEnd('nodelib-Reports/selectSingleQueryByID -> (%s) total ', queryId);
          callback(resultset.error, [[]], datas);
        } else {
          console.log('nodelib-Reports/selectSingleQueryByID -> (%s) resultset.rows.length : %d', queryId, resultset.rows.length);
          // console.log('nodelib-Dashboard/selectSingleQueryByID -> resultset type : %s', (typeof resultset === 'object'));
          // console.log('nodelib-Dashboard/selectSingleQueryByID -> resultset rows type : %s', (typeof resultset.rows === 'object'));
          console.timeEnd('nodelib-Reports/selectSingleQueryByID -> total '+ queryId);
          callback(err, [resultset.rows], datas);
        }
        // parstream.close(function () {
        // })
      });
    }
  });

};

exports.ReportsProvider = ReportsProvider;
