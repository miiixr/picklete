describe("about Product", () => {

  let testProduct = null;
  before(async (done) => {
    let newProduct = {
      name: '斗六文旦柚禮盒',
      description: '3斤裝',
      stockQuantity: 10,
      price: 100,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: 'this is a comment.'
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
      name: 'specUpdated',
      description: '10斤裝',
      stockQuantity: 10,
      price: 999,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: 'this is a comment.'
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
    var product = {
      name: 'specAdd',
      description: '10斤裝',
      stockQuantity: 10,
      price: 999,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: 'this is a comment.'
    };
    request(sails.hooks.http.app)
    .post(`/api/product/`)
    .send({product})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.name.should.equal("specAdd");
      res.body.id.should.be.number;
      done(err);
    });
  });

  it('delete', (done) => {
    request(sails.hooks.http.app)
    .delete(`/api/product/1`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(302);
      done(err);
    });
  });

  it('publish', (done) => {
    request(sails.hooks.http.app)
    .put(`/api/product/publish/${testProduct.id}`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      // res.statusCode.should.equal(302);
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.isPublish.should.equal(true);
      done(err);
    });
  });

  it('unpublish', (done) => {
    request(sails.hooks.http.app)
    .put(`/api/product/unpublish/${testProduct.id}`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      // res.statusCode.should.equal(302);
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.isPublish.should.equal(false);
      done(err);
    });
  });

});
