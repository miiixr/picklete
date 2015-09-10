var sinon = require('sinon');

describe('Bonus', () => {

  describe.only('Bonus - create', () => {

    before(async (done) => {
      sinon.stub(UserService, 'getLoginState', (req) => {
        return true;
      });
      done();
    });

    after((done) => {
      UserService.getLoginState.restore();
      done();
    });

    it('should return Bonus object', (done) => {
      request(sails.hooks.http.app)
        .post('/admin/bonus')
        .send({
          remain: 100,
          used: 30,
          email: 'user999@picklete.localhost'
        })
        .end((err, res) => {
          console.log('res.body', res.body);
          if (res.statusCode === 500) {
            return done(body)
          }
          res.statusCode.should.equal(200);
          res.body.remain.should.be.equal(100);
          res.body.used.should.be.equal(30);
          res.body.email.should.be.equal("user999@picklete.localhost");
          return done();
        })
    });
  });

});