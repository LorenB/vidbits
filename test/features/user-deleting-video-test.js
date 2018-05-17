const {assert} = require('chai');

describe('User deletes video', () => {
  describe('clicks delete', () => {
    it('removes the video from the list', async () => {
      browser.url('/videos/create');
      const randomNum = Math.random();
      const videoTitle = `Random video number ${randomNum}`;
      const videoDescription = `Pretty random ${randomNum}`;
      const videoUrl = `http://example.com/${randomNum}`;
      await browser.setValue('#title-input', videoTitle);
      await browser.setValue('#description-input', videoDescription);
      await browser.setValue('#url-input', videoUrl);
      await browser.click('#submit-button');
      await browser.click('#delete');
      const urlAfterDelete = await browser.getUrl();
      assert.include(urlAfterDelete, '/videos');
      const body = await browser.getText('body');
      assert.notInclude(body, videoTitle);
      assert.notInclude(body, videoDescription);
      assert.notInclude(body, videoUrl);
    });
  });
});
