const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const app = require('../../app');
const {mongoose, databaseUrl, options} = require('../../database');

const Video = require('../../models/video');


describe('Server path: /videos', () => {
  describe('POST', () => {
    beforeEach(async () => {
      await mongoose.connect(databaseUrl, options);
      await mongoose.connection.db.dropDatabase();
    });
    afterEach(async () => {
      await mongoose.disconnect();
    });

    it('creates a video and persists it', async () => {
      const videoTitle = 'Some Video';
      const videoDescription = 'A video about things and stuff.'
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title: videoTitle, description: videoDescription});
      assert.equal(response.status, 201);
      // TODO: confirm data is actually persisted
      const createdVideo = await Video.findOne({});
      assert.equal(createdVideo.title, videoTitle);
      assert.equal(createdVideo.description, videoDescription);
      assert.include(response.text, videoTitle);
      assert.include(response.text, videoDescription);
    });

    it('only save a video when a title is provided', async () => {
      const videoDescription = 'A video about things and stuff.'
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({description: videoDescription});

      assert.ok(response.status >= 400 && response.status < 500);
      const errorElem = jsdom(response.text).querySelector('.error-message');
      assert.include(errorElem.textContent, 'could not find title input');
      const selectedElements = jsdom(response.text).querySelectorAll('.video-card');
      assert.strictEqual(selectedElements.length, 0);
      const descriptionElem = jsdom(response.text).querySelector('#description-input');
      assert.equal(descriptionElem.value, videoDescription);
      const createdVideo = await Video.findOne({});
      assert.notOk(createdVideo);
    });
  });
});
