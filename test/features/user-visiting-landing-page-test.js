const {assert} = require('chai');

const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

describe('User visits landing page', () => {
  describe('before any videos have been uplaoded', () => {
    it('render the page without videos', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), '');
    });
    it('navigates to the create page', () => {
      browser.url('/');
      browser.click('a[href="videos/create"]');
    });
  });
  describe('after a vidoe(s) have been uploaded', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    it('should show a video uploaded in an iframe', async () => {
      const title = 'Some title';
      const description = 'Some description';
      const url = 'http://example.com';
      const video = await Video.create({title, description, url});
      browser.url('/videos');
      const videosContainer = await browser.getText('#videos-container');


      assert.notEqual(videosContainer, '');
      assert.include(videosContainer, title);
      // //TODO: determine if retrieving an iframes src is allowed
      // const videoIframeSrc = await browser.getAttribute('.video-card iframe', 'src');
      // assert.equal(videoIframeSrc, videoUrl);
      // assert.include(videosContainer.toString(), videoUrl);

    });
  });

});
