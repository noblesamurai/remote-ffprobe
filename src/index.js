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
    if (!opts.download) return probe(url, { ...opts, download: true });
    else throw err;
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
  const isStream = input && input.pipe;
  return new Promise((resolve, reject) => {
    if (isStream) input.on('error', _reject);
    ffmpeg().on('error', _reject).input(input).ffprobe(0, complete);

    function cleanup () {
      if (!isStream) return;
      input.removeListener('error', _reject);
      // since ffprobe might not need to consume the whole stream to return results... we want to
      // destroy it now to make sure it is cleaned up properly rather than potentially remaining
      // paused in memory...
      input.destroy();
    }
    function complete (err, data) {
      return err ? _reject(err) : _resolve(data);
    }
    function _resolve (data) {
      cleanup();
      resolve(data);
    }
    function _reject (err) {
      cleanup();
      reject(err);
    }
  });
}
