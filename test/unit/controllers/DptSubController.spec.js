
describe('DptSub - 建立', function() {

  var DptFoo;

  before(async function(done) {

    DptFoo = await (db.Dpt.create({
      name: 'Foo',
      weight: 20,
      official: true,
    }));

    return done();
  });

  describe('DptSub - 建立', function() {
    it('should return DptSub object', function(done) {
      request(sails.hooks.http.app)
        .post('/admin/dpt_sub')
        .send({
          name: 'Foo Sub A',
          weight: 4,
          official: false,
          DptId: DptFoo.id
        })
        .end(function(err, res) {
          console.log('res.body', res.body);
          res.body.name.should.be.equal('Foo Sub A');
          res.body.weight.should.be.equal(4);
          res.body.official.should.be.equal(false);
          res.body.DptId.should.be.equal(DptFoo.id);
          return done();
        })
    });
  });

  describe('DptSub - 建立', function() {
    it('should return DptSub object', function(done) {
      request(sails.hooks.http.app)
        .post('/admin/dpt_sub')
        .send({
          name: 'Foo Sub B',
          weight: 2,
          official: true,
          DptId: DptFoo.id
        })
        .end(function(err, res) {
          console.log('res.body', res.body);
          res.body.name.should.be.equal('Foo Sub B');
          res.body.weight.should.be.equal(2);
          res.body.official.should.be.equal(true);
          res.body.DptId.should.be.equal(DptFoo.id);
          return done();
        });
    });
  });

  describe('DptSub - 列表', function() {
    it('should return DptSub list', function(done) {
      request(sails.hooks.http.app)
        .get('/admin/dpt_sub')
        .end(function(err, res) {
          console.log('res.body', res.body);
          res.body.should.be.a('array');
          return done();
        });
    });
  });

});