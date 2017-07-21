var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'open selected', settings:''};
var indexUser = global.config.es_index.es_user;  
var indexRole = global.config.es_index.es_role;  
var indexMap = global.config.es_index.es_auth_map;  
var indexMenu = global.config.es_index.es_auth_menu;  

router.get('/users', function(req, res, next) {
  console.log('user/restapi/selectUserList');
  var in_data = { INDEX: indexUser, TYPE: "user" };
  queryProvider.selectSingleQueryByID2("user", "selectList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    console.log(out_data);
    var users = out_data;    
    res.render('./management/users'+global.config.pcode, { title: global.config.productname, mainmenu:mainmenu, users:users });
  });
});
  
router.get('/users/:id', function(req, res) {
  console.log(req.params.id);
  // 신규 등록
  if (req.params.id === 'addUser') {
    res.render('./management/sign_up', { title: global.config.productname, mainmenu:mainmenu });
  } else { // 기존 사용자 정보 변경
    var in_data = {
      INDEX: indexUser,
      USERID: req.params.id,
    };
    queryProvider.selectSingleQueryByID2("user", "selectEditUser", in_data, function(err, out_data, params) {      
      var rtnCode = CONSTS.getErrData('0000');      
            
      res.render('./management/edit_user',
        { title: global.config.productname,   mainmenu:mainmenu,   user:out_data[0]});
     });
  }
});

// 사용자 신규 등록
router.post('/users/:id', function(req, res) {  
  var in_data = {    
    INDEX: indexUser,
    TYPE : "user",
    ID : "user_id",
    USERID: req.body.userid       
  };
  console.log(in_data);
  queryProvider.selectSingleQueryByID2("user", "selectCheckJoin", in_data, function(err, out_data, params) {        
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');
      console.log(rtnCode);
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
        EMAIL: req.body.email,        
        DATE: d[3]+'-'+mon[d[1]]+'-'+d[2]+'T'+s[0]+':'+s[1]+':'+s[2]
      };      
      queryProvider.insertQueryByID("user", "insertUser", in_data, function(err, out_data) {
        console.log(out_data);
        if(out_data.result == "created"){
          var rtnCode = CONSTS.getErrData("D001");        
          console.log(rtnCode);
        }
        if (err) { console.log(err) };               
      
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
    EMAIL: req.body.email    
  };
  console.log(in_data);
  queryProvider.updateQueryByID("user", "updateUser", in_data, function(err, out_data) {    
    if(out_data.result == "updated");
        var rtnCode = CONSTS.getErrData("D002");            
    if (err) { console.log(err);   }
    res.json({rtnCode: rtnCode});
  });
});


// 사용자 정보 삭제
router.delete('/users/:id', function(req, res) {
  console.log('deleteUser');
  var in_data = {    
    INDEX: indexUser,
    TYPE: "user",
    ID: req.params.id  
  };  
  queryProvider.deleteQueryByID("user", "deleteById", in_data, function(err, out_data) {
    if(out_data.result == "deleted");
        var rtnCode = CONSTS.getErrData("D003");        
    if(err){ console.log(err);    }
    res.json({rtnCode: rtnCode});
  });
});

router.get('/role', function(req, res, next) {
  console.log('role/restapi/selectRoleList');
  var in_data = { INDEX: indexRole, TYPE:"role" };
  queryProvider.selectSingleQueryByID2("user", "selectList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    console.log(rtnCode);
    console.log(out_data);
    var roles = out_data;    
    res.render('./management/role_list', { title: global.config.productname, mainmenu:mainmenu, roles:roles });
  });
});

router.get('/role/:id', function(req, res) {
  console.log(req.params.id);
  // 신규 등록
  if (req.params.id === 'addRole') {
    res.render('./management/add_role', { title: global.config.productname, mainmenu:mainmenu });
  } else { // 기존 사용자 정보 변경
    var in_data = {
      INDEX: indexUser,
      USERID: req.params.id,
    };
    queryProvider.selectSingleQueryByID2("user", "selectEditUser", in_data, function(err, out_data, params) {      
      var rtnCode = CONSTS.getErrData('0000');      
            
      res.render('./management/edit_role',
        { title: global.config.productname,   mainmenu:mainmenu,   role:out_data[0]});
     });
  }
});

// role 신규 등록
router.post('/role/:id', function(req, res) {  
  console.log(req.body);
  var in_data = {    
    INDEX: indexRole,
    TYPE: "role",
    ID: "role_id",
    VALUE: req.body.roleid    };  
  queryProvider.selectSingleQueryByID2("user", "selectCheckJoin", in_data, function(err, out_data, params) {        
    if (out_data[0] != null){
      var rtnCode = CONSTS.getErrData('E005');    
      res.json({rtnCode: rtnCode});
    }  else  {
      var in_data = {         
        INDEX: indexRole,        
        ROLEID: req.body.roleid,
        NAME: req.body.rolename,        
      };        
      queryProvider.insertQueryByID("user", "insertRole", in_data, function(err, out_data) {        
        if(out_data.result == "created"){
          var in_data = {         
            INDEX: indexMenu,        
            ROLEID: req.body.roleid,            
            DASHBOARD: req.body.dashboard,
            TIMESERIES: req.body.timeseries,
            REPORT: req.body.report,
            MANAGEMENT: req.body.management,
            ANALYSIS: req.body.analysis,
            SETTING: req.body.setting
          };   
          queryProvider.insertQueryByID("user", "insertAuthMenu", in_data, function(err, out_data) {          
            
            if(out_data.result == "created"){
              var rtnCode = CONSTS.getErrData("D001");        
              console.log('auth menu : '+out_data.result);
            } else {
              var in_data = {    
                INDEX: indexRole,
                TYPE: "role",
                ID: req.body.roleid
              };  
              queryProvider.deleteQueryByID("user", "deleteById", in_data, function(err, out_data) {  
                if(out_data.result == "deleted"){
                  var rtnCode = CONSTS.getErrData("D004");                          
                }
                if(err){ console.log(err);    }
                res.json({rtnCode: rtnCode});              
              });                
            }
            if (err) { console.log(err) };                     
            res.json({rtnCode: rtnCode});
          });                                                     
        }
        if (err) { console.log(err) };                     
        res.json({rtnCode: rtnCode});
      });
    }
  });
});

// 사용자 정보 수정
router.put('/role/:id', function(req, res) {
  var in_data = {
    INDEX: indexUser,
    ID : req.body.id,
    NAME: req.body.username,  
    PASSWORD: req.body.password,
    EMAIL: req.body.email    
  };
  console.log(in_data);
  queryProvider.updateQueryByID("user", "updateUser", in_data, function(err, out_data) {    
    if(out_data.result == "updated");
        var rtnCode = CONSTS.getErrData("D002");            
    if (err) { console.log(err);   }
    res.json({rtnCode: rtnCode});
  });
});

// role 정보 삭제
router.delete('/role:id', function(req, res) {
  console.log('delete role');
  var in_data = {    
    INDEX: indexRole,
    TYPE: "role",
    ID: req.params.id  
  };  
  queryProvider.deleteQueryByID("user", "deleteById", in_data, function(err, out_data) {
    if(out_data.result == "deleted");
     var in_data = {    
        INDEX: indexMenu,
        TYPE: "menu",
        ID: req.params.id  
      };  
      queryProvider.deleteQueryByID("user", "deleteById", in_data, function(err, out_data) {
        if(out_data.result == "deleted");
            var rtnCode = CONSTS.getErrData("D003");        
        if(err){ console.log(err);    }
        res.json({rtnCode: rtnCode});
      });
        var rtnCode = CONSTS.getErrData("D003");        
    if(err){ console.log(err);    }
    res.json({rtnCode: rtnCode});
  });
});


module.exports = router;