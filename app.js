#!/usr/bin/env node

var connect = require('connect'),
    sharejs = require('share'),
    redis   = require('redis');

var argv = require('optimist').
  usage("Usage: $0 [-p portnum]").
  default('p', 8000).
  alias('p', 'port').
  argv;

var server = connect(
  connect.favicon(),
  connect.static(__dirname + '/public'),
  connect.router(function (app) {
    app.get('/?', function(req, res, next) {
      res.writeHead(302, {location: '/index.html'});
      res.end();
    });
  })
);

var options = {
  db: {type: 'redis'},
  browserChannel: {cors: '*'}
};

console.log("Communico server starting");
console.log("Options: ", options);

var port = argv.p;

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.server.attach(server, options);

server.listen(port);
console.log("Running at http://localhost:" + port);

process.title = 'sharejs'
process.on('uncaughtException', function (err) {
  console.error('An error has occurred.');
  console.error('Version ' + sharejs.version + ': ' + err.stack);
});
