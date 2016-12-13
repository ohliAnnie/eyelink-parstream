var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
// var app = require("../app.js");
// var svr = "http://localhost:5223";
var http = require('http');
require('date-utils');
var CONSTS = require('../routes/consts');
var Utils = require('../routes/util');

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

  describe("Util -> ", function() {
    // it('login', login());

    it('replace SQL Paramter', function(done) {
      var sql = "SELECT * FROM A WHERE DATE >= #DATE# AND ID = #ID# AND NUM = #NUM#";
      console.log("sql : %s ", sql);

      var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};

      sql = Utils.replaceSql(sql, params)
      console.log(sql);
      sql.should.be.equal("SELECT * FROM A WHERE DATE >= '2016-12-12' AND ID = 'AAAA' AND NUM = 5");
      done();
    })

    it('merge Data', function(done) {
      global._rawDataByDay = {
        '2016-12-11' : [{event_type:1, als_level:2}, {event_type:12, als_level:2}],
        '2016-12-10' : [{event_type:12, als_level:2}]};
      var out_data = [[]];
      out_data[0] = null;
      console.log('typeof array is not undefined : %s', (typeof out_data[0] !== 'undefined'));
      console.log('array is null: %s', (out_data[0] === null));
      out_data = Utils.mergeLoadedData(out_data);
      console.log(out_data);
      out_data[0].length.should.be.equal(3);
      out_data = [[{event_type:21, als_level:2},{event_type:22, als_level:2},{event_type:23, als_level:2}]];
      console.log(out_data);
      Utils.mergeLoadedData(out_data);
      console.log(out_data[0]);
      out_data[0].length.should.be.equal(6);
      done();
    })
  });
});
