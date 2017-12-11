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
  var in_data = { INDEX: 'efmm_stacking_status-2017.12.07', TYPE: "status" };
  queryProvider.selectSingleQueryByID2("management", "selectRecipeList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    logger.debug(out_data);
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
                'lastupdate' : '2017-12-05 14:25:31',
                'history' : [
                  {'date' : '2017-12-01 14:25:31', 'value' : 5},
                  {'date' : '2017-12-03 14:25:31', 'value' : 6},
                  {'date' : '2017-12-05 14:25:31', 'value' : 5},
                ]
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
                'lastupdate' : '2017-12-05 14:25:31',
                'history' : [
                  {'date' : '2017-12-01 14:25:31', 'value' : 5},
                  {'date' : '2017-12-03 14:25:31', 'value' : 9},
                  {'date' : '2017-12-05 14:25:31', 'value' : 3},
                ]
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
                'lastupdate' : '2017-12-05 14:25:31',
                'history' : [
                  {'date' : '2017-12-01 14:25:31', 'value' : 5},
                  {'date' : '2017-12-03 14:25:31', 'value' : 7},
                  {'date' : '2017-12-05 14:25:31', 'value' : 8},
                ]
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
                'lastupdate' : '2017-12-05 14:25:31',
                'history' : [
                  {'date' : '2017-12-01 14:25:31', 'value' : 5},
                  {'date' : '2017-12-03 14:25:31', 'value' : 7},
                  {'date' : '2017-12-05 14:25:31', 'value' : 6},
                ]
              }
            ]
        }
      ;

    res.render('./'+global.config.pcode+'/management/recipe', { title: global.config.productname, mainmenu:mainmenu, rtnData:out_data });
  });

});

// recipe 신규/수정 화면 호출.
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
    'lastupdate' : '2017-12-04'
  };
  if (req.params.id === 'NEW') {
    res.render('./'+global.config.pcode+'/management/recipe_new', { title: global.config.productname, mainmenu:mainmenu, rtnData:out_data});
  } else {
    res.render('./'+global.config.pcode+'/management/recipe_edit', { title: global.config.productname, mainmenu:mainmenu, rtnData:out_data});
  }
});

// recipe 신규 등록.
router.put('/recipe/:id', function(req, res) {
  logger.debug(req.body);
  // req.body값을 직접 JSON.parse로 처리하지 못함
  //  이유는 req.body 값은 { key : value} 구조는 맞지만
  // JSON.parse를 하기 위해서는 {"key" : "value"}로 변경해야 하므로 stringify로 변경 후 pasre한다.
  var in_data = JSON.stringify(req.body);
  in_data = JSON.parse(in_data);
  logger.debug('in_data : %j',  in_data);
  queryProvider.insertQueryByID("management", "insertRecipe", in_data, function(err, out_data) {
    if(out_data.result == "created"){
      var rtnCode = CONSTS.getErrData("D001");
      logger.debug(out_data.result);
    }
    if (err) { logger.debug(err) };
    res.json({rtnCode: rtnCode});
  });
});

// recipe 등록 정보 변경.
router.post('/recipe/:id', function(req, res) {
  var in_data = JSON.parse(req.body);
  // var in_data = {
  //   STEP: req.body.step,
  //   CID: req.body.step,
  //   USERID: req.body.userid,
  //   PASSWORD: req.body.password[0],
  //   POSITION: req.body.position,
  //   TEL: req.body.tel,
  //   MOBILE: req.body.mobile,
  //   USE: req.body.use,
  //   EMAIL: req.body.email,
  //   NOTE: req.body.note,
  //   DATE: Utils.getToday(fmt2, 'Y', 'Y')
  // };
  queryProvider.insertQueryByID("management", "insertRecipe", in_data, function(err, out_data) {
    if(out_data.result == "created"){
      var rtnCode = CONSTS.getErrData("D001");
      logger.debug(out_data.result);
    }
    if (err) { logger.debug(err) };
    res.json({rtnCode: rtnCode});
  });
});

// recipe 등록 정보 삭제.
router.delete('/recipe/:id', function(req, res) {
  var in_data = { INDEX: indexUser, TYPE : "user", ID : "user_id", VALUE: req.body.userid  };
  var in_data = {
    INDEX: indexUser,
    NAME: req.body.username,
    USERID: req.body.userid,
    PASSWORD: req.body.password[0],
    POSITION: req.body.position,
    TEL: req.body.tel,
    MOBILE: req.body.mobile,
    USE: req.body.use,
    EMAIL: req.body.email,
    NOTE: req.body.note,
    DATE: Utils.getToday(fmt2, 'Y', 'Y')
  };
  queryProvider.insertQueryByID("management", "insertUser", in_data, function(err, out_data) {
    if(out_data.result == "created"){
      var rtnCode = CONSTS.getErrData("D001");
      logger.debug(out_data.result);
    }
    if (err) { logger.debug(err) };
    res.json({rtnCode: rtnCode});
  });
});

router.get('/restapi/checkId/:id', function(req, res, next) {
  logger.debug('/restapi/checkId/' + req.params.id);
  var in_data = {ID : req.params.id};
  queryProvider.selectSingleQueryByID2("management","selectCheckId", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getCodeValue('MANAGEMENT', 'M002');
    if (out_data == null || out_data == '') {
      rtnCode = CONSTS.getCodeValue('MANAGEMENT', 'M001');
    } else {
    }
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

module.exports = router;
module.exports.selectAlarmList = selectAlarmList;
module.exports.saveAlarmData = saveAlarmData;
