var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    ffmpeg = require('ffmpeg');

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    socket.on('render-frame', function (data) {
        data.file = data.file.split(',')[1]; // Get rid of the data:image/png;base64 at the beginning of the file data
        var buffer = new Buffer(data.file, 'base64');
        fs.writeFile(__dirname + '/tmp/frame' + data.frame + '.png', buffer.toString('binary'), 'binary');
        try {
            var process = new ffmpeg('tmp/frame*.png');
            process.then(function (video) {
                var savedVideo = video;
                console.log(savedVideo);
                savedVideo./*addCommand('-r', '6').*/save('your_movie.mp4', function (error, file) {
                    if (!error)
                        console.log('Video file: ' + file);
                });
                    /*.setVideoSize('640x?', true, true, '#fff')
                    .setAudioCodec('libfaac')*/
                    /*.setVideoCodec('libx264')*/
                    /*.setAudioChannels(2)*/

            }, function (err) {
                console.log('Error: ' + err);
            });
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
    });
});
