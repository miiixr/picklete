
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
                    console.log('res.body', res.body);
                    brand = res.body;
                    res.body.name.should.be.equal('好棒棒品牌');
                    res.body.avatar.should.be.equal('http://goo.gl/ksTMyn');
                    res.body.type.should.be.equal('PRIME_GOOD');
                    res.body.desc.should.be.equal('Steve Aoki 最棒惹');
                    res.body.banner.should.be.equal('http://goo.gl/tl4513');
                    res.body.photos.should.be.a('array');

                    return done();
                });
        });

    });

    describe('Brand - 列表', function() {

        it('should return brand list', function(done) {
            request(sails.hooks.http.app)
                .get('/admin/brand')
                .end(function(err, res) {
                    console.log('res.body', res.body);
                    res.body.should.be.a('array');
                    return done();
                });
        });

    });

    describe('Brand - 更新', function() {

        it('should return updated brand object', function(done) {
            request(sails.hooks.http.app)
                .put('/admin/brand/' + brand.id)
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