const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe-static');
const fs = require('fs');
const got = require('got');
const path = require('path');
const tempy = require('tempy');
ffmpeg.setFfprobePath(ffprobe.path);

/**
 * @module
 */

/**
 * @async
 * @param {string} url
 * @param {object} opts request options (ie. { timeout: 1500 }).
 * @returns {object} the ffprobe metadata
 */
module.exports = async function probe (url, opts = {}) {
  const stream = got.stream(url, opts);
  const input = opts.download ? await downloadStream(url, stream) : stream;
  try {
    const data = await _probe(input);
    if (opts.download || (data && data.streams[0] && data.streams[0].profile !== 'unknown')) return data;
    throw new Error('streaming probe failed, download and try again.');
  } catch (err) {
    return probe(url, { ...opts, download: true });
  }
};

/**
 * execute the actual ffprobe call.
 *
 * @async
 * @param {string|stream} input either a stream or a filename.
 * @returns {object} the ffprobe metadata
 */
async function _probe (input) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .on('error', reject)
      .input(input)
      .ffprobe(0, (err, data) => err ? reject(err) : resolve(data));
  });
}

/**
 * download a stream to a temp file.
 *
 * @async
 * @param {stream} stream
 * @returns {string} filename
 */
async function downloadStream (url, stream) {
  const filename = tempy.file({ extension: path.extname(url) });
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    file.on('finish', resolve);
    file.on('error', reject);
    stream.pipe(file);
  });
  return filename;
}
