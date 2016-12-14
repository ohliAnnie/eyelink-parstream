var should = require('should');
var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var config = require('../config/config.json');

var fs = require('fs');

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

  describe("Config -> ", function() {
    // it('login', login());

    // config/config.json 파일을 읽어서 값을 확인
    it('check validation', function(done) {

      console.log('config : %j', config);

      config.productname.should.be.equal("EyeLink for ParStream");
      config.loaddataonstartup.active.should.be.equal(true);
      // config.queryposition.should.be.equal(0);
      done();
    })

    // write config.queryposition config/config.json
    it('check validation', function(done) {
      config.queryposition = 100;
      config = JSON.stringify(config,null,'\t');
      fs.writeFileSync('./config/config.json', config,function(err) {
        if(err) return console.error(err);
        cconsole.log('config : %j', config);
        config.queryposition.should.be.equal(100);
      })
      done();
    })
  });
});
