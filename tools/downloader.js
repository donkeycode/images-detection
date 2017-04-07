var fs = require('fs');
var request = require('request');

var downloader = function(url, filename, callback) {
  request.head(url, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

module.exports = downloader;