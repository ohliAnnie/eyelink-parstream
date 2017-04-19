var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
// var app = require("../app.js");
// var svr = "http://localhost:5223";
var http = require('http');
require('date-utils');
var CONSTS = require('../routes/consts');
var async = require('async')
var sleep = require('sleep');

describe("Loop Sync Test", function(){
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

  // ref : http://forum.falinux.com/zbxe/index.php?document_srl=862481&mid=lecture_tip
  describe("For -> ", function() {

    it('Loop, no callback ', function(done) {
      for (var i = 0; i < 3; i++) {
        console.log(i)
      }
      console.log('Loop, no callback ended!!!')
      done();

    });

    it('Loop + callback ', function(done) {
      for (var i = 0; i < 3; i++) {
        reserve(function() {
          console.log(i);
        });
      }
      console.log('Loop + callback ended!!!')
      done();
    });

    it('Loop + callback with IIFE ', function(done) {
      for (var i = 0; i < 3; i++) {
        reserve(function() {
          console.log(i);
        });
      }
      console.log('Loop + callback with IIFE ended!!!')
      done();
    });

    it('Loop + callback, local variable', function(done) {
      for (var i = 0; i < 3; i++) {
        makeReserve(i);
      }
      console.log('Loop + callback, local variable ended!!!')
      done();
    });

    it('process.nextTick', function(done) {
      function foo() {
        console.log('foo');
      }
      foo();
      process.nextTick(foo);
      console.log('bar');
      console.log('bar');

      setTimeout(foo, 0);
      console.log('bar2');

      done();
    });
  });
});


var reserve = function(cb) {
  process.nextTick(function() {
    cb();
  });
}

var makeReserve = function(index) {
  reserve(function() {
    console.log(index);
  });
}


describe("ASync Module Test", function(){
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

  // ref : http://forum.falinux.com/zbxe/index.php?document_srl=862481&mid=lecture_tip
  describe("async function -> ", function() {

    it('waterfall ', function(done) {
      async.waterfall([
        function(callback){
          console.log('first');
          callback(null, '하나', '둘');
        },
        function(arg1, arg2, callback){
          // arg1는 '하나'고, arg2는 '둘'이다.
          console.log('second : %s, %s', arg1, arg2);
          callback(null, '셋');
        },
        function(arg1, callback){
          // arg1은 '셋'이다.
          console.log('third : %s', arg1);
          callback(null, '끝');
        }
      ], function (err, result) {
          console.log('last : err - %s, result - %s', err, result);
         // result에는 '끝'이 담겨 온다.
      });
      done();

    });
  });

  describe("async + loop -> ", function() {

    it('for loop + waterfall ', function(done) {
      for (var i=0; i<3; i++) {
        async.waterfall([
          function(callback){
            console.log('first');
            callback(null, '하나', '둘');
          },
          function(arg1, arg2, callback){
            // arg1는 '하나'고, arg2는 '둘'이다.
            console.log('second : %s, %s', arg1, arg2);
            function aaa (callback) {
              callback(null, '셋-2');
            };
            callback(null, '셋');
          },
          function(arg1, callback){
            // arg1은 '셋'이다.
            console.log('third : %s', arg1);
            callback(null, '끝');
          }
        ], function (err, result) {
            console.log('last : err - %s, result - %s', err, result);
           // result에는 '끝'이 담겨 온다.
        });
      }
      done();

    });

    it('for loop + waterfall + sleep', function(done) {
      for (var i=0; i<2; i++) {
        var d = new Date();
        console.log('time : %s', d.toFormat('YYYY-MM-DD HH24:MI:SS'))
        async.waterfall([
          function(callback){
            console.log('first : %d', i);
            callback(null, '하나', '둘');
          },
          function(arg1, arg2, callback){
            // arg1는 '하나'고, arg2는 '둘'이다.
            console.log('second : %s, %s', arg1, arg2);
            callback(null, '셋');
          },
          function(arg1, callback){
            // arg1은 '셋'이다.
            console.log('third : %s', arg1);
            callback(null, '끝');
          }
        ], function (err, result) {
            console.log('last : err - %s, result - %s', err, result);
           // result에는 '끝'이 담겨 온다.
           sleep.sleep(1)
        });

      }
      done();

    });
  });
});