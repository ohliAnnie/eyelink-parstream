var parstream = require("parstream")
var parstream =  parstream.createPool({
    host: 'm2u-da.eastus.cloudapp.azure.com',
    port: 9042,
    size: 5,
});

ReportsProvider = function() {

}

// 단건에 대해서 Query를 수행한다.
ReportsProvider.prototype.selectSingleQueryByID = function (queryId, datas, callback) {


};

exports.ReportsProvider = ReportsProvider;
