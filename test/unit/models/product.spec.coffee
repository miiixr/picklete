describe.only "about prodcut model operation.", () ->
  it 'create product', (done) ->

    newProduct = {
      name: '柚子'
      desctipt: '又大又好吃'
    }

    db.Product.create(newProduct).then (createdProduct) ->
      createdProduct.name.should.be.String

      done();
