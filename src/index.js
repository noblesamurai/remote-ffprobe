const ffmpeg = require('fluent-ffmpeg');
const request = require('request');
const { PassThrough } = require('stream');
const ffprobe = require('ffprobe-static');
ffmpeg.setFfprobePath(ffprobe.path);

/**
 * @module
 */

/**
 * @async
 * @param {string} url
 * @returns {object} the ffprobe metadatra
 */
module.exports = async function (url) {
  return new Promise(function (resolve, reject) {
    try {
      const stream = request.get(url).pipe(new PassThrough());
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
