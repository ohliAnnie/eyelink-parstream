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
  var sQueryString = replaceSql2(queryParser.getQuery(type, queryId), datas);
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


function replaceSql2(sql, params) {
  // var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};
  for (var key in params) {
    // console.log('util/replaceSql2 -> key : %s, value : %s', key, params[key]);
    // if (typeof params[key] === 'object')
    //   console.log('util/replaceSql -> key : %s, value : %s, typeof ', key, params[key], typeof params[key], typeof params[key][0]);

    // 먼저 배열 parameter를 처리한다.
    var re = new RegExp("#" + key + "#","g");
    var re1 = new RegExp("##" + key + "##","g");    
    if (typeof params[key] === 'object') {
      if (typeof params[key][0] === 'string') {
        var tsql = '';
        for (var i=0; i<params[key].length; i++) {
          tsql += '"' + params[key][i] + '",';
        }
        tsql = tsql.substring(0, tsql.length-1);
        sql = sql.replace(re1, tsql);
      } else if (typeof params[key][0] === 'number') {
        var tsql = '';
        for (var i=0; i<params[key].length; i++) {
          tsql += params[key][i] + ",";
        }
        tsql = tsql.substring(0, tsql.length-1);
        sql = sql.replace(re1, tsql);
      } else if (typeof params[key][0] === 'undefined') {
        // console.log('test');
        // console.log(key);
        // console.log(params[key][0]);
        throw new Error('Please check sql array params');
      }
    } else if (typeof params[key] === 'string') {
       if(params[key].substring(0,1) == '{'){
       sql = sql.replace(re, params[key]); 
      } else {
        sql = sql.replace(re, '"' + params[key] + '"');
      }      
    } else if (typeof params[key] === 'number') {
      sql = sql.replace(re, params[key]);
    } else {
      throw new Error('Please check sql params');
    }
  }
  // console.log(sql);
  // sql.should.be.equal("SELECT * FROM A WHERE DATE >= '2016-12-12' AND ID = 'AAAA' AND NUM = 5");
  return sql;
}