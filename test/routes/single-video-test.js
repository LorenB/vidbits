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
      const video = await Video.create({title, description});
      const response = await request(app)
        .get(`/videos/${video._id}`);

      const videoElem = jsdom(response.text).querySelector('.single-video-title');

      assert.include(videoElem.textContent, title);
    });
  });

});
