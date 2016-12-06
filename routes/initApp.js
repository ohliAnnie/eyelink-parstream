var CONSTS = require('./consts');

var DashboardProvider = require('./dao/parstream/db-dashboard').DashboardProvider;
var dashboardProvider = new DashboardProvider();

function loadData(in_data) {
  dashboardProvider.selectSingleQueryByID("selectEventRawDataOld", in_data, function(err, out_data) {
    // console.log(out_data);
    _rawDataByDay[in_data['id']] = out_data;
    console.log(out_data.length);
  });
}

module.exports = loadData;
