import path from 'path';

describe('ShopCode Spec', function() {

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


  it('List the all ShopCode', function(done) {
    request(sails.hooks.http.app)
    .get('/admin/shop-code')
    .end(function(err, res) {

      res.statusCode.should.be.equal(200);
      return done();

    });
  });



  after( (done) => {
    UserService.getLoginState.restore();
    UserService.getLoginUser.restore();
    done();
  });

});
