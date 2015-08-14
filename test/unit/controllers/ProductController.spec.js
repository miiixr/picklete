describe.only("about Product", () => {
  let testProduct = null;
  before(async (done) => {
    let newProduct = {
      name: '斗六文旦柚禮盒',
      description: '3斤裝',
      stockQuantity: 10,
      price: 100,
      image: 'http://localhost:1337/images/product/1.jpg'
    };
    testProduct = await db.Product.create(newProduct);
    done();

  });

  it('one', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/product/${testProduct.id}`)
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
    .get(`/api/product`)
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

  it('update', (done) => {

    var updateProduct = {
      name: '斗六文旦柚禮盒',
      description: '10斤裝',
      stockQuantity: 10,
      price: 999,
      image: 'http://localhost:1337/images/product/1.jpg'
    };

    request(sails.hooks.http.app)
    .post(`/api/product/update/${testProduct.id}`)
    .send({order: updateProduct})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      else {
        done();
      }


    });
  });


  it('add', (done) => {
    var newProduct = {
      name: 'new斗六文旦柚禮盒',
      description: '10斤裝',
      stockQuantity: 10,
      price: 999,
      image: 'http://localhost:1337/images/product/1.jpg'
    };
    request(sails.hooks.http.app)
    .post(`/api/product/`)
    .send({newProduct: newProduct})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.id.should.be.number;
      done(err);
    });
  });
});
