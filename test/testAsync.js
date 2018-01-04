var async = require('async');

var fs = require('fs');
var src = 'myfile.txt';
var des = 'myfile_des.txt';

async.waterfall([
  function(callback) {
    fs.readFile(src, callback);
  },
  function(data, callback) {
    fs.writeFile(des, data, callback);
  }],
  function(err) {
    if(err) console.log(err);
  }
);

