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

router.get('/user', function(req, res, next) {
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

// create
router.post('/sign_up', function(req, res) {
  var in_data = {              
    USERID: req.body.userid,        
  };
  queryProvider.selectSingleQueryByID("user", "selectCheckJoin", in_data, function(err, out_data, params) {           
    console.log(out_data[0][0]);
    console.log(req.body.userid);
    if (out_data[0][0] != null){
      console.log('이미 있는 아이디닷');
      var err = "이미 등록된 아이디 입니다.";      
      res.redirect("./sign_up?msg=3");
    }  else  {    
      var in_data = {              
        USERNAME: req.body.username,
        USERID: req.body.userid,        
        PASSWORD: req.body.password[0],
        EMAIL: req.body.email,  
        USERROLE: req.body.userrole,     
      };  
      queryProvider.selectSingleQueryByID("user", "insertUser", in_data, function(err, out_data, params) {            
        console.log('회원가입 축축');  
        res.redirect("./sign_up?msg=4");
      });       
    } 
  }); 
}); 

module.exports = router;