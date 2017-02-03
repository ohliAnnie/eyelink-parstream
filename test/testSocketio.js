var should = require('should');
var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;

var io = require('socket.io-client');

var socketURL = 'http://localhost:5223';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'name':'Tom'};
var chatUser2 = {'name':'Sally'};
var chatUser3 = {'name':'Dana'};

describe("Socketio", function(){
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

  describe("refreshData -> ", function() {
    // it('login', login());

    it('전송 및 수신 테스트', function(done) {
      var client1 = io.connect(socketURL, options);

      var count = 0;
      client1.on('refreshData', function(data){
        console.log(data);
        data.count.should.equal(++count);
        // if (data == 5)
        //   done();

        client1.emit('getEventListForAlarm', 0);
      });

      client1.on('sendEventListForAlarm', function(data) {
        console.log(data);
        done();
      });
    })


  });

  describe("Python -> ", function() {

    it('TO-DO Socket Data 전송', function(done) {
      var client1 = io.connect(socketURL, options);

      var count = 0;
      client1.on('refreshData', function(data){
        console.log(data);
        data.count.should.equal(++count);
        // if (data == 5)
        //   done();

        client1.emit('getEventListForAlarm', 0);
      });

      client1.on('sendEventListForAlarm', function(data) {
        console.log(data);
        done();
      });
    })


  });
});
