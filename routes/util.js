function replaceSql(sql, params) {
  // var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};
  for (var key in params) {
    console.log('key : %s, value : %s', key, params[key]);

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

// function replaceSql2(sql, params) {
//   // var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};
//   console.log('Input Params : ' + params.keys);
//   for (var key in params) {
//     console.log('key : %s, value : %s', key, params[key]);

//     // TO-DO 대소문자 구별없이 처리할 수 있도록 보완 필
//     var re = new RegExp("#" + key + "#","g");
//     if (typeof params[key] === 'string') {
//       sql = sql.replace(re, "'" + params[key] + "'");
//     } else if (typeof params[key] === 'number') {
//       sql = sql.replace(re, params[key]);
//     } else {
//       throw new Error('Please check sql params');
//     }
//   }
//   console.log(sql);
//   // sql.should.be.equal("SELECT * FROM A WHERE DATE >= '2016-12-12' AND ID = 'AAAA' AND NUM = 5");
//   return sql;

// }

module.exports.replaceSql = replaceSql;

// module.exports.replaceSql2 = replaceSql2;
