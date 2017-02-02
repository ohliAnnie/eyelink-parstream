var CONSTS = require('./consts');
var express = require('express');
var router = express.Router();
var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method + '-db').QueryProvider;

var queryProvider = new QueryProvider();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('login');
  // res.redirect('/dashboard/');
  res.render('./login/login', { title: 'EyeLink for ParStream' });
});

// login
router.get('/login', function(req, res, next) {    

   var in_data = {              
      USERID: req.query.userid,                    
   };
  console.log('login');  
   queryProvider.selectSingleQueryByID("user", "selectLogin", in_data, function(err, out_data, params) {
    console.log(out_data);
    var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');
      console.log('등록된 정보가 없어용')
      res.render('/', { title: 'EyeLink for ParStream' });      
    } else {
      var in_data = {              
        USERID: req.query.userid,                    
        REGDATE: out_data[0][0].reg_date
      };
      console.log(in_data);
      queryProvider.selectSingleQueryByID("user", "selectPassword", in_data, function(err, out_data, params) {
        console.log(out_data);
        console.log('password : ' + out_data[0][0].user_pw);
        if(req.query.password === out_data[0][0].user_pw) {
          console.log('로그인 축축');
          res.redirect('/dashboard/');
        } else {
          console.log('비밀번호 틀렸돵');
          res.redirect('/');
        }
      });
    } 
  });  
});

// create
router.post("/", function(req, res){     
 var in_data = {              
      USERID: req.body.userid,        
  };
  queryProvider.selectSingleQueryByID("user", "selectCheckJoin", in_data, function(err, out_data, params) {       
    if (out_data[0] === null) {
      console.log(req.body);
       var in_data = {              
            USERNAME: req.body.username,
            USERID: req.body.userid,        
            PASSWORD: req.body.password[0],
            EMAIL: req.body.email,  
            USERROLE: req.body.userrole,     
        };
    console.log(in_data);
      queryProvider.selectSingleQueryByID("user", "insertUser", in_data, function(err, out_data, params) {    
        res.redirect("/");
      });
    } else {
      console.log('이미 있는 아이디닷');
       res.render("/", { error : '이미 ID로 등록된 ID입니다.'})
    }       
   res.redirect("/");  
  }); 
});

module.exports = router;
