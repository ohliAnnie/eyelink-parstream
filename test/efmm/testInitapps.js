// logger 처리
global.log4js = require('log4js');
log4js.configure({
  'appenders':
  {
      'console' :
      {
        'type': 'console'
      },
      'file' :
      {
        'type': 'file',
        'filename': './testInitApps.log',
        'maxLogSize': 1024000,
        'backups': 5,
        'category': 'eyelink'
      }
  },
  'categories' :
  {
    'default' : { 'appenders': ['console'], 'level' : 'debug'}
  }
});
var logger = global.log4js.getLogger('testInitApps');
var async = require('async');
var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var config = require('../../config/config.json');
global.config = config;
global._rawDataByDay = {};
require('date-utils');

// config.json 파일의 내용에서 database 내용을 변경한다.
global.config.pcode = 'efmm';
global.config.fetchData.database = 'elasticsearch';
global.config.fetchData.method = 'nodelib-es';

//console.log('config : %j', global.config);

describe("InitApp", function(){
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

  describe("ElasticSearch -> ", function() {
    var initapps = require('../../routes/initApp');
    var queryParser = require('../../routes/dao//queryParser');

    it.skip('LoadQuery : 서버 시작시 Query Loading 테스트 ', function(done) {
      logger.debug('start loadQuery');
      async.waterfall([
        function(cb) {
          logger.debug('function1'); 
          initapps.loadQuery(function() { cb(); }); 
        },
        function(data, cb) {
          // TODO Test Query를 만든 후 테스트 로직 보강 필요.
          logger.debug('function2');
          logger.debug(global.query.queryList);
          var query1 = '';
          logger.debug('global.query : %s', global.query.queryList.management[0].query[0].$.id);

          (global.query.queryList.management.length).should.be.above(0);
          query1 = queryParser.getQuery('management', 'selectRuleList');
          query1.should.be.equal('{q : \'rule\'}');
          query1 = queryParser.getQuery('test', 'test02');
          query1.should.be.equal('{q : \'bbb\'}');
          cb();
        }],
        function(err) {
          if(err) logger.error(err);
          done();
        }
      );
    });

    it.skip('LoadData : 서버 시작시 초기 7일간의 데이터 메모리 적재 모듈 테스트 ', function(done) {
      _rawDataByDay = {};
      initapps.loadData(function(params) {
        var sDate = params['LOAD_DATE'];
        // console.log('testInitApps -> date : %s', sDate);
        // console.log('testInitApps -> flag : %s', params.FLAG);
        // console.log('testInitApps -> length : ' + _rawDataByDay[sDate].length);
        (_rawDataByDay[sDate].length).should.be.above(-1);
        if (params.FLAG === 'C')
          done();
      });
    });

    it('LoadManagementData : 서버 시작시 ManagementData global.management.xxx에 적재  테스트 ', function(done) {
       async.waterfall([
        function(cb) {
          initapps.loadQuery(cb); 
        },
        function(data, cb) {
          initapps.loadManagementData(function() {});
        }],
        function(err) {
          logger.debug('last');
          if(err) logger.error(err);

          
          // global.management.role.should.be.equal('{q : \'rule\'}');
          (global.management.role.length).should.be.above(0);
          done();
        }
      );
    });
  });
});
