const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const nock = require('nock');
const path = require('path');
const remoteffprobe = require('..');

describe('remote-ffprobe', function () {
  it('gives ffprobe info', async function () {
    nock('https://testing.com').get('/video.mp4').replyWithFile(200, path.resolve(__dirname, 'video.mp4'));
    const info = await remoteffprobe('https://testing.com/video.mp4');
    // console.log(info);
    expect(info).to.be.an('object');
    expect(info).to.have.all.keys('streams', 'format', 'chapters');
  });

  it('errors cleanly on 404', async function () {
    nock('https://testing.com').get('/404.mp4').reply(404);
    const probe = remoteffprobe('https://testing.com/404.mp4');
    expect(probe).to.eventually.be.rejectedWith(Error);
  });

  it('should cleanly fail on ETIMEDOUT', async function () {
    nock('https://testing.com').get('/timeout.mp4').delayConnection(1000).reply(500);
    const probe = remoteffprobe('https://testing.com/timeout.mp4', 100);
    expect(probe).to.eventually.be.rejectedWith(Error);
  });
});
