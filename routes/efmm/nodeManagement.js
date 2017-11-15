var logger = global.log4js.getLogger('nodeManagement');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'open selected', settings:''};

router.get('/restapi/getAlarmList', function(req, res, next) {
  logger.debug('start /restapi/getAlarmList');
  selectAlarmList(function(data) {
    res.json({rtnCode: data.rtnCode, rtnData: data.rtnData, rtnCount : data.rtnCount});
  })
});

function selectAlarmList(cb) {
  var d = new Date();
  var in_data = {
    INDEX: CONSTS.SCHEMA.EFSM_ALARM.INDEX + d.toFormat('YYYY.MM.DD'),
    TYPE: 'AgentAlarm',
    SORT: "timestamp" };
  var rtnCode = CONSTS.getErrData('0000');
  queryProvider.selectSingleQueryByID2("management", "selectAlarmList", in_data, function(err, out_data, count) {
    // logger.debug(out_data);
    if (count == 0) {
      rtnCode = CONSTS.getErrData('0001');
      res.json({rtnCode: rtnCode});
    }
    logger.debug('selectAlarmList -> count : ' + count);
    cb({rtnCode: rtnCode, rtnData: out_data, rtnCount : count});
  });
}

function saveAlarmData(data, cb) {
  logger.debug('start saveAlarmData');
  var d = new Date();
  var in_data = {
    INDEX: CONSTS.SCHEMA.EFSM_ALARM.INDEX + d.toFormat('YYYY.MM.DD'),
    TYPE: 'AgentAlarm',
    BODY : JSON.stringify(data)};
  queryProvider.insertQueryByID("management", "insertAlarmData", in_data, function(err, out_data) {
    logger.debug(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (err) {
      logger.debug(err)
      rtnCode.code = 'UNDEFINED';
      rtnCode.message = err;
    };
    if(out_data.result == "created"){
      rtnCode = CONSTS.getErrData("D001");
    }
    logger.debug('end saveAlarmData');
    cb({rtnCode: rtnCode});
  });
}


module.exports = router;
module.exports.selectAlarmList = selectAlarmList;
module.exports.saveAlarmData = saveAlarmData;
