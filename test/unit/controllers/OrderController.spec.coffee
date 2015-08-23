describe "about Order", (done) ->

  it "create Order should be success.", (done) ->
    newOrder = {
      quantity: 10

      product: {
        name: '柚子'
        description: '又大又好吃'
        price: 100
        stockQuantity: 10
        id: 1
      }

      user: {
        email: 'smlsun@gmail.com'
        mobile: '0911-111-111'
        address: 'addres'
        username: 'test'
      }

      shipment: {
        username: '收件者'
        mobile: '0922-222-222'
        taxId: '123456789'
        email: 'smlsun@gmail.com'
        address: '收件者的家'
      }
    }

    request(sails.hooks.http.app)
    .post("/api/order")
    .send({order: newOrder})
    .end (err, res) ->
      return done(err) if res.statusCode is 500
      res.body.success.should.be.true
      res.body.order.id.should.be.number
      res.body.shipment.id.should.be.number
      res.body.user.id.should.be.number
      res.body.product.id.should.be.number

      done();

  describe "get Order status.", () ->
    before (done) ->

      newUser = {
        username: "testOrderUser"
        email: "testOrderUser@gmail.com"
        password: "testuser"
      }

      console.log '=== before test create newUser==='
      db.User.create(newUser).then (newUser) ->
        console.log '=== create newOrder ==='

        newOrder = {
          quantity:10
          SerialNumber:'11223344'
          UserId:newUser.id
        }

        db.Order.create(newOrder).then (createdOrder) ->
          createdOrder.SerialNumber.should.be.String
          done()


    it "get Order status should be success.", (done) ->

      formdata = {
        SerialNumber: '11223344'
        email: 'testOrderUser@gmail.com'
      }

      request(sails.hooks.http.app)
      .post("/api/order/status")
      .send(formdata)
      .end (err, res) ->
        return done(body) if res.statusCode is 500
        console.log res.body
        res.body.order.id.should.be.number
        res.body.order.SerialNumber.should.be.String

        done(err)
