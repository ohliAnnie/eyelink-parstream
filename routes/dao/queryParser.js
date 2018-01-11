var logger = global.log4js.getLogger('queryParser');
module.exports.getQuery = function(type, queryId) {
  // logger.debug('getQuery -> global.queryList : %j', global.query.queryList);
  // logger.debug('getQuery -> global.query.%s query length : %d', type, global.query.queryList[''+ type +''][0].query.length);
  var query = '';
  if (global.query.queryList[''+type+''] == undefined) {
    logger.error('type [%s] is not found!!', type);

  } else {
    for(var i = 0; i < global.query.queryList[''+type+''][0].query.length; i++) {
      // logger.debug('getQuery -> %d, %s', i, global.query.queryList[''+type+''][0].query[i].$.id);
      if (global.query.queryList[''+type+''][0].query[i].$.id == queryId) {
        query = global.query.queryList[''+type+''][0].query[i]._;
        // logger.debug('getQuery -> %s', query);
        break;
      }
    }
    if (query == '') {
      logger.error('type [%s], queryId [%s] is not found!!', type, queryId);
    }
     // logger.debug('getQuery -> [%s]', query);
    query = query.replace(/\r\n?/g, '').trim();
    query = query.replace(/\n?/g, '').trim();

  }
  // logger.debug('getQuery -> [%s]', query);
  return query;
}

