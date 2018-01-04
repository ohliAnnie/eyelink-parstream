var logger = global.log4js.getLogger('nodeManagement');
var CONSTS = require('../consts');
var CCODE = require('./commonCode');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'open selected', settings:''};

var indexUser = global.config.es_index.es_user;
var indexRole = global.config.es_index.es_role;
var indexMap = global.config.es_index.es_auth_map;
var indexAuthMenu = global.config.es_index.es_auth_menu;
var indexMenu = global.config.es_index.es_menu;

var fmt1 = CONSTS.DATEFORMAT.DATE; // "YYYY-MM-DD",
var fmt2 = CONSTS.DATEFORMAT.DATETIME; // "YYYY-MM-DD HH:MM:SS",

router.get('/restapi/getAlarmList', function(req, res, next) {
  logger.info('start /restapi/getAlarmList');
  selectAlarmList(function(data) {
    res.json({rtnCode: data.rtnCode, rtnData: data.rtnData, rtnCount : data.rtnCount});
  })
});

function selectAlarmList(cb) {
  var d = new Date();
  var in_data = {};
  var rtnCode = CONSTS.getErrData('0000');
  queryProvider.selectSingleQueryByID2("management", "selectAlarmList", in_data, function(err, out_data, count) {
    logger.debug(out_data);
    if (count == 0) {
      rtnCode = CONSTS.getErrData('0001');
      res.json({rtnCode: rtnCode});
    } else {
      out_data.forEach(function(d){
        try {
          d._source.timestamp = Utils.getDateUTC2Local(d._source.timestamp, CONSTS.DATEFORMAT.DATETIME);
        } catch(e) {;}
      });
    }
    logger.info('selectAlarmList -> count : ' + count);
    cb({rtnCode: rtnCode, rtnData: out_data, rtnCount : count});
  });
}

function saveAlarmData(data, cb) {
  logger.debug('start saveAlarmData');
  data.flag = 'alarm';
  var in_data = {
    BODY : JSON.stringify(data)
  };
  logger.debug(in_data);
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
  var step = (req.query.step==undefined) ? 'notching': req.query.step.toLowerCase();
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
      'machineList' : global.management.machine,
      'machine' : global.management.machine[step],
      'data' : out_data
    };
    logger.debug(out_data.data);

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
        logger.debug('out_data2 : %j', out_data2);
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

router.get('/users', function(req, res, next) {
  logger.debug('user/restapi/selectUserList');
  var in_data = { INDEX: indexUser, TYPE: "user" };
  queryProvider.selectSingleQueryByID2("management", "selectList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    out_data.forEach(function(d){
      d._source.reg_date = Utils.getDateUTC2Local(d._source.reg_date, fmt2);
    });
    res.render('./'+global.config.pcode+'/management/users', { title: global.config.productname, mainmenu:mainmenu, users:out_data });
  });
});

router.get('/users/:id', function(req, res) {
  logger.debug(req.params.id);
  // 신규 등록
  if (req.params.id === 'addUser') {
    res.render('./'+global.config.pcode+'/management/sign_up', { title: global.config.productname, mainmenu:mainmenu });
  } else { // 기존 사용자 정보 변경
    var in_data = {  INDEX: indexUser,  TYPE: "user",  ID : "user_id",  VALUE: req.params.id   };
    queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
      if (out_data[0] != null){
        var rtnCode = CONSTS.getErrData('0000');
        var user = out_data[0];
        var in_data = {  INDEX: indexMap, TYPE: "map", ID : "user_id", VALUE: req.params.id   };
        queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
          if (out_data != null){
            var rtnCode = CONSTS.getErrData('0000');
            var maps = out_data;
          } else {
            var rtnCode = CONSTS.getErrData('0001');
            var maps = [];
          }
          res.render('./'+global.config.pcode+'/management/user_edit', { title: global.config.productname, mainmenu:mainmenu, user:user, maps:maps, tnc_error : tnc_error});
        });
      } else {
        var rtnCode = CONSTS.getErrData('0001');
      }
      res.render('./'+global.config.pcode+'/management/user_edit', { title: global.config.productname, mainmenu:mainmenu, user:user, maps:maps });
    });
  }
});

// 사용자 신규 등록
router.post('/users/:id', function(req, res) {
  var in_data = { INDEX: indexUser, TYPE : "user", ID : "user_id", VALUE: req.body.userid  };
  queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');
      logger.debug(rtnCode);
      res.json({rtnCode: rtnCode});
    }  else  {
      var d = new Date().toString().split(' ');
      var s = d[4].split(':');
      var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };
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
    }
  });
});

// 사용자 정보 수정
router.put('/users/:id', function(req, res) {
  var in_data = {
    INDEX: indexUser,
    ID : req.body.id,
    NAME: req.body.username,
    PASSWORD: req.body.password,
    POSITION: req.body.position,
    TEL: req.body.tel,
    MOBILE: req.body.mobile,
    USE: req.body.use,
    EMAIL: req.body.email,
    NOTE: req.body.note
  };
  logger.debug(in_data);
  queryProvider.updateQueryByID("management", "updateUser", in_data, function(err, out_data) {
    if(out_data.result == "updated"){
     var rtnCode = CONSTS.getErrData("D002");
    }
    if (err) { logger.debug(err);   }
    res.json({rtnCode: rtnCode});
  });
});


// 사용자 정보 삭제
router.delete('/users/:id', function(req, res) {
  logger.debug('deleteUser');
  var in_data = {  INDEX: indexUser,  TYPE: "user",  ID: req.body.id   };
  queryProvider.deleteQueryByID("management", "deleteById", in_data, function(err, out_data) {
    if(out_data.result == "deleted");
      var rtnCode = CONSTS.getErrData("D003");
      var in_data = {  INDEX: indexMap, TYPE: "map",  ID: "user_id",  VALUE : req.params.id  };
      queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
        if (out_data != null){
          var rtnCode = CONSTS.getErrData('0000');
          logger.debug(out_data);
          for(i=0; i<out_data.length; i++){
            var in_data = { INDEX : indexMap, TYPE: "map", ID : out_data[i]._id     }
            queryProvider.deleteQueryByID("management", "deleteById", in_data, function(err, out_data) {
              if(out_data.result == "deleted"){
                var rtnCode = CONSTS.getErrData("D004");
              }
              if(err){ logger.debug(err);    }
            });
          }
        } else {
          var rtnCode = CONSTS.getErrData('E007');
        }
        res.json({rtnCode: rtnCode});
      });
    if(err){ logger.debug(err);    }
    res.json({rtnCode: rtnCode});
  });
});

router.get('/user/:id', function(req, res) {
  var in_data = {  INDEX: indexUser,  TYPE: "user",  ID : "user_id",  VALUE: req.params.id   };
  queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('0000');
      var user = out_data[0];
      var in_data = {  INDEX: indexMap, TYPE: "map", ID : "user_id", VALUE: req.params.id   };
      queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
        if (out_data != null){
          var rtnCode = CONSTS.getErrData('0000');
          var maps = out_data;
        } else {
          var rtnCode = CONSTS.getErrData('0001');
          var maps = [];
        }
        res.render('./'+global.config.pcode+'/management/user_info', { title: global.config.productname, mainmenu:mainmenu, user:user, maps:maps});
      });
    } else {
      var rtnCode = CONSTS.getErrData('0001');
    }
    res.render('./'+global.config.pcode+'/management/user_info', { title: global.config.productname, mainmenu:mainmenu, user:user, maps:maps });
  });
});


router.get('/role', function(req, res, next) {
  logger.debug('role/restapi/selectRoleList');
  var in_data = { INDEX: indexRole, TYPE:"role" };
  queryProvider.selectSingleQueryByID2("management", "selectList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    var roles = out_data;
    res.render('./'+global.config.pcode+'/management/role_list', { title: global.config.productname, mainmenu:mainmenu, roles:roles });
  });
});

router.get('/role/:id', function(req, res) {
  logger.debug(req.params.id);
  // 신규 등록
  if (req.params.id === 'addRole') {
    res.render('./'+global.config.pcode+'/management/role_add', { title: global.config.productname, mainmenu:mainmenu });
  } else { // 기존 사용자 정보 변경
    var in_data = { INDEX: indexRole, TYPE: "role", ID: "role_id", VALUE: req.params.id };
    queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
      if(out_data[0] != null){
        var in_data = { INDEX: indexMenu, TYPE: "menu", ID: "role_id", VALUE: req.params.id };
        var role = out_data[0];
        queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
          var menu = out_data[0];
          res.render('./'+global.config.pcode+'/management/role_edit', { title: global.config.productname,   mainmenu:mainmenu,   role:role, menu:menu});
        });
      }
      res.render('./'+global.config.pcode+'/management/role_edit',  { title: global.config.productname,   mainmenu:mainmenu,   role:role,  menu:menu});
    });
  }
});

// role 신규 등록
// TODO role 등록시 global.management.role 정보 갱신 로직 추가 필요.
router.post('/role/:id', function(req, res) {
  var in_data = { INDEX: indexRole, TYPE: "role", ID: "role_id", VALUE: req.body.roleid };
  queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');
      res.json({rtnCode: rtnCode});
    } else {
      var in_data = { INDEX: indexRole, ROLEID: req.body.roleid, NAME: req.body.rolename };
      queryProvider.insertQueryByID("management", "insertRole", in_data, function(err, out_data) {
        if(out_data.result == "created"){
          logger.debug(out_data);
          var rtnCode = CONSTS.getErrData("D001");
        }
        if (err) { logger.debug(err) };
        res.json({rtnCode: rtnCode});
      });
    }
  });
});

// ROLE 정보 수정
// TODO role 수정시 global.management.role 정보 갱신 로직 추가 필요.
router.put('/role/:id', function(req, res) {
  var in_data = { INDEX: indexRole, ID : req.body.id, NAME: req.body.rolename };
  queryProvider.updateQueryByID("management", "updateRole", in_data, function(err, out_data) {
    if(out_data.result == "updated" || out_data.result == "noop"){
      var rtnCode = CONSTS.getErrData("D002");
    }
    if (err) { logger.debug(err);   }
    res.json({rtnCode: rtnCode});
  });
});

// role 정보 삭제
// TODO role 삭제시 global.management.role 정보 갱신 로직 추가 필요.
router.delete('/role/:id', function(req, res) {
  logger.debug('delete role');
  var in_data = { INDEX: indexRole, TYPE: "role", ID: req.body.id  };
  queryProvider.deleteQueryByID("management", "deleteById", in_data, function(err, out_data) {
    if(out_data.result == "deleted"){
      var in_data = { INDEX: indexMenu, TYPE: "menu", ID: req.body.id };
      queryProvider.deleteQueryByID("management", "deleteById", in_data, function(err, out_data) {
        if(out_data.result == "deleted"){
          var rtnCode = CONSTS.getErrData("D003");
          var in_data = {  INDEX: indexMap, TYPE: "map",  ID: "role_id",  VALUE : req.params.id  };
          queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
            if (out_data != null){
              var rtnCode = CONSTS.getErrData('0000');
              logger.debug(out_data);
              for(i=0; i<out_data.length; i++){
                var in_data = { INDEX : indexMap, TYPE: "map", ID : out_data[i]._id }
                queryProvider.deleteQueryByID("management", "deleteById", in_data, function(err, out_data) {
                  if(out_data.result == "deleted"){
                    var rtnCode = CONSTS.getErrData("D003");
                  }
                  if(err){ logger.debug(err); }
                });
              }
            } else {
              var rtnCode = CONSTS.getErrData('E007');
            }
            res.json({rtnCode: rtnCode});
          });
        }
        if(err){ logger.debug(err); }
        res.json({rtnCode: rtnCode});
      });
      var rtnCode = CONSTS.getErrData("D003");
    if(err){ logger.debug(err);   }
    res.json({rtnCode: rtnCode});
    }
  });
});

router.get('/memList/:id', function(req, res, next) {
  logger.debug('role/restapi/selectMemList');
  var in_data = { INDEX: indexMap, TYPE:"map", ID : "role_id", VALUE : req.params.id };
  queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    logger.debug(out_data);
    var mems = out_data;
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }  else {
      var in_data = { INDEX: indexUser, TYPE: "user" };
      queryProvider.selectSingleQueryByID2("management", "selectList", in_data, function(err, out_data, params) {
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        }
        var users = out_data;
        logger.debug(users);
        res.render('./'+global.config.pcode+'/management/mem_list', { title: global.config.productname, mainmenu:mainmenu, mems:mems, users:users, roleid:req.params.id });
      });
    }
    res.render('./'+global.config.pcode+'/management/mem_list', { title: global.config.productname, mainmenu:mainmenu, mems:mems, users:users, roleid:req.params.id  });
  });
});

router.get('/mem/:id', function(req, res) {
  logger.debug(req.params.id);
  // 신규 등록
  if (req.params.id === 'addMem') {
    res.render('./'+global.config.pcode+'/management/add_mem', { title: global.config.productname, mainmenu:mainmenu });
  } else { // 기존 사용자 정보 변경
    var in_data = { INDEX: indexMap, TYPE: "map", ID: "role_id", VALUE: req.params.id };
    queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
      logger.debug(out_data[0]);
       if(out_data[0] != null){
        var in_data = { INDEX: indexMenu, TYPE: "menu", ID: "role_id", VALUE: req.params.id };
        var role = out_data[0];
        queryProvider.selectSingleQueryByID2("management", "selectListById", in_data, function(err, out_data, params) {
          var menu = out_data[0];
          res.render('./'+global.config.pcode+'/management/role_edit', { title: global.config.productname, mainmenu:mainmenu, role:role, menu:menu});
        });
      }
      res.render('./'+global.config.pcode+'/management/role_edit', { title: global.config.productname, mainmenu:mainmenu, role:role});
    });
  }
});

// mem 신규 등록
router.post('/mem/:id', function(req, res) {
  var in_data = { INDEX: indexMap, TYPE: "map", ROLEID: req.params.id, USERID: req.body.userid };
  queryProvider.selectSingleQueryByID2("management", "selectCheckMap", in_data, function(err, out_data, params) {    
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E006');
      res.json({rtnCode: rtnCode});
    } else {
      var in_data = { INDEX: indexMap, ROLEID: req.params.id, USERID: req.body.userid };
      queryProvider.insertQueryByID("management", "insertMap", in_data, function(err, out_data) {
        logger.debug(out_data);
        if(out_data.result == "created"){
          logger.debug(out_data);
          var rtnCode = CONSTS.getErrData("D001");
        }
        if (err) { logger.debug(err) };
        res.json({rtnCode: rtnCode});
      });
    }
  });
});

// role 정보 삭제
router.delete('/mem/:id', function(req, res) {
  logger.debug('delete mem');
  var in_data = { INDEX: indexMap, TYPE: "map", ID: req.params.id };
  queryProvider.deleteQueryByID("management", "deleteById", in_data, function(err, out_data) {
    if(out_data.result == "deleted");
      var rtnCode = CONSTS.getErrData("D003");
    if(err){ logger.debug(err); }
    res.json({rtnCode: rtnCode});
  });
});

router.get('/menu', function(req, res, next) {
  logger.debug('management/restapi/menu');
  mainmenu.management = ' open selected';
  res.render('./'+global.config.pcode+'/management/menu', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/restapi/getMenuList', function(req, res, next) {
  logger.debug('/restapi/getMenuList');
  var in_data = {  INDEX: indexMenu, TYPE: "menu", SORT: "code" };
  var rtnCode = CONSTS.getErrData('0000');
  queryProvider.selectSingleQueryByID2("management", "selectSortList", in_data, function(err, out_data, params) {
    logger.debug(out_data);
    if (out_data.length == 0) {
      rtnCode = CONSTS.getErrData('0001');
      res.json({rtnCode: rtnCode});
    }
    logger.debug('management/restapi/getMenuList -> length : %s', out_data.length);
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/menu/:id', function(req, res) {
  mainmenu.management = ' open selected';
  logger.debug(req.params.id);
  // 신규 등록
  if (req.params.id === 'editMenu') {
    var in_data = { INDEX: indexMenu, TYPE: "menu", ID: "code", SORT : "code" };
     queryProvider.selectSingleQueryByID2("management", "selectSortList", in_data, function(err, out_data, params) {
      logger.debug(out_data);
      var list = [];
      out_data.forEach(function(d){
        if(parseInt(d._source.code)%1000 == 0 && d._source.code != "0000") {
          list.push(d._source);
        }
      });
      res.render('./'+global.config.pcode+'/management/menu_edit', { title: global.config.productname, mainmenu:mainmenu, list:list });
    });
  }
});

// menu 신규 등록
router.post('/menu/:id', function(req, res) {
  var in_data = {   INDEX: indexMenu, TYPE: "menu",   ID : "code",
                    VALUE: req.params.id, NAME: req.body.name, UPCODE: req.body.upcode };
  queryProvider.selectSingleQueryByID2("management", "selectById", in_data, function(err, out_data, params) {
    if (out_data.length != 0){
      var rtnCode = CONSTS.getErrData('D005');
      res.json({rtnCode: rtnCode});
    }  else  {
      queryProvider.insertQueryByID("management", "insertMenu", in_data, function(err, out_data) {
        logger.debug(out_data);
        if(out_data.result == "created"){
          logger.debug(out_data);
          var rtnCode = CONSTS.getErrData("D001");
          if(parseInt(req.params.id)%1000 != 0){
            var in_data = { INDEX: indexAuthMenu, TYPE: "auth", ID : out_data._id, CODE : req.params.id };
            queryProvider.insertQueryByID("management", "insertAuthMenu", in_data, function(err, out_data) {
              logger.debug(out_data);
              if(out_data.result == "created"){
                var rtnCode = CONSTS.getErrData("D001");
              }
              if (err) { logger.debug(err) };
              res.json({rtnCode: rtnCode});
            });
          }
        }
        if (err) { logger.debug(err) };
        res.json({rtnCode: rtnCode});
      });
    }
  });
});

router.get('/menu_upper', function(req, res, next) {
  logger.debug('menu/menu_upper');
  var in_data = { INDEX: indexMenu, TYPE:"menu", SORT : "code" };
  var list = [];
  queryProvider.selectSingleQueryByID2("management", "selectSortList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      out_data.forEach(function(d){
        if(d._source.upcode == "0000"){
          list.push(d);
        }
      });
    }
    res.render('./'+global.config.pcode+'/management/menu_upper', { title: global.config.productname, mainmenu:mainmenu, list:list });
  });
});

// update
router.put('/menu_upper/:id', function(req, res, next) {
  logger.debug('menu_upper/update');
  var in_data = { INDEX: indexMenu, TYPE:"menu", ID : req.body.id,
                  CODE : req.body.code, NAME : req.body.name, UPCODE : req.body.upcode };
  queryProvider.updateQueryByID("management", "updateMenu", in_data, function(err, out_data, params) {
    if(out_data.result == "updated"){
      var rtnCode = CONSTS.getErrData("D002");
    } else if(out_data.result == "noop"){
      var rtnCode = CONSTS.getErrData("D007");
    } else {
      var rtnCode = CONSTS.getErrData("D006");
    }
    if (err) { logger.debug(err);   }
    res.json({rtnCode: rtnCode});
  });
});

// update
router.put('/menu/:id', function(req, res, next) {
  logger.debug('menu/update');
  var in_data = { INDEX: indexMenu, TYPE:"menu", ID : req.body.id, CODE : req.body.code, NAME : req.body.name, UPCODE : req.body.upcode };
  queryProvider.updateQueryByID("management", "updateMenu", in_data, function(err, out_data, params) {
    if(out_data.result == "updated"){
      var rtnCode = CONSTS.getErrData("D002");
      var in_data = { INDEX: indexAuthMenu, TYPE:"auth", ID : req.body.id, CODE : req.body.code };
      queryProvider.updateQueryByID("management", "updateAuthMenuCode", in_data, function(err, out_data, params) {
        if(out_data.result == "updated"){
          var rtnCode = CONSTS.getErrData("D002");
        } else if(out_data.result == "noop"){
          var rtnCode = CONSTS.getErrData("D007");
        } else {
          var rtnCode = CONSTS.getErrData("D006");
        }
        if (err) { logger.debug(err);   }
        res.json({rtnCode: rtnCode});
      });
    }
    if (err) { logger.debug(err);   }
    res.json({rtnCode: rtnCode});
  });
});

// update
router.put('/menu_auth/:id', function(req, res, next) {
  logger.debug('updateAuthMenu');
  if(req.body.role == undefined){
    var query = "updateAuthMenuNone";
    var in_data = { INDEX: indexAuthMenu, TYPE:"auth", ID : req.body.id };
  } else {
    query = "updateAuthMenu";
    var in_data = { INDEX: indexAuthMenu, TYPE:"auth", ID : req.body.id, ROLE : req.body.role };
  }  
  queryProvider.updateQueryByID("management", query, in_data, function(err, out_data, params) {
    if(out_data.result == "updated"){
      var rtnCode = CONSTS.getErrData("D002");
    } else if(out_data.result == "noop"){
      var rtnCode = CONSTS.getErrData("D007");
    } else {
      var rtnCode = CONSTS.getErrData("D006");
    }
    if (err) { logger.debug(err);   }
    res.json({rtnCode: rtnCode});
  });
});


// menu 정보 삭제
router.delete('/menu/:id', function(req, res) {
  logger.debug('delete menu_upper');
  var in_data = { INDEX: indexMenu, TYPE: "menu", ID: req.params.id };
  queryProvider.deleteQueryByID("management", "deleteById", in_data, function(err, out_data) {
    if(out_data.result == "deleted");
      var rtnCode = CONSTS.getErrData("D003");
      var in_data = { INDEX: indexAuthMenu, TYPE: "auth", ID: req.params.id };
      queryProvider.deleteQueryByID("management", "deleteById", in_data, function(err, out_data) {
        if(out_data.result == "deleted");
          var rtnCode = CONSTS.getErrData("D003");
        if(err){ logger.debug(err);    }
        res.json({rtnCode: rtnCode, rtnData : out_data});
      });
    if(err){ logger.debug(err);    }
    res.json({rtnCode: rtnCode, rtnData : out_data});
  });
});

router.get('/restapi/getCodeList', function(req, res) {
  logger.info('/restapi/getCodeList');  
  var in_data = { INDEX: indexMenu, TYPE: "menu", SORT : "code", ID: "upcode", VALUE : req.query.upcode };
  queryProvider.selectSingleQueryByID2("management", "selectByIdSort", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    res.json({rtnCode: rtnCode, rtnData: out_data });
  });
});

router.get('/restapi/getAuthMenu', function(req, res) {
  logger.info('/restapi/getAuthRole');
  var in_data = {  INDEX: indexRole, TYPE: "role" };
  queryProvider.selectSingleQueryByID2("management", "selectList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      var in_data = { INDEX: indexAuthMenu, TYPE: "auth", SORT : "role", ID : "code", VALUE : req.query.code };
      var roleList = out_data;
      queryProvider.selectSingleQueryByID2("management", "selectById", in_data, function(err, out_data, params) {
        var rtnCode = CONSTS.getErrData('0000');
        if (out_data == null) {
          rtnCode = CONSTS.getErrData('0001');
        }
        var menuAuth = out_data[0]._source;
       res.json({rtnCode: rtnCode, menuAuth : menuAuth, roleList : roleList });
      });
    }
    res.json({rtnCode: rtnCode, menuAuth : menuAuth, roleList : roleList });
  });
});


router.get('/authority', function(req, res, next) {
  logger.debug('management/restapi/authority');
  mainmenu.management = ' open selected';
  res.render('./'+global.config.pcode+'/management/authority', { title: global.config.productname, mainmenu:mainmenu });
});

router.get('/asset', function(req, res, next) {
  logger.debug('asset');
  var in_data = { INDEX: indexUser, TYPE: "user" };
  queryProvider.selectSingleQueryByID2("management", "selectList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }
    logger.debug(out_data);
    var users = out_data;
    res.render('./'+global.config.pcode+'/management/asset', { title: global.config.productname, mainmenu:mainmenu, users:users });
  });
});

router.get('/rule', function(req, res, next) {
  logger.debug('rule');
  var commoncode = {
    type : CCODE.COMMONCODE.RULE.TYPE,
    rulename: CCODE.COMMONCODE.RULE.RULENAME,
    alarmtype : CCODE.COMMONCODE.RULE.ALARMTYPE,
  };
  var in_data = {};
  queryProvider.selectSingleQueryByID2("management", "selectRuleList", in_data, function(err, out_data, params) {
    if (err) {
      out_data = {};
    }
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    } else {
      out_data.forEach(function(d){
        d._source.typename = Utils.getCommonCode(CCODE.COMMONCODE.RULE.TYPE, d._source.type);
        d._source.rulename  = Utils.getCommonCode(CCODE.COMMONCODE.RULE.RULENAME[d._source.type], d._source.rulename);
        d._source.role  = Utils.getCommonCode(global.management.role, d._source.role);
        d._source.condition  = Utils.getCommonCode(CCODE.COMMONCODE.RULE.CONDITION, d._source.condition);
        d._source.alarmtype = Utils.getCommonCode(CCODE.COMMONCODE.RULE.ALARMTYPE, d._source.alarmtype);
        d._source.updatetimestamp = Utils.getDateUTC2Local(d._source.updatetimestamp, CONSTS.DATEFORMAT.DATETIME);
      });
    }

    var out_data = {
      'data' : out_data
    };
    logger.debug(out_data.data);
    logger.debug(out_data.data.length);

    res.render('./'+global.config.pcode+'/management/rule_list',
    {
      title : global.config.productname,
      mainmenu : mainmenu,
      commoncode : commoncode,
      rtnData : out_data });
  });

});

// rule 신규/수정 화면 호출.
router.get('/rule/:id', function(req, res) {
  var commoncode = {
    type : CCODE.COMMONCODE.RULE.TYPE,
    rulename: CCODE.COMMONCODE.RULE.RULENAME,
    condition: CCODE.COMMONCODE.RULE.CONDITION,
    alarmtype : CCODE.COMMONCODE.RULE.ALARMTYPE,
  };

  if (req.params.id === 'NEW') {
    var out_data = {};
    res.render('./'+global.config.pcode+'/management/rule_new',
      { title: global.config.productname,
        mainmenu:mainmenu,
        commoncode : commoncode,
        role : global.management.role,
        rtnData:out_data});
  } else {
    var in_data = {_id : req.params.id};
    queryProvider.selectSingleQueryByID2("management", "selectRuleById", in_data, function(err, out_data, params) {
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data == null) {
        rtnCode = CONSTS.getErrData('0001');
      }
      out_data.forEach(function(d){
        d._source.updatetimestamp = Utils.getDateUTC2Local(d._source.updatetimestamp, CONSTS.DATEFORMAT.DATETIME);
      });
      res.render('./'+global.config.pcode+'/management/rule_edit',
        {
          title : global.config.productname,
          mainmenu : mainmenu,
          commoncode : commoncode,
          rule : commoncode.rulename[out_data[0]._source.type],
          role : global.management.role,
          rtnData : out_data[0] });
    });
  }
});


// rule 신규 등록.
router.post('/rule/:id', function(req, res) {
  logger.debug(req.body);
  // req.body값을 직접 JSON.parse로 처리하지 못함
  //  이유는 req.body 값은 { key : value} 구조는 맞지만
  // JSON.parse를 하기 위해서는 {"key" : "value"}로 변경해야 하므로 stringify로 변경 후 pasre한다.
  var in_data = JSON.stringify(req.body);
  in_data = JSON.parse(in_data);
  in_data.updatetimestamp = Utils.getToday(CONSTS.DATEFORMAT.DATETIME, 'Y', 'Y');
  logger.debug('in_data : %j',  in_data);
  queryProvider.insertQueryByID("management", "insertRule", in_data, function(err, out_data) {
    if(out_data.result == "created"){
      var rtnCode = CONSTS.getErrData("D001");
      logger.debug(out_data.result);
    }
    if (err) { logger.debug(err) };
    res.json({rtnCode: rtnCode});
  });
});

// rule 등록 정보 변경.
router.put('/rule/:id', function(req, res) {
  var in_data = JSON.stringify(req.body);
  in_data = JSON.parse(in_data);
  in_data.updatetimestamp = Utils.getToday(CONSTS.DATEFORMAT.DATETIME, 'Y', 'Y');
  logger.debug('in_data : %j',  in_data);
  queryProvider.updateQueryByID("management", "updateRule", in_data, function(err, out_data) {
    if(out_data.result == "updated"){
     var rtnCode = CONSTS.getErrData("D002");
    }
    if (err) { logger.debug(err);   }
    res.json({rtnCode: rtnCode});
  });
});

// rule 등록 정보 삭제.
router.delete('/rule/:id', function(req, res) {
  var in_data = {_id : req.params.id};
  queryProvider.deleteQueryByID("management", "deleteRule", in_data, function(err, out_data) {
    if(out_data.result == "deleted"){
      var rtnCode = CONSTS.getErrData("D003");
      logger.debug(out_data.result);
    }
    if (err) { logger.debug(err) };
    res.json({rtnCode: rtnCode});
  });
});

module.exports = router;
module.exports.selectAlarmList = selectAlarmList;
module.exports.saveAlarmData = saveAlarmData;
