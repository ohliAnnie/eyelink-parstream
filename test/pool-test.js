var vows = require("vows")
  , assert = require("assert")
  , parstream = require("../lib/parstream.js")
var opts = {host: 'm2u-parstream.eastus.cloudapp.azure.com',
            port: 9042,
            size: 5};

vows.describe("pool")
  .addBatch({
    'if parstream is not running': {
      'and a pool tries to connect': {
        topic: function() {
          var pool = parstream.createPool(opts)
            , cb = this.callback
          pool.connect(function(err) {
            cb(undefined, err)
          })
        },
        'an exception should be raised': function(err) {
          assert.equal(err, undefined)
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
      'a pool tries to connect': {
        topic: function(server, mockData) {
          var pool = parstream.createPool(opts)
            , cb = this.callback

          pool.connect(function(err) {
            cb(undefined, err, server, pool, mockData)
          })
        },
        'no exception should be raised': function(stupid, err) {
          assert.isUndefined(err)
        },

        // querying
        'and sends a query': query(
          "select event_time, node_id from tb_node_raw limit 4", {
            'there should be a resultset': hasResultset(),

            // reusing the socket
            'and another query afterwards': query(
              "select event_time, node_id from tb_node_raw limit 2", {
                'there should be another resultset': hasResultset(),

                // destroying the mock
                'parstream mock is destroyed': {
                  topic: function(data, server, pool, mockData) {
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
          "select event_time, node_id from tb_node_raw limit 2", {
            'there should be a resultset': hasResultset()
          }
        ),

        // error handling
        'and sends a query with an error': query(
          "select node from tb_node_raw limit 2", {
            'there should be an error': hasError()
          }
        )
      }
    }
  })
.export(module)

function query(sql, vows) {
  var context = {
    topic: function(err, server, pool, mockData) {
      var cb = this.callback

      pool.query(sql, function(err, data) {
        cb(err, data, server, pool, mockData)
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
    console.log(data);
    console.log(data.rows.length);
    assert.isTrue(typeof data === 'object')
    assert.isTrue(typeof data.rows === 'object')
  }
}

function hasError() {
  return function(data) {
    console.log(data.error);
    assert.isTrue(typeof data === 'object')
    assert.isTrue(typeof data.error === 'string')
  }
}

