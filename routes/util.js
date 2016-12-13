function replaceSql(sql, params) {
  // var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};
  for (var key in params) {
    console.log('util/replaceSql -> key : %s, value : %s', key, params[key]);

    // TO-DO 대소문자 구별없이 처리할 수 있도록 보완 필
    var re = new RegExp("#" + key + "#","g");
    if (typeof params[key] === 'string') {
      sql = sql.replace(re, "'" + params[key] + "'");
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

function mergeLoadedData(out_data) {
  // MERGE = 'Y'이면 이전 날짜의 RawData를 합쳐준다.
  // TO-DO 지정된 일자 데이터만 Merge 하도록 로직 보완 필요
  var old_out_data = [];
  var d = new Date();
  console.log('util/mergeLoadedData ->  today : %s', Date.today());
  for (var key in _rawDataByDay) {
    console.log('util/mergeLoadedData -> date %s, data count : %s', key, _rawDataByDay[key].length);
    if (_rawDataByDay[key].length > 0)
      old_out_data = old_out_data.concat(_rawDataByDay[key]);
  }
  out_data[0] = out_data[0].concat(old_out_data);
  return out_data;

}

module.exports.replaceSql = replaceSql;

module.exports.mergeLoadedData = mergeLoadedData;
