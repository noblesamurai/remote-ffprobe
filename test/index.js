const chai = require('chai');
const { expect } = chai;
const nock = require('nock');
const path = require('path');
const remoteffprobe = require('..');

chai.use(require('chai-as-promised'));

describe('remote-ffprobe', () => {
  it('gives ffprobe info for a streamable video', async () => {
    nock('https://testing.com').get('/streamable.mp4').replyWithFile(200, path.resolve(__dirname, 'streamable.mp4'));
    const info = await remoteffprobe('https://testing.com/streamable.mp4');

    expect(info).to.be.an('object');
    expect(info).to.have.all.keys('streams', 'format', 'chapters');
    expect(info.streams[0].profile).to.not.equal('unknown');
  });

  it('gives ffprobe info for a non-streamable video', async () => {
    nock('https://testing.com').get('/video.mp4').twice().replyWithFile(200, path.resolve(__dirname, 'video.mp4'));
    const info = await remoteffprobe('https://testing.com/video.mp4');

    expect(info).to.be.an('object');
    expect(info).to.have.all.keys('streams', 'format', 'chapters');
    expect(info.streams[0].pix_fmt).to.not.equal('unknown');
  });

  it('errors cleanly on 404', async () => {
    nock('https://testing.com').get('/404.mp4').reply(404);
    const probe = remoteffprobe('https://testing.com/404.mp4');
    await expect(probe).to.eventually.be.rejectedWith(Error);
  });

  it('should cleanly fail on ETIMEDOUT', async () => {
    nock('https://testing.com').get('/timeout.mp4').delayConnection(1000).reply(500);
    const probe = remoteffprobe('https://testing.com/timeout.mp4', { timeout: 100 });
    await expect(probe).to.eventually.be.rejectedWith(Error);
  });
  it('should fail cleanly when it\'s actually not a video', async () => {
    nock('https://testing.com')
      .get('/somepage.html')
      .times(Infinity)
      .replyWithFile(200, require.resolve('./fixtures/s3.amazonaws.com.html'));
    const probe = remoteffprobe('https://testing.com/somepage.html');
    await expect(probe).to.eventually.be.rejectedWith(Error);
    nock.cleanAll();
  });
});
