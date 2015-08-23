describe("about Order", () => {
  describe.only("create Order", () => {

    let testProducts = [];

    before(async (done) => {
      let productOne = {
        name: '泡麵',
        description: '就泡麵',
        stockQuantity: 5,
        price: 5
      };

      let productTwo = {
        name: '糖果',
        description: '就糖果',
        stockQuantity: 5,
        price: 10
      };

      testProducts.push(await db.Product.create(productOne));
      testProducts.push(await db.Product.create(productTwo));

      done();

    });

    it("should be success.", (done) => {
      let orderItemOne = {
        name: testProducts[0].name,
        description: testProducts[0].description,
        price: 1,
        quantity: 1,
        spec: testProducts[0].spec,
        ProductId: testProducts[0].id
      };

      let orderItemTwo = {
        name: testProducts[1].name,
        description: testProducts[1].description,
        price: 1,
        quantity: 1,
        spec: testProducts[1].spec,
        ProductId: testProducts[1].id
      };

      let newOrder = {
        quantity: 10,
        orderItem: [
          orderItemOne,
          orderItemTwo
        ],
        user: {
          email: 'smlsun@gmail.com',
          mobile: '0911-111-111',
          address: 'addres',
          username: 'test'
        },
        shipment: {
          username: '收件者',
          mobile: '0922-222-222',
          taxId: '123456789',
          email: 'smlsun@gmail.com',
          address: '收件者的家'
        }
      };

      request(sails.hooks.http.app).post("/api/order").send({
        order: newOrder
      }).end((err, res) => {
        if (res.statusCode === 500) {
          return done(err);
        }
        res.body.success.should.be["true"];
        res.body.order.id.should.be.number;
        res.body.shipment.id.should.be.number;
        res.body.user.id.should.be.number;
        res.body.product.id.should.be.number;
        return done();
      });
    });
  });
  describe("get Order status.", () => {
    before( async (done) => {
      let newUser = {
        username: "testOrderUser",
        email: "testOrderUser@gmail.com",
        password: "testuser"
      };

      let createdUser = await db.User.create(newUser);

      let newOrder = {
        quantity: 10,
        SerialNumber: '11223344',
        UserId: createdUser.id
      };

      await db.Order.create(newOrder)
      done();

    });
    it("get Order status should be success.", function(done) {

      let formdata = {
        SerialNumber: '11223344',
        email: 'testOrderUser@gmail.com'
      };

      request(sails.hooks.http.app).post("/api/order/status").send(formdata).end(function(err, res) {
        if (res.statusCode === 500) {
          return done(body);
        }
        res.body.order.id.should.be.number;
        res.body.order.SerialNumber.should.be.String;
        return done(err);

      });
    });
  });
});
