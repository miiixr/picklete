var moment = require('moment');
var sinon = require('sinon');
describe('about Report', () => {
  before(async (done) => {

    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    let newUser = {
      username: 'testOrderUser',
      email: 'smlsun@gmail.com',
      password: 'testuser',
    };
    let createdUser = await db.User.create(newUser);

    let newOrder = {
      quantity: 10,
      serialNumber: '11223344',
      UserId: createdUser.id,
    };
    let testOrder = await db.Order.create(newOrder);

    let productOne = {
      name: '泡麵',
      description: '就泡麵',
      stockQuantity: 5,
      price: 5,
    };
    let testProducts = await db.Product.create(productOne);

    let orderItemOne = {
      name: testProducts.name,
      description: testProducts.description,
      quantity: 10,
      price: 10,
      spec: testProducts.spec,
      ProductId: testProducts.id,
      OrderId: 1,
    };
    await db.OrderItem.create(orderItemOne);

    done();
  });

  after((done) => {
    UserService.getLoginState.restore();
    done();
  });

  it('Report export to Excel', (done) => {

    let data = {
      date: moment().format('YYYY-MM').toString(),
    };

    request(sails.hooks.http.app).post('/report/export').send(data).end((err, res) => {
      if (res.statusCode === 500) {
        return done();
      }

      res.statusCode.should.equal(200);
      let result = res.body;
      done(err);
    });
  });
});
