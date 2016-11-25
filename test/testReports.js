var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var app = require("../app.js");
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

  describe("ParStream -> ", function() {
    // it('login', login());

    // TO-DO 수행 결과 로깅 처리 로직 보완 필요함. by 배성한.
    it('Search Data Report ', function(done) {
      var datas = {user_id: "user_id"};
      request(svr)
        .get("/reports/restapi/getReportRawData")
        .send(datas)
        .expect(200)
        .end(function(res) {
          // console.log(err);
          // if (err) return done(err);
          console.log(res);
          // console.log(res.body.rtnCode.code);
          // console.log(res.body.rtnCode.message);
          // expect('0000').to.equal(res.body.rtnCode.code);

      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
        console.log('data');
      });

      res.on('end', function() {
        console.log('end');
        callback(null, JSON.parse(data));
      });

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
