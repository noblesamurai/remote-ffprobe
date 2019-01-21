const download = require('retriable-download');
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe-static');
const got = require('got');
ffmpeg.setFfprobePath(ffprobe.path);

/**
 * @module
 */

/**
 * @async
 * @param {string} url
 * @param {object} opts request options (ie. `{ timeout: 1500 }`).
 * @param {boolean} opts.download whether to download the file before probing.
 *   Note that this is just to skip the streaming step if you already know you
 *   are dealing with a non-streamable file. If streaming fails, we will
 *   automatically fallback to a download probe.
 * @returns {object} the ffprobe metadata
 */
module.exports = async function probe (url, opts = {}) {
  const input = opts.download ? await download(url) : got.stream(url, opts);
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
 * @private
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
