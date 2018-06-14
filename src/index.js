const ffmpeg = require('fluent-ffmpeg');
const request = require('request');
const { PassThrough } = require('stream');
const ffprobe = require('ffprobe-static');
ffmpeg.setFfprobePath(ffprobe.path);

module.exports = async function (url) {
  return new Promise(function (resolve, reject) {
    try {
      const stream = request.get(url).pipe(new PassThrough());

      stream.once('end', function () {
        console.log('shouldn\'t get to end!');
      });

      ffmpeg()
        .once('error', reject)
        .input(stream)
        .ffprobe(0, function (err, metadata) {
          if (err) {
            reject(err);
          }
          resolve(metadata);
        });
    } catch (err) {
      reject(err);
    }
  });
};
