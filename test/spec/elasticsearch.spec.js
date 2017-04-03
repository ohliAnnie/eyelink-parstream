var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var QueryProvider = require('../../routes/dao/elasticsearch/nodelib-es').QueryProvider;
var queryProvider = new QueryProvider();

describe('ElasticSearch', function () {
  before(function () {
    // sinon.stub(models.User, 'findOne').returns({
    //   then: function (fn) {
    //     fn({name: 'Chris'});
    //   }
    // });
  });

  it('서버 ping 테스트 : 성공', function (done) {
    queryProvider.ping(function(isAlive) {
      isAlive.should.be.equal(true);
      done();
    })

  });

  it('Query 수행 테스트 : 성공', function (done) {
    queryProvider.selectSingleQueryByID('test', '', '', function(err, datas) {
      console.log(err);
      console.log(datas);
      // isAlive.should.be.equal(true);
      done();
    })

  });

  it('index, type, body 일치 Query 수행 테스트 : 성공', function (done) {
    queryProvider.selectSingleQueryByID2('test', '', '', function(err, datas) {
      console.log(err);
      console.log(datas);
      // isAlive.should.be.equal(true);
      done();
    })

  });

  // it('should return the statusCode 200', function () {
  //   req.params.name = 'Chris';
  //   users.show(req, res);
  //   res.statusCode.should.be.equal(200);
  // });

  // it('should return the statusCode 400 if no name', function () {
  //   delete req.params.name;
  //   users.show(req, res);
  //   res.statusCode.should.be.equal(400);
  // });

  // it('should return a user', function () {
  //   req.params.name = 'Chris';
  //   users.show(req, res);
  //   JSON.parse(res._getData()).should.be.instanceOf(Object).and.have.a.property('name');
  // });
});
