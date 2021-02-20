const express = require('express');
const app = express();
const youtube = require('youtube-extractor');
const mime = require('mime-types');

async function getMaxAudioBitrateFormat(video_id){
  const formats = await youtube.get_video_formats(video_id);

  let maxAudioBitrateFormat = null;
  for (const format of formats) {
    if(format.mimeType.startsWith('audio') && mime.extension(format.mimeType) !== 'weba'){
      if(maxAudioBitrateFormat === null){
        maxAudioBitrateFormat = format;
      }else if(maxAudioBitrateFormat.bitrate < format.bitrate){
        maxAudioBitrateFormat = format;
      }
    }
  }

  return {url: await maxAudioBitrateFormat.downloadURL(), extension: mime.extension(maxAudioBitrateFormat.mimeType)};
}

const errorResponse = (status, error) => ({ status, error });

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html');  
});

app.get('/suggest', (req, res) => {
  if (req.query.keyword) {
    youtube
      .search_suggests(req.query.keyword)
      .then((suggests) => res.json({ suggests, status: 200 }))
      .catch((e) => res.json(errorResponse(502, e)));
  } else {
    res.json(errorResponse(400, 'You have to specify keyword.'));
  }
});

app.get('/list', (req, res) => {
  if (req.query.keyword) {
    youtube
      .search_results(req.query.keyword)
      .then((list) => res.json({ list, status: 200 }))
      .catch((e) => res.json(errorResponse(502, e)));
  } else {
    res.json(errorResponse(400, 'You have to specify keyword.'));
  }
});

app.get('/download', (req, res) => {
  if (req.query.video_id) {
    getMaxAudioBitrateFormat(req.query.video_id)
    .then((value) => res.json({ ...value, status: 200 }))
      .catch((e) => res.json(errorResponse(502, e)));
  } else {
    res.json(errorResponse(400, 'You have to specify video_id.'));
  }
});

const port = process.env.PORT || 8080; // 8080
app.listen(port, function () {
  console.log('Listening on port ' + port);
});

module.exports = app;
