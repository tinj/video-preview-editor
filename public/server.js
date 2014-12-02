/* globals __dirname, console, exports, process, require */
var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var app = express();

var baseDir = '/dist';

app.use(logger());
app.use(bodyParser());

// Default page is index.html
app.get('/', function(request, response) {
  response.sendfile(__dirname + '/examples/template.html');
});

if (process.env.NODE_ENV === 'dev')
  baseDir = '/public';
app.use(express.static(__dirname + baseDir));

process.on('uncaughtException', function(err) {
  // Don't allow uncaught exceptions to take down the server
  console.log(err);
});

exports.startServer = function startServer(port, path, cb) {
  app.listen(port, cb);
};

// Check if running as main script
if (!module.parent) {
  var port = process.env.PORT || 3535;
  exports.startServer(port, function() {
    console.log('Listening on ' + port);
  });
}