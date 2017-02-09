var CONSTS = require('./consts');
var Utils = require('./util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method + '-db').QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'', reports:'', analysis:'', management: 'open selected', settings:''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  // console.log(_rawDataByDay);
  res.render('./dashboard/main', { title: 'EyeLink for ParStream', mainmenu:mainmenu});
});

router.get('/timeseries', function(req, res, next) {
  // console.log(_rawDataByDay);
  res.render('./dashboard/timeseries', { title: 'EyeLink for ParStream', mainmenu:mainmenu });
});

router.get('/users', function(req, res, next) {
  // console.log(_rawDataByDay);
  var in_data = {};
   queryProvider.selectSingleQueryByID("user", "selectUserList", in_data, function(err, out_data, params) {
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data[0] === null) {
        rtnCode = CONSTS.getErrData('0001');
      }
      console.log(out_data[0]);
      var users = out_data[0];
      res.render('./management/user_list', { title: 'EyeLink for ParStream', mainmenu:mainmenu, users:users });
   });
});

router.get('/sign_up', function(req, res, next) {
  res.render('./management/sign_up', { title: 'EyeLink for ParStream', mainmenu:mainmenu });
});


// 한 사용자 정보 조회
router.get('/users/:id', function(req, res) {
   res.render('./management/sign_up', { title: 'EyeLink for ParStream', mainmenu:mainmenu });
});

// 사용자 정보 수정
//router.put('/edit_user/:id', function(req, res) {
router.get('/edit_user/:id', function(req, res) {
  console.log(req.params.id);
   var in_data = {
    USERID: req.params.id,
  };
  queryProvider.selectSingleQueryByID("user", "selectEditUser", in_data, function(err, out_data, params) {
    console.log('db : '+out_data[0]);
      var rtnCode = CONSTS.getErrData('0000');
      if (out_data[0] === null) {
        rtnCode = CONSTS.getErrData('0001');
      }
      console.log(out_data[0]);
      var users = out_data[0];
    res.render('./management/edit_user', { title: 'EyeLink for ParStream', mainmenu:mainmenu, users:users });
   });
});

// 사용자 정보 삭제
router.delete('/delete_user/:id', function(req, res) {
    var in_data = {
      USERID: id,
    };
    queryProvider.insertQueryByID("user", "insertDeleteUser", in_data, function(err, out_data) {
      if (err) console.log(err);
      else {
        var msg = CONSTS.getErrData(out_data);
        console.log(msg);
        res.redirect("./users?msg=" + msg.code);
      }
    });
   res.render('./management/delete_user', { title: 'EyeLink for ParStream', mainmenu:mainmenu });
});

// 사용자 신규 등록
router.post('/users', function(req, res) {
  var in_data = {
    USERID: req.body.userid,
  };
  console.log(in_data);
  queryProvider.selectSingleQueryByID("user", "selectCheckJoin", in_data, function(err, out_data, params) {
    console.log(out_data[0][0]);
    console.log(req.body.userid);
    if (out_data[0][0] != null){
      var err = CONSTS.getErrData('E005');
      console.log(err);
      res.redirect("./sign_up?msg=" + err.code);
    }  else  {
      var in_data = {
        USERNAME: req.body.username,
        USERID: req.body.userid,
        PASSWORD: req.body.password[0],
        EMAIL: req.body.email,
        USERROLE: req.body.userrole,
      };
      queryProvider.insertQueryByID("user", "insertUser", in_data, function(err, out_data) {
        if (err) console.log(err);
        else {
          var msg = CONSTS.getErrData(out_data);
          console.log(msg);
          res.redirect("./sign_up?msg=" + msg.code);
        }
      });
    }
  });
});

module.exports = router;