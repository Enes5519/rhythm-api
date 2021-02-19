const fetch = require('node-fetch');
var mime = require('mime-types');
const baseURL = 'https://www.youtube.com';
const videoPageURL = baseURL + '/watch?v=';
const videoDetailsBaseURL = baseURL + '/get_video_info?&asv=3&el=detailpage&hl=en_US&video_id=';

const getAudioUrl = async (id) => {
  const format = await getAudioFormat(id);
  if (!format) {
    return 'error';
  }

  if (!format.hasCipher) {
    return { url: format.value, extension: mime.extension(format.mimeType) };
  }

  try {
    let playerPage = await fetch(videoPageURL + id);
    if (playerPage.status !== 200) {
      return 'error';
    }
    playerPage = await playerPage.text();
    const player = await fetch(baseURL + playerPage.match(/jsUrl":"(.*?)"/)[1]);
    const playerResponse = await player.text();
    const deChip = playerResponse.match(/a[.]split[(]""[)];(.*);return a[.]join[(]""[)]/)[1];
    const functions = getPlayerDeChipFunctions(playerResponse);
    const patterns = getPlayerDeChipPatterns(deChip);

    const cipher = getJsonFromUrl(format.value);
    let signature = cipher.s.split('');
    patterns.forEach((pattern) => {
      switch (functions[pattern.function]) {
        case 'a.reverse()':
          signature = signature.reverse();
          break;
        case 'var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c':
          let c = signature[0];
          signature[0] = signature[pattern.number % signature.length];
          signature[pattern.number % signature.length] = c;
          break;
        case 'a.splice(0,b)':
          signature = signature.splice(pattern.number);
          break;
      }
    });

    return {
      url: cipher.url + '&sig=' + signature.join(''),
      extension: mime.extension(format.mimeType),
    };
  } catch (e) {
    console.log('Failed fetch', e);

    return 'error';
  }
};

const getPlayerDeChipFunctions = (player_response) => {
  const regex = player_response.match(/var \w+={(\w+:function\(.*?)}};/s)[1];
  const result = {};
  regex.split('},').forEach((value) => {
    const temp = value.trim().split(':');
    result[temp[0]] = temp[1].match(/[{](.*)/)[1];
  });
  return result;
};

const getPlayerDeChipPatterns = (deChip) => {
  const result = [];
  for (const value of deChip.matchAll(/.(\w+\(\w+,\d+\))/g)) {
    result.push(getDeChipPattern(value[1]));
  }
  return result;
};

const getDeChipPattern = (str) => {
  const match = str.match(/(.*?)\(a,(.*?)\)/);
  return { function: match[1], number: parseInt(match[2]) };
};

const getAudioFormat = async (video_id) => {
  const response = await fetch(videoDetailsBaseURL + video_id);
  if (response.status !== 200) return null;

  try {
    const html = await response.text();
    const player_response = JSON.parse(getJsonFromUrl(html)['player_response']);
    const adaptiveFormats = player_response['streamingData']['adaptiveFormats'];

    if (adaptiveFormats.length !== 0) {
      let maxAudioBitrate = null;
      adaptiveFormats.forEach((value) => {
        if (value.audioQuality && mime.extension(value.mimeType) !== 'weba') {
          if (maxAudioBitrate === null || value.bitrate > maxAudioBitrate.bitrate) {
            maxAudioBitrate = value;
          }
        }
      });

      const hasCipher = Boolean(maxAudioBitrate.signatureCipher);
      return {
        hasCipher: hasCipher,
        value: hasCipher ? maxAudioBitrate.signatureCipher : maxAudioBitrate.url,
        mimeType: maxAudioBitrate.mimeType,
      };
    }

    return null;
  } catch (e) {
    console.log('Fetch error', e);

    return null;
  }
};

function getJsonFromUrl(query) {
  const result = {};
  query.split('&').forEach(function (part) {
    const item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

module.exports = getAudioUrl;
