var UrlHelper = require('../../../api/services/UrlHelper');

describe('Begin UrlHelper testing ...', function() {
  it('Test UrlHelper.resolve function', function() {
    try {
      console.log(UrlHelper.resolve('/test1'));
      console.log(UrlHelper.resolve('/test2'));
      console.log(UrlHelper.resolve('/test3/test'));
    } catch (e) {
      console.log(e);
    }
  });
});
