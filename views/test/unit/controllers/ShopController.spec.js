import path from 'path';

describe('ShopController Spec', function() {

  var cookie;

  import sinon from 'sinon';
  before( async (done) => {
    let admin = db.User.find ({
      where: {username: 'admin'},
      include: [db.Role]
    });
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });
    sinon.stub(UserService, 'getLoginUser', (req) => {
      return admin;
    });
    return done();
  });

  it('Show one product detail', function(done) {
    request(sails.hooks.http.app)
    .get('/shop/products/1/1')
    // .set('cookie', cookie)
    .end(function(err, res) {
      res.statusCode.should.be.equal(200);
      return done(err);

    });
  });


  after( (done) => {
    UserService.getLoginState.restore();
    UserService.getLoginUser.restore();
    done();
  });

});
