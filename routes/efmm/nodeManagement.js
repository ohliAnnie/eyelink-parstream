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

router.get('/recipe', function(req, res, next) {
  logger.debug('recipe');
  // var in_data = { INDEX: '', TYPE: "user" };
  // queryProvider.selectSingleQueryByID2("management", "selectList", in_data, function(err, out_data, params) {
  //   var rtnCode = CONSTS.getErrData('0000');
  //   if (out_data == null) {
  //     rtnCode = CONSTS.getErrData('0001');
  //   }
  //   logger.debug(out_data);
  //   var users = out_data;
  // });
  var out_data = {
    'step' : 'NOTCHING',
    'machine' :
      [
        {'cid' : '100'},
        {'cid' : '200'}
      ],
    'data' :
      [
        {
          'seq' : 1,
          'cid' : 100,
          'type' : 'Motor Parameter(30 Axis)',
          'variable' : 'P2090 + axis no. * 10',
          'name' : 'P Gain',
          'description' : 'PID proportional gain term',
          'unit' : '',
          'stepno' : '',
          'tagname' : '',
          'datatype' : 'Double',
          'datasize' : 8,
          'datavalue' : '',
          'lastupdate' : '20171204'
        },
        {
          'seq' : 2,
          'cid' : 100,
          'type' : 'Motor Parameter(30 Axis)',
          'variable' : 'P2091 + axis no. * 10',
          'name' : 'I Gain',
          'description' : 'Servo velocity feedforward (into integrator) gain term',
          'unit' : '',
          'stepno' : '',
          'tagname' : '',
          'datatype' : 'Double',
          'datasize' : 8,
          'datavalue' : '',
          'lastupdate' : '20171204'
        },
        {
          'seq' : 3,
          'cid' : 100,
          'type' : 'Productive Parameter',
          'variable' : 'P2700',
          'name' : '생산 속도',
          'description' : '생산 속도',
          'unit' : 'ppm',
          'stepno' : '',
          'tagname' : '',
          'datatype' : '',
          'datasize' : '',
          'datavalue' : 2,
          'lastupdate' : '20171204'
        },
        {
          'seq' : 4,
          'cid' : 100,
          'type' : 'Productive Parameter',
          'variable' : 'P2701',
          'name' : '극판 폭',
          'description' : '극판 폭',
          'unit' : 'mm',
          'stepno' : '',
          'tagname' : '',
          'datatype' : 'Double',
          'datasize' : 8,
          'datavalue' : '',
          'lastupdate' : '20171204'
        },
      ]
  }
;

    res.render('./'+global.config.pcode+'/management/recipe', { title: global.config.productname, mainmenu:mainmenu, rtnData:out_data });
});

// recipe 신규 등록.
router.get('/recipe/:id', function(req, res) {
  var out_data = {
    'step' : 'NOTCHING',
    'cid' : '100',
    'type' : 'Motor Parameter(30 Axis)',
    'variable' : 'P2090 + axis no. * 10',
    'name' : 'P Gain',
    'description' : 'PID proportional gain term',
    'unit' : '',
    'stepno' : '',
    'tagname' : '',
    'datatype' : 'Double',
    'datasize' : 8,
    'datavalue' : '',
    'lastupdate' : '20171204'
  };
  if (req.params.id === 'NEW') {
    res.render('./'+global.config.pcode+'/management/recipe_new', { title: global.config.productname, mainmenu:mainmenu, rtnData:out_data});
  } else {
    res.render('./'+global.config.pcode+'/management/recipe_edit', { title: global.config.productname, mainmenu:mainmenu, rtnData:out_data});
  }
});

module.exports = router;
module.exports.selectAlarmList = selectAlarmList;
module.exports.saveAlarmData = saveAlarmData;
