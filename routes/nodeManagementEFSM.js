var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management:'open selected', settings:''};

router.get('/users', function(req, res, next) {
  console.log('user/restapi/selectUserList');
  var in_data = {};
  queryProvider.selectSingleQueryByID2("user", "selectUserList", in_data, function(err, out_data, params) {
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data == null) {
      rtnCode = CONSTS.getErrData('0001');
    }       
    console.log(out_data);
    var users = out_data;    
    res.render('./management/usersEFSM', { title: global.config.productname, mainmenu:mainmenu, users:users });
  });
});
  
router.get('/users/:id', function(req, res) {
  console.log(req.params.id);
  // 신규 등록
  if (req.params.id === 'addUser') {
    res.render('./management/sign_up', { title: global.config.productname, mainmenu:mainmenu });
  } else { // 기존 사용자 정보 변경
    var in_data = {
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
    USERID: req.body.userid,    
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
        NAME: req.body.username,
        USERID: req.body.userid,
        PASSWORD: req.body.password[0],
        EMAIL: req.body.email,
        ROLE: req.body.userrole,
        DATE: d[3]+'-'+mon[d[1]]+'-'+d[2]+'T'+s[0]+':'+s[1]+':'+s[2]
      };      
      queryProvider.insertQueryByID("user", "insertUser", in_data, function(err, out_data) {
        if(out_data.result == "created");
        var rtnCode = CONSTS.getErrData("D001");        
        if (err) { console.log(err);          
          rtnCode = CONSTS.getErrData(out_data);
          console.log(rtnCode);
        }
        res.json({rtnCode: rtnCode});
      });
    }
  });
});


// 사용자 정보 수정
router.put('/users/:id', function(req, res) {
  var in_data = {
    ID : req.body.id,
    USERNAME: req.body.username,
    USERID: req.body.userid,
    PASSWORD: req.body.password,
    EMAIL: req.body.email,
    USERROLE: req.body.userrole,
  };
  queryProvider.insertQueryByID("user", "insertUser", in_data, function(err, out_data) {
    if (out_data === 'D001') out_data = 'D002';
    var rtnCode = CONSTS.getErrData(out_data);
    if (err) { console.log(err);
    }
    res.json({rtnCode: rtnCode});
  });
});


// 사용자 정보 삭제
router.delete('/users/:id', function(req, res) {
  var in_data = {    
    ID: req.params.id,    
  };
  console.log(in_data);
  queryProvider.deleteQueryByID("user", "deleteUser", in_data, function(err, out_data) {
    if(out_data.result == "deleted");
        var rtnCode = CONSTS.getErrData("D003");        
    if(err){ console.log(err);    }
    res.json({rtnCode: rtnCode});
  });
});


module.exports = router;