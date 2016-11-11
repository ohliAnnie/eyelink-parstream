var express = require('express');
var router = express.Router();

var mainmenu = {home: 'is-selected', info: '', job: '', staff: '', consult: '', event: ''};


/* GET reports page. */
router.get('/', function(req, res, next) {
  	res.render('./dashboard/main', { title: 'EyeLink for ParStream' });
});

// send pie-chart data
router.get('/dashboard/piechart', function(req, res, next) {

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

module.exports = router;
