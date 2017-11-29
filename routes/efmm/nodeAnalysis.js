var logger = global.log4js.getLogger('nodeAnalysis');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var fs = require('fs');
var net = require('net');
var router = express.Router();
var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;

var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis: 'open selected', management:'', settings:''};

var indexNotchingOee = global.config.es_index.notching_oee;
var indexStackingOee = global.config.es_index.stacking_oee;

var startTime = CONSTS.STARTTIME.KOREA;
var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",
var fmt4 = CONSTS.DATEFORMAT.INDEXDATE; // "YYYY.MM.DD",


// get stacking data
router.get('/restapi/getNotchingOeeRaw', function(req, res, next){
    logger.debug("req.query:", req.query);
    var sDate = Utils.getDateLocal2UTC(req.query.startDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
    var eDate = Utils.getDateLocal2UTC(req.query.endDate, CONSTS.DATEFORMAT.DATETIME, 'Y');
    var in_data = { INDEX : indexNotchingOee, TYPE : "oee", START: sDate, END: eDate};
    var sql = "selectNotchingOeeRaw";
    queryProvider.selectSingleQueryByID2("analysis", sql, in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data === null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      out_data.forEach(function(d){
        var utcDt = d._source.da_result.timestamp;
        var localDt = Utils.getDateUTC2Local(utcDt, CONSTS.DATEFORMAT.DATETIME, 'Y');
        d._source.da_result.timestamp = localDt;
      });
    }
    logger.debug('analysis/restapi/getAnomaly_Pattern -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});



module.exports = router;