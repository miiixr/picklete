import path from 'path';

describe('SliderActivities Spec', function() {

  var cookie;

  before(async (done) => {

    request(sails.hooks.http.app)
    .post('/auth/local')
    .send({ identifier: 'admin', password: 'admin' })
    .end(function (err, res) {
      cookie = res.headers['set-cookie'];
      return done();
    });
    // done();

  });


  it('should return new brand object', function(done) {

    request(sails.hooks.http.app)
    .post('/admin/slider/create')
    .set('cookie', cookie)
    .field('test', 'test')
    .end(function(err, res) {
      console.log('-----------------------');
      console.log('* hello world spec')
      console.log('-----------------------');

      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/');

      return done();
    });
  });

});
