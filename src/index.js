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
 * @param {number} timeout
 * @returns {object} the ffprobe metadatra
 */
module.exports = async function (url, timeout = 1500) {
  return new Promise(function (resolve, reject) {
    try {
      const buffer = new PassThrough();
      const stream = request.get(url, { timeout })
        .on('error', (err) => {
          buffer.end(); // close the buffer stream so everything finishes.
          reject(err);
        })
        .pipe(buffer);

      ffmpeg()
        .on('error', reject)
        .input(stream)
        // .ffprobe(streamIndex, callback)
        .ffprobe(0, function (err, metadata) {
          if (err) return reject(err);
          resolve(metadata);
        });
    } catch (err) {
      reject(err);
    }
  });
};
