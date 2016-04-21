var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path'),
    fs = require('fs');

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function (socket) {
    socket.on('render-frame', function (data) {
        data.file = data.file.split(',')[1]; // Get rid of the data:image/png;base64 at the beginning of the file data
        var buffer = new Buffer(data.file, 'base64');
        fs.writeFile(__dirname + '/tmp/frame' + data.frame + '.png', buffer.toString('binary'), 'binary');

        var hf = require('hls-ffmpeg');
        var json = {
            input: 'tmp/frame%d.png',
            format: '848x480',
            output: 'your_movie.mp4'
        };
        hf.ffmpeg(json, function(err, data){
            console.log(err||data)
        });
    });
});