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

describe("Util.js", function(){
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

  describe.only("SQL Query -> ", function() {
    // it('login', login());

    it('Parstream Query내 파라메타 변환 처리(replaceSql)', function(done) {
      var sql = "SELECT * FROM A WHERE DATE >= #DATE# AND ID = #ID# AND NUM = #NUM#";
      // console.log("sql : %s ", sql);

      var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};

      sql = Utils.replaceSql(sql, params)
      // console.log(sql);
      sql.should.be.equal("SELECT * FROM A WHERE DATE >= '2016-12-12' AND ID = 'AAAA' AND NUM = 5");
      done();
    })

    it('Parstream Query내 "in" 구문 배 파라메타 변환 처리(replaceSql)', function(done) {
      var sql = "SELECT * FROM A WHERE node_id in (##node_id##)";
      // console.log("sql : %s ", sql);

      var params = {node_id : ['AAAA', 'BBBB', 'CCCCC'],
            node_type : [10, 20],
            node_name : "aaa",
            node_name2 : 10};

      // console.log(params.node_id.length);
      sql = Utils.replaceSql(sql, params)
      // console.log(sql);
      sql.should.be.equal("SELECT * FROM A WHERE node_id in ('AAAA','BBBB','CCCCC')");
      done();
    })

    it('ES Query내 파라메타 변환 처리(replaceSql2)', function(done) {
      var sql = '{ "index" : "corecode-2017-05", "type" : "corecode", "body" : {  "size" : 9999, '
                      + ' "sort" : { "event_time" : { "order" : "asc" }},'
                      + ' "_source" : ["node_id", "event_time", "ampere", "voltage", "active_power", "power_factor", "event_type"],'
                      + ' "query" : { "bool" : { "must" : [  { "match_all": {} }  ], '
                      + ' "filter" : [ { "term" : { "event_type": "1" } }, { "terms" : { "node_id": [##NODE##] } }, '
                        + ' {"range" : { "event_time" : { "gte" : #START#,      "lt" :  #END# } } } ] } } } }';
      // console.log("sql : %s ", sql);

      var params = {
              START : "2016-12-29T16:15:41.000Z",
              END: "2016-12-30T16:15:41.000Z",
              NODE: ["0001.00000013", "0002.0000002E", "0001.00000011", "0002.0000003F"]
          };

      sql = Utils.replaceSql2(sql, params)
      console.log(sql);
      sql.should.be.equal('{ "index" : "corecode-2017-05", "type" : "corecode", "body" : {  "size" : 9999, '
                      + ' "sort" : { "event_time" : { "order" : "asc" }},'
                      + ' "_source" : ["node_id", "event_time", "ampere", "voltage", "active_power", "power_factor", "event_type"],'
                      + ' "query" : { "bool" : { "must" : [  { "match_all": {} }  ], '
                      + ' "filter" : [ { "term" : { "event_type": "1" } }, { "terms" : { "node_id": ["0001.00000013","0002.0000002E","0001.00000011","0002.0000003F"] } }, '
                        + ' {"range" : { "event_time" : { "gte" : "2016-12-29T16:15:41.000Z",      "lt" :  "2016-12-30T16:15:41.000Z" } } } ] } } } }');
      done();
    })

    it('ES Query내 MultiIndex 파라메타 변환 처리(replaceSql3)', function(done) {
      var sql = ''
      +'{'
      +' "index" : [##index##],'
      +' "type"  : "access",'
      +' "body" : {'
      +'   "size" : 0,'
      +'   "aggs" : {'
      +'     "group_by_x" : {'
      +'       "range": {'
      +'         "field": "@timestamp",'
      +'         "ranges":  [#range#],'
      +'          "keyed" : true'
      +'        },'
      +'        "aggs": {'
      +'          "by_type" : {'
      +'            "range": {'
      +'              "field": "responsetime",'
      +'              "ranges" : ['
      +'                { "key" : "s1", "to" : "1000" },'
      +'                { "key" : "s3", "from" : "1000", "to" : "3000" },'
      +'                { "key" : "s5", "from" : "3000", "to" : "5000" },'
      +'                { "key" : "slow", "from" : "5000" }'
      +'              ],'
      +'              "keyed" : true'
      +'            },'
      +'            "aggs" : {'
      +'              "by_response" : {'
      +'                "range" : {'
      +'                  "field": "response",'
      +'                  "ranges" : [{ "key" : "cnt", "to" : 400 }]'
      +'                }'
      +'              }'
      +'            }'
      +'          },'
      +'          "aggs" : {'
      +'            "range" : {'
      +'              "field": "response",'
      +'              "ranges" : [{ "key" : "error", "from" : 400 }]'
      +'            }'
      +'          }'
      +'        }'
      +'      }'
      +'    }'
      +'  }'
      +'}';
      // console.log("sql : %s ", sql);

      var params = {
              index : '{"filebeat_jira_access-2017-06-*", "filebeat_jira_access-2017-07-*"}',
              range: '{"key" : "2017-07-12", "from" : "2017-07-12T00:00:00.000Z", "to" : "2017-07-13T00:00:00.000Z" },{"key" : "2017-07-13", "from" : "2017-07-13T00:00:00.000Z", "to" : "2017-07-14T00:00:00.000Z" },{"key" : "2017-07-14", "from" : "2017-07-14T00:00:00.000Z", "to" : "2017-07-15T00:00:00.000Z" },{"key" : "2017-07-15", "from" : "2017-07-15T00:00:00.000Z", "to" : "2017-07-16T00:00:00.000Z" },{"key" : "2017-07-16", "from" : "2017-07-16T00:00:00.000Z", "to" : "2017-07-17T00:00:00.000Z" },{"key" : "2017-07-17", "from" : "2017-07-17T00:00:00.000Z", "to" : "2017-07-18T00:00:00.000Z" },{"key" : "2017-07-18", "from" : "2017-07-18T00:00:00.000Z", "to" : "2017-07-19T00:00:00.000Z" }'
          };

      sql = Utils.replaceSql3(sql, params)
      // console.log(sql);
      sql.should.be.equal('{'
      +' "index" : [##index##],'
      +' "type"  : "access",'
      +' "body" : {'
      +'   "size" : 0,'
      +'   "aggs" : {'
      +'     "group_by_x" : {'
      +'       "range": {'
      +'         "field": "@timestamp",'
      +'         "ranges":  [#range#],'
      +'          "keyed" : true'
      +'        },'
      +'        "aggs": {'
      +'          "by_type" : {'
      +'            "range": {'
      +'              "field": "responsetime",'
      +'              "ranges" : ['
      +'                { "key" : "s1", "to" : "1000" },'
      +'                { "key" : "s3", "from" : "1000", "to" : "3000" },'
      +'                { "key" : "s5", "from" : "3000", "to" : "5000" },'
      +'                { "key" : "slow", "from" : "5000" }'
      +'              ],'
      +'              "keyed" : true'
      +'            },'
      +'            "aggs" : {'
      +'              "by_response" : {'
      +'                "range" : {'
      +'                  "field": "response",'
      +'                  "ranges" : [{ "key" : "cnt", "to" : 400 }]'
      +'                }'
      +'              }'
      +'            }'
      +'          },'
      +'          "aggs" : {'
      +'            "range" : {'
      +'              "field": "response",'
      +'              "ranges" : [{ "key" : "error", "from" : 400 }]'
      +'            }'
      +'          }'
      +'        }'
      +'      }'
      +'    }'
      +'  }'
      +'}'
        );
      done();
    })

  });


  describe("Merge Data -> ", function() {
    // it('login', login());

    it('2 Data가 존재하는 경우', function(done) {
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
    it('Query로 조회한 데이터가 존재하지 않는 경우', function(done) {
      global._rawDataByDay = {
        '2016-12-11' : [{event_type:1, als_level:2}, {event_type:12, als_level:2}],
        '2016-12-10' : [{event_type:12, als_level:2}]};
      var out_data = [undefined];
      // out_data[0] = null;
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

  describe("Random -> ", function() {
    // it('login', login());

    it('난수 발생', function(done) {
      var num = Utils.generateRandom(0, 100);
      console.log(num);
      should.exist(num);
      done();
    })

    it('Hex to Binary', function(done) {
      var num = hex2bin('1000');
      console.log(num);
      should.exist(num);
      done();
    })

    it('Hex to Binary2', function(done) {
      var num = 'b637eb9146e84cb79f6d981ac9463de1'.hex2bin();
      console.log(num);
      console.log(num.bin2hex());
      should.exist(num);
      done();
    })
  });
});


function hex2bin(hex)
{
    var bytes = [], str;
    for(var i=0; i< hex.length-1; i+=2)
        bytes.push(parseInt(hex.substr(i, 2), 16));
    return String.fromCharCode.apply(String, bytes);
}

String.prototype.hex2bin = function ()
{
  var i = 0, l = this.length - 1, bytes = []

  for (i; i < l; i += 2)
  {
    bytes.push(parseInt(this.substr(i, 2), 16))
  }

  return String.fromCharCode.apply(String, bytes)

}

String.prototype.bin2hex = function ()
{

  var i = 0, l = this.length, chr, hex = ''

  for (i; i < l; ++i)
  {

    chr = this.charCodeAt(i).toString(16)

    hex += chr.length < 2 ? '0' + chr : chr

  }

  return hex

}

// alert('b637eb9146e84cb79f6d981ac9463de1'.hex2bin().bin2hex())

