var sinon = require('sinon');

describe('Add Purchase', () => {
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

  it('update reducePrice', (done) => {
    request(sails.hooks.http.app)
      .put(`/admin/buymoreUpdate`)
      .send({
         limit: '0',
          type: 'reduce',
          startDate: '2015-09-10',
          endDates: '2015-09-30',
          reducePrice: '1000',
          discount: '',
          productIds: [ '1', '3' ]
      })
      .end((err, res) => {
        console.log('res.body', res.body);
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        return done();
      })
  });

  it('update reducePrice', (done) => {
    request(sails.hooks.http.app)
      .put(`/admin/buymoreUpdate`)
      .send({
        limit: '0',
        startDate: '2015-09-17',
        endDates: '2015-09-30',
        reducePrice: '',
        type: 'discount',
        discount: '9',
        productIds: [ '1', '3' ]
      })
      .end((err, res) => {
        console.log('res.body', res.body);
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        return done();
      })
  });

});
