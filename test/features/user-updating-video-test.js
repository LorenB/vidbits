const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

describe('User creates video', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('updates video', () => {
    it('values are changed', async () => {
      browser.url('/videos/create');
      const videoTitle = 'Best video ever!';
      const videoDescription = 'Soooo good.';
      const videoUrl = 'http://example.com';
      browser.setValue('#title-input', videoTitle);
      browser.setValue('#description-input', videoDescription);
      browser.setValue('#url-input', videoUrl);
      await browser.click('#submit-button');
      await browser.click('#edit');
      const videoTitleUpdated = 'Second best video ever!';
      browser.setValue('#title-input', videoTitleUpdated);
      await browser.click('#submit-button');

    });

    it('no new video entry is created', async () => {
      browser.url('/videos/create');
      const videoTitle = 'Pretty good video';
      const videoDescription = 'Sufficiently good.';
      const videoUrl = 'http://example.com/ok';
      browser.setValue('#title-input', videoTitle);
      browser.setValue('#description-input', videoDescription);
      browser.setValue('#url-input', videoUrl);
      await browser.click('#submit-button');

      await browser.click('#edit');
      const browserUrlForEdit = await browser.getUrl();
      const browserUrlForEditParts = browserUrlForEdit.split('/');
      const vidoeId = browserUrlForEditParts[4];

      const videoTitleUpdated = 'A truly medicore video.';
      await browser.setValue('#title-input', videoTitleUpdated);
      await browser.setValue('#description-input', videoDescription);
      await browser.setValue('#url-input', videoUrl);

      await browser.click('#submit-button');

      const browserUrlAfterEdit = await browser.getUrl();
      assert.include(browserUrlAfterEdit, vidoeId);
      const titleElem = await browser.getText('.single-video-title');
      assert.include(titleElem, videoTitleUpdated);

      const videos = await Video.find();
      assert.equal(videos.length, 1);
    });
  });
});
