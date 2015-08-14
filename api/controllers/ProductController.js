let ProductController = {
  findOne: async (req, res) => {
    try {
      let productId = req.param("productId");
      let product = await ProductService.findWithImages(productId);
      return res.ok({product});
    } catch (error) {
      return res.serverError(error);
    }
  },

  find: async (req, res) => {

    try {
      let products = await ProductService.findAllWithImages();
      return res.ok({products});
    } catch (error) {
      return res.serverError(error);
    }

  },

  index: async (req, res) => {

    try {
      let products = await ProductService.findAllWithImages();
      return res.view({products});
    } catch (error) {
      return res.serverError(error);
    }
  },

  show: async (req, res) => {

    try {
      let productId = req.param("id");
      let product = await ProductService.findWithImages(productId);
      return res.view({product});
    } catch (error) {
      return res.serverError(error);
    }
  },

  create: async (req, res) => {
    try {
      var product = {
        name: '斗六文旦柚禮盒',
        description: '10斤裝',
        stockQuantity: 10,
        price: 999,
        image: 'http://localhost:1337/images/product/1.jpg'
      };
      return res.view({product});
    } catch (error) {
      return res.serverError(error);
    }
  },

  edit: async (req, res) => {

    try {
      let productId = req.param("id");
      let product = await ProductService.findWithImages(productId);
      return res.view({product});
    } catch (error) {
      return res.serverError(error);
    }
  },

  addProduct: async (req, res) => {
    try{
      // create
      let newProduct = req.body;
        console.log('\n\n\nnewProduct is=>\n\n\n', newProduct);
      let addProduct = await db.Product.create(newProduct);
        console.log('\n\n\naddProduct is=>\n\n\n', addProduct);
      if(!addProduct){
        return res.serverError({
          msg: '找不到商品！ 請確認商品ID！'
        });
      }
      var query = req.query.responseType;
      if(!query || query.toLowerCase() == 'json'){
        return res.ok(addProduct.toJSON());
      }else{
        return res.redirect('product/index');
      }
    }catch(error){
      return res.serverError(error);
    }
  },

  updateProduct: async (req, res) => {

    try {
      let productId = req.param("productId");
      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        return res.serverError({
          msg: '找不到商品！ 請確認商品ID！'
        });
      }

      findProduct.name = req.body.name
      findProduct.description = req.body.description
      findProduct.stockQuantity = req.body.stockQuantity
      findProduct.price = req.body.price

      let updateInfo = await findProduct.save();

      if(!updateInfo) {
        return res.serverError({msg: '更新失敗'});
      } else {
        var query = req.query.responseType;
        if(!query || query.toLowerCase() == 'json'){
          return res.ok(findProduct.toJSON());
        }else{
          return res.redirect('product/show/'+productId);
        }
      }

    } catch (error) {
      return res.serverError(error);
    }
  }
};

module.exports = ProductController;
