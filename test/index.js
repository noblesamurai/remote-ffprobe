const remoteffprobe = require('..');
const expect = require('chai').expect;

describe('remote-ffprobe', function () {
  it('gives ffprobe info', async function () {
    this.timeout(10000);
    const info = await remoteffprobe('https://s3.amazonaws.com/remote-ffprobe-test-files/user_video.mp4');
    console.log(info);
    expect(info).to.be.an('object');
    expect(info).to.have.all.keys('streams', 'format', 'chapters');
  });

  it('errors cleanly on 404', function (done) {
    this.timeout(10000);
    remoteffprobe('https://s3.amazonaws.com/remote-ffprobe-test-files/user_video-404.mp4').catch(() => done());
  });
});
