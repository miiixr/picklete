describe("about prodcut model operation.", () => {
  let createdProduct = null;
  it('create product', async (done) => {
    let newProduct = {
      name: '柚子',
      descript: '又大又好吃'
    };

    createdProduct = await db.Product.create(newProduct);

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

  it('find product id = createdProduct.id', async (done) => {
    try {
      let theProduct = await db.Product.findById(createdProduct.id);
      theProduct.should.be.Object;
      theProduct.id.should.be.equal(createdProduct.id);
      done();
    } catch (e) {
      done(e);
    }
  });


  it('update product', async (done) => {
    try {
      let theProduct = await db.Product.findById(createdProduct.id);
      theProduct.name='product name change'
      theProduct = await theProduct.save();
      theProduct.should.be.Object;
      theProduct.name.should.be.equal('product name change');
      done();
    } catch (e) {
      done(e);
    }
  });

  it('destroy product', async (done,err) => {
    try {
      let theProduct = await db.Product.findById(createdProduct.id);
      if (!theProduct){
        done();
      }
      console.log(theProduct);
      await theProduct.destroy();
      let afterDestroyProductFindAgain = await db.Product.findById(createdProduct.id);
      (afterDestroyProductFindAgain === null).should.be.true;
      done();
    } catch (e) {
      done(e);
    }
  });
});
