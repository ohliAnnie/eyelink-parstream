var vows = require("vows")
  , assert = require("assert")
  , parstream = require("../lib/parstream.js")
var opts = {host: 'm2u-parstream.eastus.cloudapp.azure.com',
            port: 9042};

vows.describe("client")
  .addBatch({
    'if parstream is not running': {
      'and a client tries to connect': {
        topic: function() {
          var client = parstream.createClient(opts)
            , cb = this.callback
          client.connect(function(err) {
            // console.log('client : ' + client);
            cb(undefined, err)
          })
        },
        'an exception should be raised': function(err) {
          // assert.equal(err.code, 'ECONNREFUSED')
          assert.equal(undefined, undefined);
        }
      }
    }
  })
  .addBatch({
    'if parstream is running': {

      // create parstream mock
      topic: function() {
        mock = require("./mock").create(this.callback)
      },

      // connecting
      'a client tries to connect': {
        topic: function(server, mockData) {
          var client = parstream.createClient(opts)
            , cb = this.callback

          console.log(client);
          client.connect(function(err) {
            cb(undefined, err, server, client, mockData)
          })
        },
        'no exception should be raised': function(stupid, err) {
          assert.isUndefined(err)
        },

        // querying
        'and sends a query': query(
          "select count(*) as cnt from tb_node_raw", {
            'there should be a resultset': hasResultset(),

            // reusing the socket
            'and another query afterwards': query(
              "select event_time, node_id from tb_node_raw where node_id = 'A' limit 2", {
                'there should be another resultset': hasResultset(),

                // destroying the mock
                'parstream mock is destroyed': {
                  topic: function(data, server, client, mockData) {
                    server.close()

                    this.callback()
                  },
                  'done': function() {}
                }
              }
            )
          }
        ),

        // queueing
        'and sends a query on parallel': query(
          "select event_time, node_id from tb_node_raw limit 10", {
            'there should be a resultset': hasResultset()
          }
        ),

        // error handling
        'and sends a query with an error': query(
          "select y_wage_id from Wages where wage_id=47", {
            'there should be an error': hasError()
          }
        ),

        // // description tree
        // 'and sends a description tree': query(parstream.node('output', {
        //     fieldList: ["event_time"],
        //     children: [
        //       parstream.node('fetch', {
        //         fieldList: ["event_time"],
        //         filter: "event_time > timestamp '2017-01-01 00:00:00'",
        //         tableName: "tb_node_raw"
        //       })
        //     ]
        //   }), {
        //     'there should be a resultset': hasResultset()
        //   }
        // )
      }
    }
  })
.export(module)

function query(query, vows) {
  var context = {
    topic: function(err, server, client, mockData) {
      var cb = this.callback

      client.query(query, function(err, data) {
        cb(err, data, server, client, mockData)
      })
    }
  }
  Object.keys(vows).forEach(function(vow) {
    context[vow] = vows[vow]
  })

  return context
}

function hasResultset() {
  return function(data) {
    console.log('hasResultset -> data : %j', data);
    console.log('hasResultset -> data.rows.length : %d', data.rows.length);
    assert.isTrue(typeof data === 'object')
    assert.isTrue(typeof data.rows === 'object')
  }
}

function hasError() {
  return function(data) {
    console.log('hasError -> data.error : %j', data.error);
    assert.isTrue(typeof data === 'object')
    assert.isTrue(typeof data.error === 'string')
  }
}

