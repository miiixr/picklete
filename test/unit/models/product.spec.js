describe.only("about prodcut model operation.", () => {

  it('create product', async (done) => {
    let newProduct = {
      name: '柚子',
      descript: '又大又好吃'
    };

    let createdProduct = await db.Product.create(newProduct);

    createdProduct.name.should.be.String;
    done();

  });

  it('read all product', async (done) => {
    try {
      let allProducts = await db.Product.findAll();
      allProducts.should.be.Array;
      done();

    } catch (e) {
      done(e);
    }

  });

  it('find product id = 1', async (done) => {
    try {
      let theProduct = await db.Product.findById(1);
      console.log(theProduct);
      theProduct.should.be.Object;
      theProduct.id.should.be.equal(1);
      done();
    } catch (e) {
      done(e);
    }
  });


  it('update product', async (done) => {
    try {
      let theProduct = await db.Product.findById(1);
      theProduct.name='product name change'
      theProduct = await theProduct.save();
      theProduct.should.be.Object;
      theProduct.name.should.be.equal('product name change');
      done();
    } catch (e) {
      done(e);
    }
  });

  it('destroy product', async (done) => {
    try {
      let theProduct = db.Product.findById();
      let theProduct = db.Product.dustory();
      let afterDestroyProductFindAgain = null /?
      (afterDestroyProductFindAgain === null).should.be.true;
      done();
    } catch (e) {
      done(e);
    }
  });
});
