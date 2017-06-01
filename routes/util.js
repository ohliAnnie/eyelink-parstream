function replaceSql(sql, params) {
  // var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};
  for (var key in params) {
    console.log('util/replaceSql -> key : %s, value : %s', key, params[key]);
    // if (typeof params[key] === 'object')
    //   console.log('util/replaceSql -> key : %s, value : %s, typeof ', key, params[key], typeof params[key], typeof params[key][0]);

    // 먼저 배열 parameter를 처리한다.
    var re = new RegExp("#" + key + "#","g");
    var re1 = new RegExp("##" + key + "##","g");
    if (typeof params[key] === 'object') {
      if (typeof params[key][0] === 'string') {
        var tsql = '';
        for (var i=0; i<params[key].length; i++) {
          tsql += "'" + params[key][i] + "',";
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
        console.log('test');
        console.log(key);
        console.log(params[key][0]);
        throw new Error('Please check sql array params');
      }
    } else if (typeof params[key] === 'string') {
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

function replaceSql2(sql, params) {
  // var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};
  for (var key in params) {
    console.log('util/replaceSql2 -> key : %s, value : %s', key, params[key]);
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
        console.log('test');
        console.log(key);
        console.log(params[key][0]);
        throw new Error('Please check sql array params');
      }
    } else if (typeof params[key] === 'string') {
      sql = sql.replace(re, '"' + params[key] + '"');
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
  // var d = new Date();
  // console.log('util/mergeLoadedData ->  today : %s', Date.today());
  for (var key in _rawDataByDay) {
    if (_rawDataByDay[key] !== null && _rawDataByDay[key] !== undefined) {
      console.log('util/mergeLoadedData -> date %s, data count : %s', key, _rawDataByDay[key].length);
      if (_rawDataByDay[key].length > 0)
        old_out_data = old_out_data.concat(_rawDataByDay[key]);
    }
  }
  try {
    console.log('util/mergeLoadedData -> old_out_data.length : %s', old_out_data.length);
  } catch (e) {}
  // console.log('util/mergeLoadedData -> out_data.length : %s', out_data);
  // console.log('util/mergeLoadedData -> out_data : %s', out_data[0]);

  if (out_data[0] === undefined || out_data[0] === null)
    return [old_out_data];
  else {
    console.log('util/mergeLoadedData -> out_data.length : %s', out_data[0].length);
    out_data[0] = out_data[0].concat(old_out_data);
    return out_data;
  }

}

function generateRandom (min, max) {
  var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
  return ranNum;
}

module.exports.replaceSql = replaceSql;
module.exports.replaceSql2 = replaceSql2;
module.exports.mergeLoadedData = mergeLoadedData;
module.exports.generateRandom = generateRandom;
