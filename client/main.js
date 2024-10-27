const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;

app.use('/hls', express.static(HLS_DIR));


//with hls for online streaming 
app.get('/:song_genre/:song_name', (req, res) => {
    const song_name = req.params.song_name;
    const song_genre = req.params.song_genre;
    
    const video_path = path.join(__dirname, `${song_genre}/${song_name}`)
    app.use('/hls', express.static(HLS_DIR));
    app.use('/hls', express.static(HLS_DIR));

    ffmpeg(video_path)
        .outputOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-s 640x360',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls',
        ])
        .output(hlsPath)
        .on('end', () => {
            console.log('HLS streaming files generated.');
            res.redirect(`/hls/output.m3u8`);
        })

})





//for local version of app  
app.get('localstreaming', (req, res) => {
    const song_name = req.params.song_name;
    const song_genre = req.params.genre;
    const range = req.query.range;
    const song_resolution = req.query.song_resolution;

    const song_path =  `/downloads/${song_genre}/${song_name}/${song_resolution}`
    const video_size = fs.statSync(song_path).size;

    const CHUNCK_SIZE = 10 ** 6;
    const start = Number((range.replace(/\D/g, "")));
    const end = Math.min(start + CHUNCH_SIZE, video_size - 1);

    const content_length = end - start +  1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${video_size}`,
        "Accecpt-Ranges": `bytes`,
        "Content-Length": content_lenght,
        "Content-Type": "video/mp4"
    };
    res.writeHead(206);

    const video_stream = fs.createReadStream(video_path, { start, end });
    video_stream.pipe(res)

})


app.listen(port, function() {
    console.log(`App listing on port ${port}`)
})