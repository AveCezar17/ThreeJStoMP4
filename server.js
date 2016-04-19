var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs')/*,
    ffmpeg = require('ffmpeg')*/;

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    socket.on('render-frame', function (data) {
        data.file = data.file.split(',')[1]; // Get rid of the data:image/png;base64 at the beginning of the file data
        var buffer = new Buffer(data.file, 'base64');
        fs.writeFile(__dirname + '/tmp/frame' + data.frame + '.png', buffer.toString('binary'), 'binary');
        /*try {
            var process = new ffmpeg('/tmp/frame%04d.png');
            process.then(function (video) {

                video
                    .setVideoSize('640x?', true, true, '#fff')
                    .setAudioCodec('libfaac')
                    .setAudioChannels(2)
                    .save('/tmp/your_movie.avi', function (error, file) {
                        if (!error)
                            console.log('Video file: ' + file);
                    });

            }, function (err) {
                console.log('Error: ' + err);
            });
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }*/
    });
});
