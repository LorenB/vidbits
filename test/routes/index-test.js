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
      const title = 'Video A';
      const description = 'An exhuastive history of the amaziong letter A.'
      const video = await Video.create({title, description});
      const response = await request(app)
        .get(`/`);
      const selectedElements = jsdom(response.text).querySelectorAll('.video-card');
      const firstElementText = selectedElements[0].textContent;

      assert.strictEqual(selectedElements.length, 1);
      assert.include(firstElementText, title);
    });
  });
});
