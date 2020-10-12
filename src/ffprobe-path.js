try {
  module.exports = require('ffprobe-static').path; // Optional dep
} catch {
  module.exports = 'ffprobe';
}
