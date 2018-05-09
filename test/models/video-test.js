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
  });
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
