const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const app = require('../../app');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

const Video = require('../../models/video');

describe('Server path: /', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('shows list of videos when videos have already been saved', async () => {
      const videoToCreate = {
        title: 'Video A',
        description: 'An exhuastive history of the amaziong letter A.',
        url: 'http://example.com'
      };


      const video = await Video.create({title: videoToCreate.title, description: videoToCreate.description, url: videoToCreate.url});
      const response = await request(app)
        .get(`/`);

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/videos');

      const redirectResponse = await request(app)
        .get(response.headers.location);

      const selectedElements = jsdom(redirectResponse.text).querySelectorAll('.video-card');
      const firstElementText = selectedElements[0].textContent;
      assert.strictEqual(selectedElements.length, 1);
      assert.include(firstElementText, videoToCreate.title);

      const videoIframeSrc = jsdom(redirectResponse.text).querySelector('iframe').getAttribute('src');
      assert.equal(videoIframeSrc, video.url);
    });
  });
});
