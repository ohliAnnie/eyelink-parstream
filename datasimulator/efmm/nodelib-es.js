var queryParser = require('../../routes/dao/queryParser');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  // host: 'localhost:9200',
  // host: 'http://m2utech.eastus.cloudapp.azure.com:9200'
  host: 'http://m2u-parstream.eastus.cloudapp.azure.com:9200'
  // log: 'trace'
});

var sleep = require('system-sleep');

QueryProvider = function() {
};

QueryProvider.prototype.insert = function (data) {
  logger.trace('Inserting data : ', data);
  client.create(data, function (err, resp){
      logger.error('Inserting error !!!',err.message);
  });
}

QueryProvider.prototype.insertBulkQuery = function (datas, cb) {
  client.bulk(
    {body : makeBulkData(datas)}
  ).then(function (resp) {
      // console.log(resp);
      cb(null, resp);
  }, function (err) {
      logger.error(err.message);
      cb(err.message);
  });
}

makeBulkData = function(datas) {
  var bulkData = [];
  for(var idx=0; idx<datas.body.length; idx++) {
    var obj = {
      index: {
        _index : datas.index,
        _type : datas.type}
    }
    bulkData.push(obj);
    bulkData.push(datas.body[idx]);
  }
  // console.log(bulkData);
  return bulkData;
}
exports.QueryProvider = QueryProvider;
