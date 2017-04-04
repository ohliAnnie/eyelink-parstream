var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://m2utech.eastus.cloudapp.azure.com:9200',
  log: 'trace'
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
      // console.log('All is well');
      cb(true);
    }
  });
}


// 단순 QueryString을 이용한 Query 실행
// ex) {q : aaa} : aaa 값을 포함하는 모든 Document 조
QueryProvider.prototype.selectQueryString = function (qString, cb) {
  var vTimeStamp = Date.now();
  // console.log('nodelib-es/selectQueryString -> (%j)', qString);

  client.search(
    qString
  ).then(function (body) {
    var hits = body.hits.hits;
    // console.log(body)
    cb(null, body.hits.total, hits);
  }, function (error) {
    console.trace(error.message);
    cb(error.message);
  });
}


// query.xml에 정의된 query를 이용한 query수행
QueryProvider.prototype.selectSingleQueryByID = function (type, queryId, datas, cb) {
  var vTimeStamp = Date.now();
  console.log('queryId : '+queryId);
  console.time('nodelib-es/selectSingleQueryByID2 -> '+ queryId +' total ');
  console.log('nodelib-es/selectSingleQueryByID2 -> (%s) queryID', queryId);

  var qString = {
    index: 'corecode-2016-08',
    type: 'corecode',
    body: {
      query: {
        match: {
          node_id : '0001.00000001'
        }
      }
    }
  }
  // var qString = {
  //   index: 'corecode-2016-08',
  //   type: 'corecode',
  //   body: {
  //     query: {
  //       filtered : {
  //         query : {
  //           match_all : {}
  //         },
  //         filter : {
  //           and : [
  //             {
  //               range : {
  //                 event_time : {
  //                   from : "",
  //                   to : ""
  //                 }
  //               }
  //             },
  //             {
  //               term : {
  //                 node_id : '0001.00000001'
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // };
  client.search(
    qString
  ).then(function (resp) {
      var hits = resp.hits.hits;
      // console.log(body)
      cb(null, resp.hits.total, hits);
  }, function (err) {
      console.trace(err.message);
      cb(error.message);
  });

}

QueryProvider.prototype.createIndexForTest = function (cb) {

  client.create({
    index: 'testindex',
    type: 'testtype',
    id: '1',
    body: {
      title: 'Test 1',
      tags: ['y', 'z'],
      published: true,
      published_at: '2013-01-01',
      counter: 1
    }
  }).then(function (resp) {
      // var hits = resp.hits.hits;
      // console.log(resp)
      // cb(null, hits);
  }, function (err) {
      console.trace(err.message);
      cb(error.message);
  });

}


// FIXME update는 정상 동작하지 않음, library bug로 보여짐.
QueryProvider.prototype.updateDocForTest = function (cb) {

  client.update({
    index: 'testindex',
    type: 'testtype',
    id: '1',
    body: {
      title: 'Test 1 updated',
      tags: ['y', 'z'],
      published: "true",
      published_at: '2013-01-01',
      counter: "1"
    }
  }).then(function (resp) {
      var hits = resp.hits.hits;
      console.log(resp)
      cb(null, hits);
  }, function (err) {
      console.trace(err.message);
      cb(error.message);
  });

}


QueryProvider.prototype.deleteDocForTest = function (cb) {

  client.delete({
    index: 'testindex',
    type: 'testtype',
    id: '1',
   }).then(function (resp) {
      var hits = resp.hits.hits;
      console.log(resp)
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
