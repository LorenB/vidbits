const assert = require('chai');

describe('User creates video', () => {
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
  });
});
