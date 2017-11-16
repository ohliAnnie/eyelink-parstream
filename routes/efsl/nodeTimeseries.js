var logger = global.log4js.getLogger('nodeTimeseries');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'open selected', reports:'', analysis:'', management:'', settings:''};

router.get('/timeseries', function(req, res, next) {
  // console.log(_rawDataByDay);
  res.render('./'+global.config.pcode+'/timeseries/timeseries', { title: global.config.productname, mainmenu:mainmenu });
});

module.exports = router;