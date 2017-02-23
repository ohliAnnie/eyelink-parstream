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


// ref : http://chanlee.github.io/2013/12/10/understand-javascript-closure/
describe("Closure -> ", function() {

  it('Sample 1 : 내부 함수는 외부함수의 변수뿐만 아니라 파라미터 까지 사용', function(done) {
    function showName(firstName, lastName) {
        var nameIntro = "Your name is ";
        // 이 내부 함수는 외부함수의 변수뿐만 아니라 파라미터 까지 사용할 수 있습니다.
        function makeFullName() {
            return nameIntro + firstName + " " + lastName;
        }
        return makeFullName();
    }
    console.log(showName("Michael", "Jackson")); // Your name is Michael Jackson
    done();

  });

  it('Sample 2 : 클로저는 외부함수가 리턴된 이후에도 외부함수의 변수에 접근할수 있음', function(done) {
    function celebrityName(firstName) {
        var nameIntro = "This is celebrity is ";
        // 이 내부 함수는 외부함수의 변수와 파라미터에 접근할 수 있습니다.
        function lastName(theLastName) {
            return nameIntro + firstName + " " + theLastName;
        }
        return lastName;
    }
    var mjName = celebrityName("Michael"); // 여기서 celebrityName 외부함수가 리턴됩니다.
    console.log(mjName);
    // 외부함수가 위에서 리턴된 후에, 클로저(lastName)가 호출됩니다.
    // 아직, 클로저는 외부함수의 변수와 파라미터에 접근 가능합니다.
    var nm = mjName("Jackson"); // This celebrity is Michael Jackson
    console.log(nm);
    done();

  });

  it('Sample 3 : 클로저는 외부 함수의 변수에 대한 참조를 저장', function(done) {
    function celebrityID() {
        var celebrityID = 999;
        // 우리는 몇개의 내부 함수를 가진 객체를 리턴할것입니다.
        // 모든 내부함수는 외부변수에 접근할 수 있습니다.
        return {
            getID: function() {
                // 이 내부함수는 갱신된 celebrityID변수를 리턴합니다.
                // 이것은 changeThdID함수가 값을 변경한 이후에도 celebrityID의 현재값을 리턴합니다.
                return celebrityID;
            },
            setID: function(theNewID) {
                // 이 내부함수는 외부함수의 값을 언제든지 변경할 것입니다.
                celebrityID = theNewID;
            }
        }
    }
    var mjID = celebrityID(); // 이 시점에, celebrityID외부 함수가 리턴됩니다.
    console.log(mjID.getID()); // 999
    mjID.setID(567); // 외부함수의 변수를 변경합니다.
    console.log(mjID.getID()); // 567; 변경된 celebrityID변수를 리턴합니다.
    done();

  });
});

describe("Closure 비꼬기 -> ", function() {

  it('Sample 1 : 내부 함수는 외부함수의 변수뿐만 아니라 파라미터 까지 사용으로 인한 비정상처리', function(done) {
    function celebrityIDCreator(theCelebrities) {
        var i;
        var uniqueID = 100;
        for (i=0; i<theCelebrities.length; i++) {
            theCelebrities[i]["id"] = function() {
                console.log('closure : ' + i)
                return uniqueID + i;
            }
        }
        return theCelebrities;
    }
    var actionCelebs = [{name:"Stallone", id:0}, {name:"Cruise", id:0}, {name:"Willis", id:0}];
    var createIdForActionCelebs = celebrityIDCreator(actionCelebs);
    var stalloneID = createIdForActionCelebs[0];
    console.log(stalloneID.id); // 103
    done();

  });

  it('Sample 2 : 즉시 호출된 함수 표현식(Immediately Invoked Function Expression. IIFE) 사용', function(done) {
     function celebrityIDCreator(theCelebrities) {
        var i;
        var uniqueID = 100;
        for (i=0; i<theCelebrities.length; i++) {
            theCelebrities[i]["id"] = function(j) {
                // j 파라미터는 호출시 즉시 넘겨받은(IIFE) i의 값이 됩니다.
                return function() {
                    // for문이 순환할때마다 현재 i의 값을 넘겨주고, 배열에 저장합니다.
                    return uniqueID + j;
                } () // 함수의 마지막에 ()를 추가함으로써 함수를 리턴하는 대신 함수를 즉시 실행하고 그 결과값을 리턴합니다.
            } (i); // i 변수를 파라미터로 즉시 함수를 호출합니다.
        }
        return theCelebrities;
    }
    var actionCelebs = [{name:"Stallone", id:0}, {name:"Cruise", id:0}, {name:"Willis", id:0}];
    var createIdForActionCelebs = celebrityIDCreator(actionCelebs);
    var stalloneID = createIdForActionCelebs[0];
    console.log(stalloneID.id); // 100
    var cruiseID = createIdForActionCelebs[1];
    console.log(cruiseID.id); // 101
    done();

  });

});

// ref : http://benalman.com/news/2010/11/immediately-invoked-function-expression/
describe("IIFE -> ", function() {

  it('Sample 1 : ', function(done) {
    // Because this function returns another function that has access to the
    // "private" var i, the returned function is, effectively, "privileged."

    function makeCounter() {
      // `i` is only accessible inside `makeCounter`.
      var i = 0;

      return function() {
        console.log('i is '+ ++i );
      };
    }

    // Note that `counter` and `counter2` each have their own scoped `i`.

    var counter = makeCounter();
    counter(); // logs: 1
    counter(); // logs: 2

    var counter2 = makeCounter();
    counter2(); // logs: 1
    counter2(); // logs: 2

    // i; // ReferenceError: i is not defined (it only exists inside makeCounter)
    done();

  });


  it('Sample 2 : ', function(done) {

    // Create an anonymous function expression that gets invoked immediately,
    // and assign its *return value* to a variable. This approach "cuts out the
    // middleman" of the named `makeWhatever` function reference.
    //
    // As explained in the above "important note," even though parens are not
    // required around this function expression, they should still be used as a
    // matter of convention to help clarify that the variable is being set to
    // the function's *result* and not the function itself.

    var counter = (function(){
      var i = 0;

      return {
        get: function(){
          return i;
        },
        set: function( val ){
          i = val;
        },
        increment: function() {
          return ++i;
        }
      };
    }());

    // `counter` is an object with properties, which in this case happen to be
    // methods.

    console.log(counter.get()); // 0
    counter.set( 3 );
    console.log(counter.increment()); // 4
    console.log(counter.increment()); // 5

    console.log(counter.i); // undefined (`i` is not a property of the returned object)
    i; // ReferenceError: i is not defined (it only exists inside the closure)

    done();

  });
});

