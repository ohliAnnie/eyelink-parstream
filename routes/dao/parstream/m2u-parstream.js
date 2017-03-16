/*!
 * Parstream client for Node
 *
 * Requires Parstream >= 1.6.0
 *
 * Copyright(c) 2011 Adcloud GmbH
 * MIT Licensed
 */
var net = require('net')
var _ = require('lodash');
var exports = module.exports = Parstream = {}

/** Connection Pool **/
Parstream.createPool = function createPool(options) {
  var self = new Pool()

  options = options || {}
  self.size = options.size || 5
  self.clients = []

  for (var i = 0; i < self.size; i++) {
    self.clients[i] = Parstream.createClient(options)
  }

  // create pool methods dynamically (wrap clients)
  Object.keys(Client.prototype).forEach(function(item) {
    if (typeof self[item] === 'undefined' && typeof Client.prototype[item] === 'function') {
      // copy client methods to pool
      self[item] = function() {
        var args = [].slice.call(arguments)
          , selectedClient = this.selectClient()

        this.clients[selectedClient][item].apply(
          this.clients[selectedClient],
          args
        )
      }
    }
  })

  return self
}
function Pool() {}
Pool.prototype.selectClient = function poolSelectClient() {
  return Math.floor(Math.random() * this.size)
}
Pool.prototype.connect = function poolConnect(cb) {
  var connected = 0
    , errors = 0
    , self = this
    , clients = self.clients.length

  self.clients.forEach(function(client) {
    client.connect(function(err) {
      if (err) errors++

      if (++connected === clients) {
        if (errors !== clients) err = undefined
        cb(err)
      }
    })
  })
}
Pool.prototype.close = function poolClose() {
  var self = this

  self.clients.forEach(function(client) {
    client.close()
  })
}

/** Parstream client **/
Parstream.createClient = function createClient(options) {
  var self = new Client()

  options = options || {}
  // console.log(options);
  self.host = options.host || '127.0.0.1'
  self.port = options.port || 9042

  self.connected = false
  self.reconnect = true
  self.requestQueue = []
  self.current = null

  return self
}
function Client() {}
Client.prototype.connect = function connect(cb) {
  var self = this
  // console.log(self)
  self.socket = net.createConnection(self.port, self.host)
  self.socket.on('connect', function() {
    // console.log('Client connected')
    self.socket.setEncoding('utf8')

    var data = ''

    // receive data
    self.socket.on('data', function(chunk) {

      if (self.current !== null) {
        chunk = chunk.toString()
        data += chunk
        if (chunk.match(/\n\n/)) {
          data = data.replace(/\n\n/, '')

          self.current.callback(undefined, data)
          data = ''

          if (self.requestQueue.length > 0) {
            var args = self.requestQueue.shift()

            self.current.payload = args.payload
            self.current.callback = args.callback
            self.write(args.payload)
          } else self.current = null
        }
      }
    })
    self.socket.on('end', function() {
      // console.log('socket ended')

      // reconnect client if it died
      if (self.reconnect) self.connect(function(err) {
        if (err) console.log('client failed')
        else {
          if (self.current !== null) {
            self.write(self.current.payload)
          }
        }
      })
    })

    self.connected = true
    // console.log('after connect')
    // console.log(self)
    cb()
  })
  self.socket.on('error', function(err) {
    self.socket.destroy()
    cb(err)
  })
}
Client.prototype.query = function(query, cb) {
  if (!this.connected) cb(new Error('socket not connected'))

  // fix bsh for v4.3.3
  // if (typeof query === 'string') query = {sql_command: query}

  // query = JSON.stringify(query)
  this.queue(query, function(err, data) {
    if (err) return cb(err)

    try {
      // console.log('parsteam query data : %j', data);

      // console.time('csvToJson2')
      // SQL Error 발생한 경우
      if (data.indexOf('#ERROR-') === 0) {
        return cb(data);
      }
      data = csvToJson2(data);
      // console.log('csvtojson2 : %j', data);
      // console.timeEnd('csvToJson2')
    } catch(err) {
      console.error(err);
      // console.log('parsteam err : %j', data);
      return cb(err)
    }
    cb(undefined, data)
  })
}

function csvToJson(csv) {
  const content = csv.split('\n');
  const header = content[0].split(',');
  return _.tail(content).map((row) => {
    return _.zipObject(header, row.split(','));
  });
}

function csvToJson2(data) {
  var json = [];
  // Split on row
  data = data.split("\n");

  // Get first row for column headers
  headers = data.shift().split(";");

  // heaer의 첫번째 값에서  #을 제거
  // parstream sample ex) #event_time;node_id\n2016-11-16 00:32:28.000;\"0001.00000002\"
  headers[0] = headers[0].substring(1);

  data.forEach(function(d){
      // Loop through each row
      tmp = {}
      row = d.split(";")
      for(var i = 0; i < headers.length; i++){
        // console.log('%s, %d, %s', row[i], row[i].indexOf("\""), (row[i].indexOf("\"") > -1) ? row[i].substring(1, row[i].length-1) : row[i]);
        // varchar 값 \"0001.00000002\" 에 대한 처리.
        tmp[headers[i]] = ((row[i].indexOf("\"") === 0) ? row[i].substring(1, row[i].length-1) : row[i]);
      }
      // Add object to list
      json.push(tmp);
  });

  // Json 구조를 jdbc return 구조와 동일하게 구성한다.
  json = {'rows':json};

  return json;
}

Client.prototype.help = function(cmd) {
  if (!this.connected) cb(new Error('socket not connected'))

  if (cmd) cmd = 'help ' + cmd
  else cmd = 'help'

  this.queue(cmd, function(err, data) {
    if (err) throw err
    // console.log(data)
  })
}
Client.createCmd = function(cmd) {
  return function() {
    if (!this.connected) cb(new Error('socket not connected'))

    this.queue(cmd, function(err, data) {
      if (err) throw err
      // console.log(data)
    })
  }
}
Client.prototype.partitions = Client.createCmd('info partitions')
Client.prototype.memory = Client.createCmd('info memory')
Client.prototype.queue = function request(payload, cb) {
  var self = this

  if (self.current !== null) {
    // add request to queue
    return self.requestQueue.push({
      payload:payload,
      callback:cb
    })
  }

  // queue is empty – start right away
  self.current = {
    payload: payload,
    callback: cb
  }
  self.write(payload)
}
Client.prototype.write = function(payload) {
  this.socket.write(payload + "\r\n")
}
Client.prototype.close = function clientClose() {
  this.reconnect = false
  this.socket.end()
}

// v4.3.3 에서 지원 여부 확인 필요함.
/** TreeNodes **/
Parstream.node = function node(type, options) {
  var node = {}
    , nodeName = type.charAt(0).toUpperCase() + type.substr(1) + 'Node'

  options.children = options.children || []

  if (type.toLowerCase() === "output") {
    options.format = options.format || 'default'
    options.limit = options.limit || 0
    options.offset = options.offset || 0
  }

  if (type.toLowerCase() === "fetch") {
    options.alias = options.alias || ""
  }

  node['parstream::' + nodeName] = options

  return node
}

