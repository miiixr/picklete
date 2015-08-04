describe "about Product", (done) ->

  it "get product info.", (done) ->

    request(sails.hooks.http.app)
    .get("/product/1")
    .end (err, res) ->
      return done(body) if res.statusCode is 500
      res.statusCode.should.equal 200
      res.body.product.should.be.Object
      res.body.product.id.should.be.number

      done(err)
