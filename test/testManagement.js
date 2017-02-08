var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var svr = "http://localhost:5223";
var http = require('http');
var Utils = require('../routes/util');

describe("nodeManagement", function(){
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

  describe("User 등록 -> ", function() {
    // it('login', login());

    var num = Utils.generateRandom(0, 1000);
    it('등록 성공 체크  ', function(done) {
      var datas = {
        userid: "test" + num,
        username : "Test User " + num,
        password : "test" + num,
        email : "test@m2u.com",
        userrole : "Test"
      };
      request(svr)
        .post("/management/users/" + datas.userid)
        .send(datas)
        // .expect('Content-Type', /json/)
        .expect(302, function(err, res) {
          if (err) return done(err);
          // console.log(res.header);
          res.header.location.should.be.equal('./sign_up?msg=D001');
          done();
        });
    });
    it('중복 등록 실패 체크 ', function(done) {
      var datas = {
        userid: "test" + num,
        username : "Test User " + num,
        password : "test" + num,
        email : "test@m2u.com",
        userrole : "Test"
      };
      request(svr)
        .post("/management/users/" + datas.userid)
        .send(datas)
        // .expect('Content-Type', /json/)
        .expect(302, function(err, res) {
          if (err) return done(err);
          // console.log(res.header);
          res.header.location.should.be.equal('./sign_up?msg=E005');
          done();
        });
    });
  });

  describe("사용자 조회 -> ", function() {
    // it('login', login());

    // 성공 건수 조회
    it('전체 리스트 조회', function(done) {
      var datas = {};
      request(svr)
        .get("/management/users")
        .send(datas)
        .expect('Content-Type', "text/html; charset=utf-8")
        .expect(200, function(err, res) {
          if (err) return done(err);
          // console.log(res.text);
          done();
        });
    });
  });
});
