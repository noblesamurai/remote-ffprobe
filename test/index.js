const remoteffprobe = require('..');

describe('remote-ffprobe', function () {
  it('works', async function () {
    this.timeout(10000);
    const metadata = await remoteffprobe('https://s3.amazonaws.com/contentsamurai.com/users/1394472/videos/149464/video.mp4?AWSAccessKeyId=AKIAJC2SSEDWQDBZ56UA&Expires=1529485966&Signature=q4LZwArvNtL%2FsuY1rmJOi%2FpuDZ0%3D');
    console.log(metadata.streams[1].width, metadata.streams[1].height);
  });
});
