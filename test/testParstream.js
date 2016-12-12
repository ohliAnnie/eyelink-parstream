var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
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
    it('Search Data Dashboard ', function(done) {
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
  });
});
