const Video = require('../../models/video');
const {assert} = require('chai');

const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Model: Video', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('#title', () => {
    it('is a string', async () => {
      const titleInvalid = 0;
      const video = new Video({
        title: titleInvalid
      });
      assert.strictEqual(video.title, titleInvalid.toString() );
    });
    it('is required', async () => {
      const video = await new Video({url: 'http://example.com'});
      const error = video.validateSync();
      assert.equal(error.errors.title.message, 'Path `title` is required.');
    });
  });

  describe('#url', () => {
    it('is a string', async () => {
      const urlInvalid = 0;
      const someValidTitle = 'I am valid';
      const video = new Video({
        title: someValidTitle,
        url: urlInvalid
      });
      assert.strictEqual(video.url, urlInvalid.toString() );
    });
  });
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
