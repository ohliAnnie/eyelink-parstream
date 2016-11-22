var express = require('express');
var router = express.Router();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET home page. */
router.get('/home', function(req, res, next) {
  	res.render('index', { title: 'EyeLink for ParStream' });
});

router.get('/homeB', function(req, res, next) {
  	res.render('homeB', { title: '치위생사' });
});

router.get('/homeC', function(req, res, next) {
	// 이미 로그인 여부를 세션에 user_id가 있는지로 확인
	var userInfo = req.session.userInfo;
	var user_id = userInfo.user_id;
	var data = {user_id : user_id};

  	res.render('homeC', {
  		title: '치과병원',
  		mainmenu: mainmenu,
  		rtnData: data});
});


module.exports = router;
