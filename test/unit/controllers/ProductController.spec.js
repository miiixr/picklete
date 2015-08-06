describe ("about Product", () => {

  describe("find", () => {
    let testProduct = null;
    before(async (done) => {

      let newProduct = {
        name: '斗六文旦柚禮盒',
        descript: '3斤裝',
        stockQuantity: 10,
        price: 100,
        image: 'http://localhost:1337/images/product/1.jpg'
      };

      testProduct = await db.Product.create(newProduct);

      done();

    });

    it('one', (done) => {
      request(sails.hooks.http.app)
      .get(`/product/${testProduct.id}`)
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
    it('all', (done) => {
      request(sails.hooks.http.app)
      .get(`/product`)
      .end((err, res) => {
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        res.body.products.should.be.Array;

        res.body.products.forEach(product => {
          product.image.should.be.String;
        });

        done(err);

      });
    });
  });
});
