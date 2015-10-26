var sinon = require('sinon');

describe('Add Purchase', () => {
  let createdProductGmComplete,createdProduct;
  before(async (done) => {
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });
    let admin = await db.User.find ({
      where: {username: 'admin'},
      include: [db.Role]
    });
    sinon.stub(UserService, 'getLoginUser', (req) => {
      return admin;
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

    createdProduct = await db.Product.create({
      name: '超值組',
      description: '讚讚讚',
      stockQuantity: '100',
      isPublish: 'true',
      price: 999,
      size: 'normal',
      service: ["express"],
      country: 'U.K',
      madeby: 'TW',
      color: 3,
      productNumber: '1-USA-2-G',
      spec: 'super-metal',
      photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg']
    });

    done();
  });

  after((done) => {
    UserService.getLoginState.restore();
    UserService.getLoginUser.restore();
    done();
  });

  it('update reducePrice', (done) => {
    request(sails.hooks.http.app)
      .put(`/admin/buymoreUpdate`)
      .send({
          activityLimit: '0',
          type: 'reduce',
          startDate: '2015-09-10',
          endDates: '2015-09-30',
          reducePrice: '1000',
          discount: '',
          productIds: [createdProduct.id]
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
        productIds: [createdProduct.id]
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
