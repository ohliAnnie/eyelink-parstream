var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://m2utech.eastus.cloudapp.azure.com:9200',
  // log: 'trace'
});

QueryProvider = function() {

}

QueryProvider.prototype.ping = function (cb) {
  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: Infinity
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
      cb(false);
    } else {
      console.log('All is well');
      cb(true);
    }
  });
}

QueryProvider.prototype.selectSingleQueryByID = function (type, queryId, datas, cb) {
  var vTimeStamp = Date.now();
  console.log('queryId : '+queryId);
  console.time('nodelib-es/selectSingleQueryByID -> '+ queryId +' total ');
  console.log('nodelib-es/selectSingleQueryByID -> (%s) queryID', queryId);

  client.search({
    q: 'pants'
  }).then(function (body) {
    var hits = body.hits.hits;
    cb(null, hits);
  }, function (error) {
    console.trace(error.message);
    cb(error.message);
  });
}

QueryProvider.prototype.selectSingleQueryByID2 = function (type, queryId, datas, cb) {
  var vTimeStamp = Date.now();
  console.log('queryId : '+queryId);
  console.time('nodelib-es/selectSingleQueryByID2 -> '+ queryId +' total ');
  console.log('nodelib-es/selectSingleQueryByID2 -> (%s) queryID', queryId);

  client.search({
    index: 'corecode-2016-08',
    type: 'corecode',
    body: {
      query: {
        match: {
          body: 'node_id'
        }
      }
    }
  }).then(function (resp) {
      var hits = resp.hits.hits;
      cb(null, hits);
  }, function (err) {
      console.trace(err.message);
      cb(error.message);
  });

}


// var pageNum = request.params.page;
// var perPage = request.params.per_page;
// var userQuery = request.params.search_query;
// var userId = request.session.userId;

// var searchParams = {
//   index: 'posts',
//   from: (pageNum - 1) * perPage,
//   size: perPage,
//   body: {
//     query: {
//       filtered: {
//         query: {
//           match: {
//             // match the query against all of
//             // the fields in the posts index
//             _all: userQuery
//           }
//         },
//         filter: {
//           // only return documents that are
//           // public or owned by the current user
//           or: [
//             {
//               term: { privacy: "public" }
//             },
//             {
//               term: { owner: userId }
//             }
//           ]
//         }
//       }
//     }
//   }
// };

// client.search(searchParams, function (err, res) {
//   if (err) {
//     // handle error
//     throw err;
//   }

//   response.render('search_results', {
//     results: res.hits.hits,
//     page: pageNum,
//     pages: Math.ceil(res.hits.total / perPage)
//   });
// });


exports.QueryProvider = QueryProvider;
