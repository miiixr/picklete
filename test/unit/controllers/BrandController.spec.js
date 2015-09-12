
import path from 'path';

describe('Brand API - 品牌', function() {

  var brand, cookie;

  before(function (done) {
    request(sails.hooks.http.app)
    .post('/auth/local')
    .send({ identifier: 'admin', password: 'admin' })
    .expect(302)
    .end(function (err, res) {
      cookie = res.headers['set-cookie'];
      return done();
    });
  });

  it('should return new brand object', function(done) {
    // var avatar = path.join(process.cwd(), './test/unit/resources/avatar.jpg');
    // var brand = path.join(process.cwd(), './test/unit/resources/brand.jpg');
    // var banner = path.join(process.cwd(), './test/unit/resources/brand.jpg');
    // var photos1 = path.join(process.cwd(), './test/unit/resources/photos1.jpg');
    // var photos2 = path.join(process.cwd(), './test/unit/resources/photos2.jpg');

    request(sails.hooks.http.app)
    .post('/admin/brands')
    .set('cookie', cookie)
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
    .set('cookie', cookie)
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

  describe('Brand - 更新', function() {
      before(async (done) => {
        brand = await db.Brand.find({where: {name: '好棒棒品牌'}});
        done();
      });

      it.skip('should return updated brand object', (done) => {

          request(sails.hooks.http.app)
              .put(`/admin/brand/${brand.id}`)
              .send({
                  name: '我更改了這個品牌',
                  avatar: 'http://goo.gl/ksTMyn',
                  type: 'PRIME_GOOD',
                  desc: 'Nicky Remero 也不錯',
                  banner: 'http://goo.gl/tl4513',
                  photos: [
                      'http://goo.gl/IRT1EM'
                  ]
              })
              .end(function(err, res) {
                  console.log('res.body', res.body);
                  res.body.name.should.be.equal('我更改了這個品牌');
                  res.body.desc.should.be.equal('Nicky Remero 也不錯');
                  res.body.photos.length.should.be.equal(1);
                  return done();
              });
      });

  });

});
