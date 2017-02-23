var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
require('date-utils');
var async = require("async");

describe("Simulator -> ", function() {

  it.only('Power Data : 주기성 데이터 발생 ', function(done) {
     async.waterfall([
      function(callback) {
        // FIXME callback 처리가 없어 timeout 오류 발생함.
        require('../dataSimulator/dataSimulator').process('tb_node_raw_simul.csv', false);
        callback(null);
      }], function (err, result) {
        console.log('done')
        // done();
      });

  });
  it('Power Data : 비주기 이벤트 데이터(ALS, Noise, Vibraton, GPS) 발생 ', function(done) {

    async.waterfall([
      function(callback) {
        require('../dataSimulator/dataSimulator').process('tb_node_raw_event_simul.csv', true);
        callback(null);
      }], function (err, result) {
        // done();
      });
  });
});

