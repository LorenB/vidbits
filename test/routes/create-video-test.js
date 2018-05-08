const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('Server path: /videos', () => {
  describe('POST', () => {
    it('creates a video and persists it', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title: 'Some Video', desciption: 'A video about things and stuff.'});
      assert.equal(response.status, 201);
      // TODO: confirm data is actually persisted
    });
  });
});
