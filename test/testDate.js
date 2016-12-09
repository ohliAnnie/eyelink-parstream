var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
// var app = require("../app.js");
// var svr = "http://localhost:5223";
var http = require('http');
require('date-utils');
var CONSTS = require('../routes/consts');

describe("Test", function(){
  var cookie;

  before(function() {

  });

  after(function() {

  });

  beforeEach(function(){

    // simulate async call w/ setTimeout
    // setTimeout(function(){
    //   foo = true;
    // }, 50);

  });

  afterEach(function() {

  });

  describe("Util -> ", function() {
    // it('login', login());

    it('Date Function', function(done) {
      console.log(Date.today());
      console.log(Date.UTCtoday());

      var d = new Date();
      console.log('----- date-utils');
      console.log('today : %s', Date.today());
      console.log('UTCtoday : %s', Date.UTCtoday());
      console.log('yesterday : %s', Date.yesterday());
      console.log('UTCyesterday : %s', Date.UTCyesterday());
      console.log('tomorrow : %s', Date.tomorrow());
      console.log('UTCtomorrow : %s', Date.UTCtomorrow());
      console.log('UTC : %s', Date.UTC());
      console.log('getDateFromFormat : %s', d.toFormat('2016-12-06', 'yyyy-mm-dd'));

      expect('2016-12-06').to.equal(d.toFormat('2016-12-06', 'YYYY-MM-DD'));
      expect('Jan').to.equal(d.addMonths(1).toFormat('MMM'));
      expect('02').to.equal(d.addMonths(1).toFormat('MM'));
      console.log('today : %s', Date.today());

      d = new Date();
      console.log('toYMD : %s', d.toYMD());
      console.log('today : %s', d.toFormat('YYYY-MM-DD HH:MI:SS'));
      // expect('08').to.equal(d.addDays(1).toFormat('DD'));
      // expect('09').to.equal(d.addDays(1).toFormat('DD'));
      // expect('08').to.equal(d.removeDays(1).toFormat('DD'));
      // expect('07').to.equal(d.removeDays(1).toFormat('DD'));

      // ref : http://www.w3schools.com/jsref/jsref_obj_date.asp
      console.log('----- Javascript Date');
      console.log('now : %s', Date.now());
      console.log('getFullYear : %s', d.getFullYear());
      console.log('getMonth(0-11) : %s', d.getMonth()+1);
      console.log('getDate(1-31) : ' + d.getDate());
      console.log('getHours(0-23) : ' + d.getHours());
      console.log('getMinutes(0-59) : ' + d.getMinutes());
      console.log('getDay(0-6, Sun-Mon) : %s', d.getDay());
      console.log('getMilliseconds : %s', d.getMilliseconds());
      console.log('toDateString : %s', d.toDateString());
      console.log('toGMTString : %s', d.toGMTString());
      console.log('toJSON : %s', d.toJSON());
      console.log('toUTCString : %s', d.toUTCString());
      console.log('toLocaleDateString : %s', d.toLocaleDateString());
      console.log('getTimezoneOffset : %s', d.getTimezoneOffset());
      console.log('parse : %s', Date.parse('2016-12-07'));

      done();

    })


    it('Calc -5 Day', function(done) {
      console.log("CONFIG.ROADING_DAY : %s ", CONSTS.CONFIG.ROADING_DAY);
      var d = new Date();
      console.log('today : %s', Date.today());
      console.log('hours : %s', d.removeHours(1).toFormat('YYYYMMDDTHH'));
      for (var i=0; i<CONSTS.CONFIG.ROADING_DAY; i++) {
        console.log('day : %s', d.removeDays(1).toFormat('YYYYMMDD'));

      }
      done();

    })
  });
});
