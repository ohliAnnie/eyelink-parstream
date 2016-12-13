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
    // 서버 시작시 초기 7일간의 데이터 적재 모듈 테스트
    it('LoadData ', function(done) {
      initapps.loadData(function(params) {
        var sDate = params['LOAD_DATE'];
        console.log('testInitApps -> date : %s', sDate);
        console.log('testInitApps -> flag : %s', params.FLAG);
        console.log('testInitApps -> length : ' + _rawDataByDay[sDate].length);
        (_rawDataByDay[sDate].length).should.be.above(0);
        if (params.FLAG === 'C')
          done();
      });
    });
  });
});
