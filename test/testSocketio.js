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

  describe("Socketio -> ", function() {
    // it('login', login());

    // config/config.json 파일을 읽어서 값을 확인
    it('connection', function(done) {
      var client1 = io.connect(socketURL, options);

      var count = 0;
      client1.on('refreshData', function(data){
        console.log(data);
        // client1.emit('connection name', chatUser1);

        // /* Since first client is connected, we connect
        // the second client. */
        // var client2 = io.connect(socketURL, options);

        // client2.on('connect', function(data){
        //   client2.emit('connection name', chatUser2);
        // });

        // client2.on('new user', function(usersName){
          data.count.should.equal(++count);
        //   client2.disconnect();
        // });
          if (data == 5)
            done();

      });

      client1.emit('join', 'HiHi');
    })

  });
});
