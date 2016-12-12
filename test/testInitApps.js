var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var svr = "http://localhost:5223";
var http = require('http');
var initapps = require('../routes/initApp');
require('date-utils');

describe("Test", function(){
  var cookie;
  global._rawDataByDay = {};

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

  describe("InitApp -> ", function() {
    // it('login', login());

    // // 서버 시작시 초기 7일간의 데이터 적재 모듈 테스트
    // it('LoadData ', function(done) {
    //   var d = new Date();
    //   console.log('today : %s', Date.today());

    //   for (var i=0; i<2; i++) {
    //     console.log('day : %s', d.removeDays(1).toFormat('YYYY-MM-DD'));
    //     var vDate = d.toFormat('YYYY-MM-DD');
    //     var datas =  {LOAD_DATE : vDate};
    //     initapps(datas, function(params) {
    //       // console.log(_rawDataByDay);
    //       var sDate = params['LOAD_DATE'];
    //       console.log('testInitApps -> date : %s', sDate);
    //       console.log('testInitApps -> length : ' + _rawDataByDay[sDate].length);
    //       (_rawDataByDay[sDate].length).should.be.above(0);
    //     });
    //   }
    //   done();
    // });

    // 서버 시작시 초기 7일간의 데이터 적재 모듈 테스트
    it('LoadData ', function(done) {
      initapps.loadData(function(params) {
        var sDate = params['LOAD_DATE'];
        console.log('testInitApps -> date : %s', sDate);
        console.log('testInitApps -> length : ' + _rawDataByDay[sDate].length);
        (_rawDataByDay[sDate].length).should.be.above(0);
      });
      done();
    });
  });
});
