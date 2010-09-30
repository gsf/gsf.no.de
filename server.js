var dgram = require('dgram'),
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

http.createServer(function (request, response) {
  var url_parts = url.parse(request.url);
  if (url_parts.pathname ==='/') {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('200');
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
}).listen(80);

console.log('Server running');

