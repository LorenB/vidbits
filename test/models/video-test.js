const Video = require('../../models/video');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

async function connectDatabase() {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

describe('Model: Video', () => {
  beforeEach( () => {
    connectDatabase();
  });

  afterEach( () => {
    disconnectDatabase();
  });

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
