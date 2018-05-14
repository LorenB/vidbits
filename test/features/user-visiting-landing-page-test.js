const {assert} = require('chai');

const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

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
      const url = generateRandomUrl('example.com');
      const video = await Video.create({title, description, url});
      browser.url('/videos');
      const videosContainer = await browser.getText('#videos-container');
      assert.notEqual(videosContainer, '');
      assert.include(videosContainer, title);
      const titleLink = browser.getText(`iframe[src="${url}"]`);
      assert.ok(titleLink !== null);
    });

    it('User visiting landing page with an existing video can navigate to a video', async () => {

      const title = 'Some title';
      const description = 'Some description';
      const url = generateRandomUrl('example.com');
      const video = await Video.create({title, description, url});
      browser.url('/videos');
      const linkElems = browser.elements(`a`);
      await browser.click(`a[href="videos/${video._id}"]`);
      const titleElem = await browser.getText('.single-video-title');
      assert.include(JSON.stringify(titleElem), title);
    });
  });
});
