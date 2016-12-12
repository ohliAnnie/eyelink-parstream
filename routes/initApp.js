var CONSTS = require('./consts');
require('date-utils');

var DashboardProvider = require('./dao/parstream/db-dashboard').DashboardProvider;
var dashboardProvider = new DashboardProvider();

function loadData(callback) {
  var d = new Date();
  console.log('today : %s', Date.today());

  for (var i=0; i<2; i++) {
    console.log('day : %s', d.removeDays(1).toFormat('YYYY-MM-DD'));
    var vDate = d.toFormat('YYYY-MM-DD');
    var in_data = {
      LOAD_DATE : vDate,
      START_TIMESTAMP: vDate + ' 00:00:00',
      END_TIMESTAMP: vDate + ' 23:59:59'};
    dashboardProvider.selectSingleQueryByID("selectEventRawDataOld", in_data, function(err, out_data) {
      // console.log(out_data);
      _rawDataByDay[in_data['LOAD_DATE']] = out_data[0];
      console.log('loadData -> load_date : %s', in_data['LOAD_DATE']);
      callback(in_data);
    });
  }



  // var vDate = in_data['LOAD_DATE'];
  // in_data = {
  //   LOAD_DATE : vDate,
  //   START_TIMESTAMP: vDate + ' 00:00:00',
  //   END_TIMESTAMP: vDate + ' 23:59:59'};
  // console.log(in_data);
  // dashboardProvider.selectSingleQueryByID("selectEventRawDataOld", in_data, function(err, out_data) {
  //   // console.log(out_data);
  //   _rawDataByDay[in_data['LOAD_DATE']] = out_data[0];
  //   console.log('loadData -> load_date : %s', in_data['LOAD_DATE']);
  //   callback(in_data);
  // });
}

module.exports.loadData = loadData;
