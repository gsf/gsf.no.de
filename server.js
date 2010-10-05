var dgram = require('dgram'),
    ejs = require('./lib/ejs'),
    exec = require('child_process').exec,
    http = require('http'),
    querystring = require('querystring'),
    sys = require('sys'),
    url = require('url');

//var socket = dgram.createSocket('unix_dgram');
//var log = function (message) {
//  buffer = new Buffer('node[' + process.pid + ']: ' + message);
//  socket.send(buffer, 0, buffer.length, '/dev/log',
//    function (err, bytes) {
//      if (err) {
//        throw err;
//      }
//    console.log('Wrote ' + bytes + ' bytes to the socket.');
//    }
//  );
//};

var innerTemplate = "Here lies a true\npattern of\n<%= noun %>.";
var innerContext = {
  locals: {
    noun: 'socks'
  }
};
var template = "Hello, <% if (user) { %><%= user.name %>!\n\n<%= inner %><% } else { %>World!<% } %>";
var context = {
  locals: {
    user: {
      name: 'Bob'
    },
    inner: ejs.render(innerTemplate, innerContext)
  }
};
var server = http.createServer(function (request, response) {
  var url_parts = url.parse(request.url);
  if (url_parts.pathname ==='/') {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var out = ejs.render(template, context);
    response.end(out);
  } else if (url_parts.pathname ==='/up') {
    if (request.method === 'POST') {
      var body = '';
      request.on('data', function (chunk) {
        body = body + chunk;
      });
      request.on('end', function () {
        var payload = JSON.parse(querystring.parse(body).payload);
        if (payload.commits.length > 0) {
          for (var i=0; i<payload.commits.length; i++) {
            var commit = payload.commits[i];
            console.log('Saw commit ' + commit.id);
          }
          //exec("cd /home/zoia/supybot/supybot-plugins; su zoia -c 'git pull'",
          //  function (error, stdout, stderr) {
          //    console.log('Pulled: ' + stdout);
          //    if (error !== null) {
          //      console.log('Error: ' + error);
          //    }
          //  }
          //);
        }
      });
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('200');
    } else {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('200');
    }
  } else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404');
  }
})

// TODO: Catch for "Error: EACCES, Permission denied" and give
// a more helpful message
server.listen(process.env.NODEPORT || 80);

console.log('Server running');

