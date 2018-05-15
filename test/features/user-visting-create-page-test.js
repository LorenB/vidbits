const {assert} = require('chai');

describe('User visits create page', () => {
  describe('adds video', () => {
    it('renders video on the landing page', () => {
      browser.url('/videos/create');
      const videoTitle = 'Best video ever!';
      const videoDescription = 'Soooo good.';
      const videoUrl = 'http://example.com';
      browser.setValue('#title-input', videoTitle);
      browser.setValue('#description-input', videoDescription);
      browser.setValue('#url-input', videoUrl);
      browser.click('#submit-button');
      assert.include(browser.getText('body'), videoTitle);
      assert.include(browser.getText('body'), videoDescription);
      assert.include(browser.getText('body'), videoUrl);
    });
  });
});
