describe "about Order", (done) ->

  it "create Order should be success.", (done) ->
    newOrder = {
      name: '柚子'
      desctipt: '又大又好吃'
      stockQuantity: 10
      price: 100
      user: {
        username: 'test'
        email: 'test@gmail.com'
        mobile: '0911-111-111'
        address: '台灣省台灣市台灣路'
      }
    }

    request(sails.hooks.http.app)
    .post("/order/create")
    .send(newOrder)
    .end (err, res) ->
      
      return done(body) if res.statusCode is 500
      res.body.success.should.be.true
      res.body.order.id.should.be.number

      done(err)
