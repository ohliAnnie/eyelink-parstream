var logger = global.log4js.getLogger('nodeManagement');
var CONSTS = require('../consts');
var CCODE = require('./commonCode');
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
  var step = (req.query.step==undefined) ? '': req.query.step.toLowerCase();
  var cid = (req.query.cid==undefined) ? '': req.query.cid;
  var in_data = {
    'step' : step,
    'cid' : cid };
  queryProvider.selectSingleQueryByID2("management", "selectRecipeList", in_data, function(err, out_data, params) {
    if (err) {
      out_data = {};
    }
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      out_data.forEach(function(d){
        d._source.updatetimestamp = Utils.getDateUTC2Local(d._source.updatetimestamp, CONSTS.DATEFORMAT.DATETIME);
      });
    }

    var out_data = {
      'machine' :
      [
        {'cid' : '100'},
        {'cid' : '200'}
      ],
      'data' : out_data
    };
    logger.debug(out_data.data);
    logger.debug(out_data.data.length);

    res.render('./'+global.config.pcode+'/management/recipe_list',
    {
      title : global.config.productname,
      mainmenu : mainmenu,
      condData : {step : req.query.step, cid : req.query.cid},
      commoncode : {step : CCODE.COMMONCODE.STEP},
      rtnData : out_data });
  });

});

// recipe 신규/수정 화면 호출.
router.get('/recipe/:id', function(req, res) {
  var commoncode = {
    type : CCODE.COMMONCODE.MACHINE.TYPE,
    unit : CCODE.COMMONCODE.MACHINE.UNIT,
    datatype : CCODE.COMMONCODE.MACHINE.DATATYPE,
  };
  if (req.params.id === 'NEW') {
    var out_data = {
      'step' : req.query.step,
      'cid' : req.query.cid,
    };
    res.render('./'+global.config.pcode+'/management/recipe_new',
      { title: global.config.productname,
        mainmenu:mainmenu,
        commoncode : commoncode,
        rtnData:out_data});
  } else {
    var in_data = {id : req.params.id.toLowerCase()};
    queryProvider.selectSingleQueryByID2("management", "selectRecipeById", in_data, function(err, out_data, params) {
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data == null) {
        rtnCode = CONSTS.getErrData('0001');
      }
      // step 은 term query 이므로 toLowerCase()를 하고
      // field는 field이므로 입력받는 문자 그대로 query로 사용함.
      var in_data2 = {
        'step' : req.query.step.toLowerCase(),
        'cid' : req.query.cid,
        'field' : 'data.' + req.params.id
      };
      var queryId = "selectRecipe_" + req.query.step + "_HistoryById";
      queryProvider.selectSingleQueryByID2("management", queryId, in_data2, function(err, out_data2, params) {
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data2 == null) {
          rtnCode = CONSTS.getErrData('0001');
          out_data2 = [];
        }
        logger.info('out_data2 : %j', out_data2);
        var out_data3 = [];
        // History 데이터에서 id값과 일치하는 값만을 화면에 출력하기 위해서 재구성함.
        out_data2.forEach(function(d) {
          var item = {dtSensed :  null, value : null};
          for (var i=0; i<d._source.data.length; i++ ) {
            item.dtSensed = Utils.getDateUTC2Local(d._source.data[i].dtSensed, CONSTS.DATEFORMAT.DATETIME);
            item.value = d._source.data[i][req.params.id];
            out_data3.push(item);
          }
        });
        res.render('./'+global.config.pcode+'/management/recipe_edit',
          {
            title : global.config.productname,
            mainmenu : mainmenu,
            commoncode : commoncode,
            rtnData : out_data[0],
            rtnDataHistory : out_data3 });
      });
    });
  }
});


// recipe 신규 등록.
router.post('/recipe/:id', function(req, res) {
  logger.debug(req.body);
  // req.body값을 직접 JSON.parse로 처리하지 못함
  //  이유는 req.body 값은 { key : value} 구조는 맞지만
  // JSON.parse를 하기 위해서는 {"key" : "value"}로 변경해야 하므로 stringify로 변경 후 pasre한다.
  var in_data = JSON.stringify(req.body);
  in_data = JSON.parse(in_data);
  in_data.updatetimestamp = Utils.getToday(CONSTS.DATEFORMAT.DATETIME, 'Y', 'Y');
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
router.put('/recipe/:id', function(req, res) {
  var in_data = JSON.stringify(req.body);
  in_data = JSON.parse(in_data);
  in_data.updatetimestamp = Utils.getToday(CONSTS.DATEFORMAT.DATETIME, 'Y', 'Y');
  logger.debug('in_data : %j',  in_data);
  queryProvider.updateQueryByID("management", "updateRecipe", in_data, function(err, out_data) {
    if(out_data.result == "updated"){
     var rtnCode = CONSTS.getErrData("D002");
    }
    if (err) { logger.debug(err);   }
    res.json({rtnCode: rtnCode});
  });
});

// recipe 등록 정보 삭제.
router.delete('/recipe/:id', function(req, res) {
  var in_data = {_id : req.params.id};
  queryProvider.deleteQueryByID("management", "deleteRecipe", in_data, function(err, out_data) {
    if(out_data.result == "deleted"){
      var rtnCode = CONSTS.getErrData("D003");
      logger.debug(out_data.result);
    }
    if (err) { logger.debug(err) };
    res.json({rtnCode: rtnCode});
  });
});


// ID 중복 여부 체크.
router.get('/restapi/checkId/:id', function(req, res, next) {
  logger.debug('/restapi/checkId/' + req.params.id);
  var in_data = {id : req.params.id.toLowerCase()};
  queryProvider.selectSingleQueryByID2("management","selectRecipeById", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getCodeValue('MANAGEMENT', 'M002');
    if (out_data == null || out_data == '') {
      rtnCode = CONSTS.getCodeValue('MANAGEMENT', 'M001');
    } else {
    }
    res.json({rtnCode: rtnCode, rtnData: 'Y' });
  });
});

module.exports = router;
module.exports.selectAlarmList = selectAlarmList;
module.exports.saveAlarmData = saveAlarmData;
