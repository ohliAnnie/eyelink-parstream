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

// create
router.post("/", function(req, res){     
 var in_data = {              
      USERID: req.body.userid,        
  };
  queryProvider.selectSingleQueryByID("user", "selectCheckJoin", in_data, function(err, out_data, params) {    
   var rtnCode = CONSTS.getErrData('0000');
    if (out_data[0] === null) {
      rtnCode = CONSTS.getErrData('0001');     
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
     res.render('', { error : '이미 ID로 등록된 ID입니다.'})
  }       
   res.redirect("/");  
  }); 
});

module.exports = router;
