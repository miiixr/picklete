describe.only("about Product", () => {

  it("get product info.", (done) => {
    request(sails.hooks.http.app)
    .get("/product/1")
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.product.should.be.Object;
      res.body.product.id.should.be.number;
      res.body.product.image.should.be.String;

      done(err);

    });
  });
});
