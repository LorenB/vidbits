const {assert} = require('chai');
const {jsdom} = require('jsdom');
const request = require('supertest');
const app = require('../../app');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

const Video = require('../../models/video');

describe('Server path: /videos/:id', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders a single video', async () => {
      const title = 'Video A';
      const description = 'An exhuastive history of the amaziong letter A.'
      const url = 'http://example.com';
      const video = await Video.create({title, description, url});
      const response = await request(app)
        .get(`/videos/${video._id}`);

      const videoElem = jsdom(response.text).querySelector('.single-video-title');

      assert.include(videoElem.textContent, title);
      const iframes = jsdom(response.text).querySelectorAll('iframe');
      assert.equal(iframes.length, 1);
      const videoIframeSrc = jsdom(response.text).querySelector('iframe').getAttribute('src');
      assert.equal(videoIframeSrc, video.url);
    });
  });

});
