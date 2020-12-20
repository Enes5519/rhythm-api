const express = require("express")
const app = express()

const get_video_list = require("./list/get-video-list")
const get_audio_url = require("./list/get-audio-url")
const search_suggests = require("./list/search-suggests")

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/api/suggest", (req, res) => {
    search_suggests(req.query.keyword)
        .then(x => res.json(x))
        .catch(e => res.send(e));
})

app.get("/api/list", (req, res) => {
    get_video_list(req.query.keyword)
        .then(x => res.json(x))
        .catch(e => res.send(e));
})

app.get("/api/download", (req, res) => {
    get_audio_url(req.query.video_id)
        .then(x => res.json(x))
        .catch(e => res.send(e));
})

const port = process.env.PORT || 5519 // 8080
app.listen(port, function () {
    console.log('Listening on port ' + port);
});

module.exports = app