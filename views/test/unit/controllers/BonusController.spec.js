var sinon = require('sinon');

describe('Bonus', () => {
  let testBonus=null;
  before(async (done) => {
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });
    let bonuspoint={
        remain: 100,
        used: 500,
        email: 'uniTestBonus@picklete.local'
      }
    testBonus = await db.BonusPoint.create(bonuspoint);

    done();
  });

  after((done) => {
    UserService.getLoginState.restore();
    done();
  });

  it('create', (done) => {
    request(sails.hooks.http.app)
      .post('/admin/bonus')
      .send({
        remain: 100,
        used: 30,
        email: 'user999@picklete.local'
      })
      .end((err, res) => {
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        res.body[0].remain.should.be.equal(100);
        res.body[0].used.should.be.equal(30);
        res.body[0].email.should.be.equal("user999@picklete.local");
        return done();
      })
  });

  it('update', (done) => {
    request(sails.hooks.http.app)
      .put(`/admin/bonus/${testBonus.email}`)
      .send({
        remain: testBonus.remain-50,
        used: testBonus.used+50,
      })
      .end((err, res) => {
        console.log('res.body', res.body);
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        res.body.remain.should.be.equal(testBonus.remain-50);
        res.body.used.should.be.equal(testBonus.used+50);
        res.body.email.should.be.equal(testBonus.email);
        return done();
      })
  });

  it("get a Bonus point. ", async (done) => {
    request(sails.hooks.http.app)
    .get("/order/bonus?email=uniTestBonus@picklete.local")
    .end(async (err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.bonusPoint.used.should.be.number;
      res.body.bonusPoint.remain.should.be.number;
      res.body.bonusPoint.email.should.be.String;
      done(err);
    });
  });


});
