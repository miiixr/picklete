var sinon = require('sinon');

describe('Add Purchase', () => {
  let createdProductGmComplete
  before(async (done) => {
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    createdProductGmComplete = await db.ProductGm.create({
      brandId: 1,
      name: "好東西商品",
      explain: '好東西就是要買，買買買',
      usage: '請安心服用',
      notice: '18 歲以下請勿使用',
      depId: 1,
      depSubId: 1,
      coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
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
          productIds: [createdProductGmComplete.id]
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
        productIds: [createdProductGmComplete.id]
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
