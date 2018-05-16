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
      const videoUrl = 'http://example.com';
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title: videoTitle, description: videoDescription, url: videoUrl});
      assert.equal(response.status, 201);
      const createdVideo = await Video.findOne({});
      assert.equal(createdVideo.title, videoTitle);
      assert.equal(createdVideo.description, videoDescription);
      assert.include(response.text, videoTitle);
      assert.include(response.text, videoDescription);
    });

    it('only save a video when a title is provided', async () => {
      const videoDescription = 'A video about things and stuff.';
      const videoUrl = 'https://example.com';
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({description: videoDescription, url: videoUrl});

      assert.ok(response.status >= 400 && response.status < 500);
      const errorElem = jsdom(response.text).querySelector('.error-message');
      assert.include(errorElem.textContent, 'could not find title input');
      const selectedElements = jsdom(response.text).querySelectorAll('.video-card');
      assert.strictEqual(selectedElements.length, 0);
      const descriptionElem = jsdom(response.text).querySelector('#description-input');
      assert.equal(descriptionElem.value, videoDescription);
      const urlElem = jsdom(response.text).querySelector('#url-input');
      assert.equal(urlElem.value, videoUrl);

      const createdVideo = await Video.findOne({});
      assert.notOk(createdVideo);
    });

    it('only save a video when a url is provided', async () => {
      const videoTitle = 'Some title';
      const videoDescription = 'A video about things and stuff.';
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({description: videoDescription, title: videoTitle});

      assert.ok(response.status >= 400 && response.status < 500);
      const errorElem = jsdom(response.text).querySelector('.error-message');
      assert.include(errorElem.textContent, 'a URL is required');
      const selectedElements = jsdom(response.text).querySelectorAll('.video-card');
      assert.strictEqual(selectedElements.length, 0);
      const descriptionElem = jsdom(response.text).querySelector('#description-input');
      assert.equal(descriptionElem.value, videoDescription);
      const titleElem = jsdom(response.text).querySelector('#title-input');
      assert.equal(titleElem.value, videoTitle);

      const createdVideo = await Video.findOne({});
      assert.notOk(createdVideo);
    });
  });
});

describe('Server path: /videos/:id/edit', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });

  describe('GET', () => {
    it('renders a form for the Video', async () => {
      const title = 'Video A';
      const description = 'An exhuastive history of the amaziong letter A.'
      const url = 'http://example.com';
      const video = await Video.create({title, description, url});
      const response = await request(app)
        .get(`/videos/${video._id}/edit`);
      assert.equal(response.status, 201);
      const descriptionElem = jsdom(response.text).querySelector('#description-input');
      assert.equal(descriptionElem.value, video.description);
      const titleElem = jsdom(response.text).querySelector('#title-input');
      assert.equal(titleElem.value, video.title);
      const urlElem = jsdom(response.text).querySelector('#url-input');
      assert.equal(urlElem.value, video.url);
    });
  });
});

describe('Server path: /videos/:id/updates', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });

  describe('POST', () => {
    it('updates and existing video', async () => {
      const videoTitle = 'Some Video';
      const videoDescription = 'A video about things and stuff.';
      const videoUrl = 'http://example.com';
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title: videoTitle, description: videoDescription, url: videoUrl});
      assert.equal(response.status, 201);
      const createdVideo = await Video.findOne({});
      const videoUpdatedTitle = 'Another Video';
      const videoUpatedDescription = 'More things and stuff.';
      const videoUpdatedUrl = 'http://example.com/update';

      const updateResponse = await request(app)
        .post(`/videos/${createdVideo._id}/updates`)
        .type('form')
        .send({title: videoUpdatedTitle, description: videoUpatedDescription, url: videoUpdatedUrl});
      assert.equal(updateResponse.status, 302);
      assert.equal(updateResponse.headers.location, `/videos/${createdVideo._id}`);
      const updatedVideo = await Video.findById(createdVideo._id);
      assert.equal(updatedVideo.title, videoUpdatedTitle);
      assert.equal(updatedVideo.description, videoUpatedDescription);
      assert.equal(updatedVideo.url, videoUpdatedUrl);
    });

    it('does not update for invalid ID', async () => {
      const videoTitle = 'Some Video';
      const videoDescription = 'A video about things and stuff.';
      const videoUrl = 'http://example.com';
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title: videoTitle, description: videoDescription, url: videoUrl});
      assert.equal(response.status, 201);
      const createdVideo = await Video.findOne({});
      const videoUpdatedTitle = 'Another Video';
      const videoUpatedDescription = 'More things and stuff.';
      const videoUpdatedUrl = 'http://example.com/update';

      const updateResponse = await request(app)
        .post(`/videos/totallyfakeid/updates`)
        .type('form')
        .send({title: videoUpdatedTitle, description: videoUpatedDescription, url: videoUpdatedUrl});

      assert.equal(updateResponse.status, 400);
      const videoAfterPost = await Video.findById(createdVideo._id);
      assert.equal(videoAfterPost.title, videoTitle);
      assert.equal(videoAfterPost.description, videoDescription);
      assert.equal(videoAfterPost.url, videoUrl);
    });

    it('does not update for invalid title', async () => {
      const videoTitle = 'Some Video';
      const videoDescription = 'A video about things and stuff.';
      const videoUrl = 'http://example.com';
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title: videoTitle, description: videoDescription, url: videoUrl});
      assert.equal(response.status, 201);
      const createdVideo = await Video.findOne({});
      const videoUpdatedTitle = '';
      const videoUpatedDescription = 'More things and stuff.';
      const videoUpdatedUrl = 'http://example.com/update';

      const updateResponse = await request(app)
        .post(`/videos/${createdVideo._id}/updates`)
        .type('form')
        .send({title: videoUpdatedTitle, description: videoUpatedDescription, url: videoUpdatedUrl});

      assert.equal(updateResponse.status, 400);
      const videoAfterPost = await Video.findById(createdVideo._id);
      assert.equal(videoAfterPost.title, videoTitle);
      assert.equal(videoAfterPost.description, videoDescription);
      assert.equal(videoAfterPost.url, videoUrl);
    });
  });
});
