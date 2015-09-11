describe("about Order", () => {
  describe("create Order", () => {
    it("order", (done) => {
      let newOrder ={
        orderItems:
         [ { ProductId: '1', price: '475', quantity: '1' },
           { ProductId: '2', price: '590', quantity: '2' },
           { ProductId: '3', price: '710', quantity: '1' }],
        paymentTotalAmount: '565',
        user:
         { username: 'AAAd',
           email: 'user1@picklete.localhost',
           mobile: '0912345678',
           city: '苗栗縣',
           district: '竹南鎮',
           zipcode: '350',
           address: '測試用地址不用太在意' },
        shipment:
         { username: 'AAAd',
           email: 'user1@picklete.localhost',
           mobile: '0912345678',
           city: '苗栗縣',
           district: '竹南鎮',
           zipcode: '350',
           address: '測試用地址不用太在意' },
        usedDiscountPoint: 'false' };

      request(sails.hooks.http.app).post("/api/order").send({
        order: newOrder
      }).end((err, res) => {
        if (res.statusCode === 500) {
          return done(err);
        }
        console.log("!!!",res.body);
        res.body.success.should.be["true"];
        res.body.order.Shipment.id.should.be.number;
        res.body.order.User.id.should.be.number;
        res.body.products.forEach((product) => product.id.should.be.number);
        res.body.order.OrderItems.forEach((orderItem) => orderItem.id.should.be.number);
        return done();
      });
    });

    it.only("payorder", (done) => {
      let newOrder ={
        orderItems:
         [ { ProductId: '1', price: '475', quantity: '1' },
           { ProductId: '2', price: '590', quantity: '2' },
           { ProductId: '3', price: '710', quantity: '1' }],
        paymentTotalAmount: '565',
        user:
         { username: 'AAAd',
           email: 'user1@picklete.localhost',
           mobile: '0912345678',
           city: '苗栗縣',
           district: '竹南鎮',
           zipcode: '350',
           address: '測試用地址不用太在意' },
        shipment:
         { username: 'AAAd',
           email: 'user1@picklete.localhost',
           mobile: '0912345678',
           city: '苗栗縣',
           district: '竹南鎮',
           zipcode: '350',
           address: '測試用地址不用太在意' },
        usedDiscountPoint: 'false' };

      request(sails.hooks.http.app).post("/api/payorder").send({
        order: newOrder
      }).end((err, res) => {
        if (res.statusCode === 500) {
          return done(err);
        }
        console.log('!!!',res.body)
        res.body.TradeDesc.should.be.String;
        res.body.TotalAmount.should.be.number;
        res.body.ChoosePayment.name.should.be.String;
        return done();
      });
    });
  });
  describe("about Order status.", () => {
    let testOrder = {};
    before( async (done) => {
      let newUser = {
        username: "testOrderUser",
        email: "smlsun@gmail.com",
        password: "testuser"
      };

      let createdUser = await db.User.create(newUser);

      let newOrder = {
        quantity: 10,
        serialNumber: '11223344',
        UserId: createdUser.id
      };

      testOrder = await db.Order.create(newOrder);
      done();

    });

    let syncLink = '';

    it("request order sync.", (done) => {
      request(sails.hooks.http.app)
      .get("/api/order/sync?email=smlsun@gmail.com&host=/api/order/status")
      .end((err, res) => {
        let result = res.body;

        result.syncLink.should.be.String;
        result.syncLinkHost.should.be.equal('/api/order/status');
        result.syncLinkParams.should.be.String;
        result.success.should.be.true;
        syncLink = result.syncLink;
        console.log('syncLink', syncLink);

        done();

      });
    });

    it("get Order status should be success.", (done) => {
      console.log('=== syncLink ===\n', syncLink);
      // ex: /api/order/status?token=...&email=smlsun@gmail.com
      request(sails.hooks.http.app)
      .get(syncLink)
      .end((err, res) => {
        let {purchaseHistory} = res.body;

        console.log('purchaseHistory', purchaseHistory);

        purchaseHistory.should.be.Array;
        purchaseHistory[0].should.be.Object;
        purchaseHistory[0].OrderItems.should.be.Object;
        // purchaseHistory[0].Shipemnt.should.be.Object;
        purchaseHistory[0].User.should.be.Object;


        return done(err);
      });
    });

    it("update order status to paymentConfirm. ", async (done) => {
      request(sails.hooks.http.app)
      .get(`/order/statusUpdate/${testOrder.id}?status=paymentConfirm`)
      .end(async (err, res) => {
        let order = await db.Order.findById(testOrder.id);
        order.status.should.be.equal('paymentConfirm');

        done(err);
      });
    });

    it("update order status to deliveryConfirm. ", async (done) => {
      request(sails.hooks.http.app)
      .get(`/order/statusUpdate/${testOrder.id}?status=deliveryConfirm`)
      .end(async (err, res) => {
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        res.body.products.should.be.Array;

        done(err);
      });
    });

    it("get an order. ", async (done) => {
      request(sails.hooks.http.app)
      .get(`/order/find/${testOrder.id}`)
      .end(async (err, res) => {
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        res.body.order.status.should.be.String;
        done(err);
      });
    });

    it("get an Bonus point. ", async (done) => {
      request(sails.hooks.http.app)
      .get("/order/bonus?email=user1@picklete.localhost")
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
});
