describe "about Order", (done) ->

  it "create Order should be success.", (done) ->
    newOrder = {
      quantity: 10

      product: {
        name: '柚子'
        desctipt: '又大又好吃'
        price: 100
        stockQuantity: 10
        id: 1
      }

      user: {
        email: 'test@gmail.com'
        mobile: '0911-111-111'
        address: ''
        username: 'test'
      }
    }

    request(sails.hooks.http.app)
    .post("/order")
    .send(newOrder)
    .end (err, res) ->
      return done(body) if res.statusCode is 500
      res.body.success.should.be.true
      res.body.order.id.should.be.number

      done(err)

    describe "get Order status.", (done) ->

      before (done) ->
        # 要查出訂單資訊之前，可以先操作 order model 把相關測試資料建立起來
        # 如此，在 run spec 的時候才有資料可以顯示

      request(sails.hooks.http.app)
      .post("/order/status")
      .send(formdata)
      .end (err, res) ->
        return done(body) if res.statusCode is 500
        res.body.order.id.should.be.number

        done(err)
