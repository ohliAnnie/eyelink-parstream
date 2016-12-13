var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
// var app = require("../app.js");
var svr = "http://localhost:5223";
var http = require('http');

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

  describe("Dashboard -> ", function() {
    // it('login', login());

    // 성공 건수 조회
    it('Search get_successcount', function(done) {
      var datas = {user_id: "user_id"};
      request(svr)
        .get("/dashboard/restapi/get_successcount")
        .send(datas)
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          // console.log(res.body.rtnCode.code);
          res.body.rtnCode.code.should.be.equal('0000');
          done();
        });
    });

    // Dashboard 내 전력양, 금액, 이벤트 발생건수, 오류 발생건수, 전일 대비 값 조회
    it('Search Dashboard Section1', function(done) {
      var datas = {user_id: "user_id"};
      request(svr)
        .get("/dashboard/restapi/getDashboardSection1")
        .send(datas)
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          // console.log(res.body);
          // console.log(res.body.rtnCode.code);
          res.body.rtnCode.code.should.be.equal('0000');
          console.log('testDashboard -> rtnData : ', res.body.rtnData);
          (res.body.rtnData[0].today_event_cnt).should.be.above(0);
          done();
        });
    });

    // Raw Data 조회
    it('Search Data RawData for DC Chart ', function(done) {
      var datas = {user_id: "user_id"};
      request(svr)
        .get("/dashboard/restapi/getReportRawData")
        .send(datas)
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          // console.log(res.body);
          console.log('testDashboard -> rtnData length : %s', res.body.rtnData.length);
          res.body.rtnCode.code.should.be.equal('0000');
          done();
        });
    });
  });


  function login() {
    return function(done) {
      var data = {
        user_id: user_id,
        password : password,
        mem_type : mem_type
      };
      request(svr)
        .post("/member/login")
        .send(data)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.code.should.be.equal('0000');
          cookie = res.headers['set-cookie'];
          done();
        });
    }
  }
});
