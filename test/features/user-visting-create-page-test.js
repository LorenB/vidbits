const {assert} = require('chai');

describe('User visits create page', () => {
  describe('adds video', () => {
    it('renders video on the landing page', () => {
      browser.url('/videos/create.html');
      const videoTitle = 'Best video ever!';
      const videoDescription = 'Soooo good.';
      browser.setValue('#title-input', videoTitle);
      browser.setValue('#desciption-input', videoDescription);
      browser.click('#submit-button');
      assert.include(browser.getText('body'), videoTitle);
      assert.include(browser.getText('body'), videoDescription);
    });
  });
});
