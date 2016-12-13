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

  describe("Reports -> ", function() {
    // it('login', login());

    // Raw Data 조회
    it('Search Data RawData for DC Chart ', function(done) {
      var datas = {user_id: "user_id"};
      request(svr)
        .get("/reports/restapi/getReportRawData")
        .send(datas)
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          // console.log(res.body);
          console.log('testReports -> rtnData length : %s', res.body.rtnData.length);
          res.body.rtnCode.code.should.be.equal('0000');
          done();
        });
    });
  });
});
