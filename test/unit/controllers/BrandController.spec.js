
import path from 'path';
import sinon from 'sinon';

describe('Brand API - 品牌', function() {

  var brand, cookie;

  before(function (done) {
    // simulate login
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    done();
  });

  after((done) => {
    // end this simulated login
    UserService.getLoginState.restore();
    done();
  });


  it('should return new brand object', function(done) {
    // var avatar = path.join(process.cwd(), './test/unit/resources/avatar.jpg');
    // var brand = path.join(process.cwd(), './test/unit/resources/brand.jpg');
    // var banner = path.join(process.cwd(), './test/unit/resources/brand.jpg');
    // var photos1 = path.join(process.cwd(), './test/unit/resources/photos1.jpg');
    // var photos2 = path.join(process.cwd(), './test/unit/resources/photos2.jpg');

    request(sails.hooks.http.app)
    .post('/admin/brands/create')
    // .set('cookie', cookie)
    .field('name', '好棒棒品牌')
    .field('type', 'PRIME_GOOD')
    .field('desc', 'Steve Aoki 最棒惹')
    .field('avatar', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('banner', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('photos', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('photos', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('photos', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('photos', 'http://i.imgur.com/YPP0gFO.jpg')
    .end(function(err, res) {
      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/brands');

      return done();
    });
  });


  it('should return update brand object', function(done) {
    // var avatar = path.join(process.cwd(), './test/unit/resources/avatar.jpg');
    // var brand = path.join(process.cwd(), './test/unit/resources/brand.jpg');
    // var banner = path.join(process.cwd(), './test/unit/resources/brand.jpg');
    // var photos1 = path.join(process.cwd(), './test/unit/resources/photos1.jpg');
    // var photos2 = path.join(process.cwd(), './test/unit/resources/photos2.jpg');

    request(sails.hooks.http.app)
    .post('/admin/brands/update?id=3')
    // .set('cookie', cookie)
    .field('name', '好棒棒品牌 科科')
    .field('type', 'PRIME_GOOD')
    .field('desc', 'Kerker update 惹')
    .field('avatar', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('banner', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('photos', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('photos', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('photos', 'http://i.imgur.com/YPP0gFO.jpg')
    .field('photos', 'http://i.imgur.com/YPP0gFO.jpg')
    .end(function(err, res) {
      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/brands');

      return done();
    });
  });

  describe('Brand - 列表', function() {

      it('should return brand list', function(done) {
          request(sails.hooks.http.app)
              .get('/admin/brand')
              .end(function(err, res) {

                  res.text.should.be.String;
                  (res.text !== '').should.be.true;

                  return done();
              });
      });

  });

  describe('Brand - 列表順序重設', function() {
    it('should return brand list', function(done) {
      var idArray = [[{id:3},{id:4}],[{id:1},{id:2}]];
      request(sails.hooks.http.app)
        .put('/admin/brands/resetWeight')
        .send({ data: idArray})
        .end((err, res) => {
          db.Brand.findById(3).then((brand) => {
            brand.weight.should.be.equal(1);
          });

          return done();
        });
    });

  });
});
