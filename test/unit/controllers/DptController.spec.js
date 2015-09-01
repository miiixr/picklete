
describe('Dpt API - 館別', function() {

  var DptQ;
  var DptSubA;
  var DptSubB;

  before(async function(done) {

    DptQ = await (db.Dpt.create({
      name: '館別Q',
      weight: 8,
      official: true,
    }));

    DptSubA = await (db.DptSub.create({
      name: '小館別A',
      weight: 2,
      official: true,
      DptId: DptQ.id
    }));

    DptSubB = await (db.DptSub.create({
      name: '小館別B',
      weight: 3,
      official: false
    }));

    done();
  });

  describe('Dpt - 建立', function() {
    it('should return Dpt object', function(done) {
      request(sails.hooks.http.app)
        .post('/admin/dpt')
        .send({
          name: '館別A',
          weight: 1,
          official: true
        })
        .end(function(err, res) {
          console.log('res.body', res.body);
          res.body.name.should.be.equal('館別A');
          res.body.weight.should.be.equal(1);
          res.body.official.should.be.equal(true);
          return done();
        });
    });
  });

  describe('Dpt - 建立', function() {
    it('should return Dpt object', function(done) {
      request(sails.hooks.http.app)
        .post('/admin/dpt')
        .send({
          name: '館別B',
          weight: 3,
          official: false
        })
        .end(function(err, res) {
          console.log('res.body', res.body);
          res.body.name.should.be.equal('館別B');
          res.body.weight.should.be.equal(3);
          res.body.official.should.be.equal(false);
          return done();
        });
    });
  });

  describe('Dpt - 建立', function() {
    it('should return Dpt object', function(done) {
      request(sails.hooks.http.app)
        .post('/admin/dpt')
        .send({
          name: '館別C',
          weight: 2,
          official: false
        })
        .end(function(err, res) {
          console.log('res.body', res.body);
          res.body.name.should.be.equal('館別C');
          res.body.weight.should.be.equal(2);
          res.body.official.should.be.equal(false);
          return done();
        });
    });
  });

  describe('Dpt - 列表', function() {
    it('should return Dpt object', function(done) {
      request(sails.hooks.http.app)
        .get('/admin/dpt')
        .end(function(err, res) {
          console.log('res.body', res.body);
          res.body.should.be.a('array');
          return done();
        });
    });
  });

});