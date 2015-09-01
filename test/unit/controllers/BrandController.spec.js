
describe('Brand API - 品牌', function() {

    var brand;

    describe('Brand - 建立', function() {

        it('should return new brand object', function(done) {
            request(sails.hooks.http.app)
                .post('/admin/brand')
                .send({
                    name: '好棒棒品牌',
                    avatar: 'http://goo.gl/ksTMyn',
                    type: 'PRIME_GOOD',
                    desc: 'Steve Aoki 最棒惹',
                    banner: 'http://goo.gl/tl4513',
                    photos: [
                        'http://goo.gl/IRT1EM',
                        'http://goo.gl/p9Y2BF'
                    ]
                })
                .end(function(err, res) {
                  res.statusCode.should.be.equal(302);
                  res.headers.location.should.be.equal('/admin/brands');

                  return done();
                });
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

        it('should return updated brand object', (done) => {

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
