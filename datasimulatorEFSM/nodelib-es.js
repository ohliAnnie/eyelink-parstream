var Utils = require('../routes/util');
var queryParser = require('./queryParser');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://m2utech.eastus.cloudapp.azure.com:9200',
  // log: 'trace'
});

QueryProvider = function() {

};

QueryProvider.prototype.insertData = function (type, queryId, datas) {  
  // console.log('queryId : '+queryId);
   // SQL 내 파라메타를 변경해준다.
  var sQueryString = Utils.replaceSql2(queryParser.getQuery(type, queryId), datas);
  // console.log('nodelib-es/insertQueryByID -> ' + sQueryString);

  sQueryString = JSON.parse(sQueryString);
  // console.log(sQueryString);

  client.index(
    sQueryString
  ).then(function (resp) {      
      // console.log(resp);
  }, function (err) {      
      console.trace(err.message);
  });
}

exports.QueryProvider = QueryProvider;
