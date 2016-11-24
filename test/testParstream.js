var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var app = require("../app.js");
var svr = "http://localhost:5223";

describe("Test", function(){
  var cookie;

  before(function() {

  });

  after(function() {

  });

  beforeEach(function(){

    // simulate async call w/ setTimeout
    setTimeout(function(){
      foo = true;
    }, 50);

  });

  afterEach(function() {

  });

  describe("ParStream -> ", function() {
    // it('login', login());

    it('Search Data', function(done) {
      var datas = {user_id: "user_id"};
      request(svr)
        .get("/dashboard/restapi/get_successcount")
        .send(datas)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          console.log(res.body.rtnCode.code);
          console.log(res.body.rtnCode.message);
          expect('0000').to.equal(res.body.rtnCode.code);
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
