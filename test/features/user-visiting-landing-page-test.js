const {assert} = require('chai');

describe('User visits landing page', () => {
  describe('before any videos have been uplaoded', () => {
    it('render the page without videos', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), '');
    });
    it('navigates to the create page', () => {
      browser.url('/');
      browser.click('a[href="videos/create.html"]');
    });
  });

});
