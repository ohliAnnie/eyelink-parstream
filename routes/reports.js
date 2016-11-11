var express = require('express');
var router = express.Router();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  console.log('haha');
  	res.render('./reports/main', { title: 'EyeLink for ParStream' });
});

// send pie-chart data
router.get('/reports/piechart', function(req, res, next) {

  // For Test Data
    var data = [
       {
          "vender": "bada",
          "volume": 20
        },
       {
          "vender": "BlackBerry",
          "volume": 30
       },
       {
          "vender": "WebOS",
          "volume": 35
       },
       {
          "vender": "iOS",
          "volume": 190
       },
  ];

  	res.send(data);
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
