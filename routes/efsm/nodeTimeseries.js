var Logger = require('../log4js-utils').Logger;
var logger = new Logger('nodeTimeseriesEFSM');
var CONSTS = require('../consts');
var Utils = require('../util');
var express = require('express');
require('date-utils');
var router = express.Router();

var QueryProvider = require('../dao/' + global.config.fetchData.database + '/'+ config.fetchData.method).QueryProvider;
var queryProvider = new QueryProvider();

var mainmenu = {dashboard:'', timeseries:'open selected', reports:'', analysis:'', management:'', settings:''};
