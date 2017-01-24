var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var svr = "http://localhost:5223";
var http = require('http');
// var smodule = require("../routes/nodeDashboard")

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

    it('Test Simple Query using http', function(done) {
      var datas = {user_id: "user_id"};
      request(svr)
        .get("/dashboard/restapi/get_successcount")
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          // console.log(res.body.rtnCode.code);
          res.body.rtnCode.code.should.be.equal('0000');
          done();
        });
    });

    // it('Test Simple Query using require', function(done) {
    //   var datas = {user_id: "user_id"};
    //   request(svr)
    //     .get("/dashboard/restapi/get_successcount")
    //     .send(datas)
    //     .expect('Content-Type', /json/)
    //     .expect(200, function(err, res) {
    //       if (err) return done(err);
    //       // console.log(res.body.rtnCode.code);
    //       res.body.rtnCode.code.should.be.equal('0000');
    //       done();
    //     });
    // });

    it('Test query params for "in" in query ', function(done) {
      var datas = {nodeid: ["0002.00000023", "0001.00000019"]};
      request(svr)
        .get("/dashboard/restapi/get_query_param")
        .query(datas)
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
