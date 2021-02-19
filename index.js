const express = require('express');
const app = express();

const get_video_list = require('./list/get-video-list');
const get_audio_url = require('./list/get-audio-url');
const search_suggests = require('./list/search-suggests');

const errorResponse = (status, error) => ({ status, error });
const sendResponse = (req, res) =>
  req
    .then((data) => res.json({ ...data, status: 200 }))
    .catch((e) => res.json(errorResponse(502, e)));

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/suggest', (req, res) => {
  if (req.query.keyword) {
    sendResponse(search_suggests(req.query.keyword), res);
  } else {
    res.json(errorResponse(400, 'You have to specify keyword.'));
  }
});

app.get('/list', (req, res) => {
  if (req.query.keyword) {
    sendResponse(get_video_list(req.query.keyword), res);
  } else {
    res.json(errorResponse(400, 'You have to specify keyword.'));
  }
});

app.get('/download', (req, res) => {
  if (req.query.video_id) {
    sendResponse(get_audio_url(req.query.video_id), res);
  } else {
    res.json(errorResponse(400, 'You have to specify video_id.'));
  }
});

const port = process.env.PORT || 8080; // 8080
app.listen(port, function () {
  console.log('Listening on port ' + port);
});

module.exports = app;
