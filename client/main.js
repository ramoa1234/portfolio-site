const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;


app.get('api', (req, res) => {
    const song_name = req.query.song_name;
    const song_resolution = req.query.song_resolution;
    const song_genre = req.query.genre;
    const range = req.query.range;

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