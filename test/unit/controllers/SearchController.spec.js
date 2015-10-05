describe('search function', () => {

  it('search "好" should has data', async (done) => {
    try {
      let result = await request(sails.hooks.http.app).get('/search?q=好');
      done();

    } catch (e) {
      docne(e);
    }


  });
});