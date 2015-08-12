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
      return res.ok(addProduct.toJSON());
    }catch(error){
      return res.serverError(error);
    }
  },

  updateProduct: async (req, res) => {

    try {
      let productId = req.param("productId");

      // Missing where attribute in the options parameter passed to update.
      // let findProduct = await db.Product.update({ id : productId },{ name : '斗六文旦柚禮盒123123' });

      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        return res.serverError({
          msg: '找不到商品！ 請確認商品ID！'
        });
      }

      findProduct.name = req.body.order.name
      findProduct.descript = req.body.order.descript
      findProduct.stockQuantity = req.body.order.stockQuantity
      findProduct.price = req.body.order.price

      let updateInfo = await findProduct.save();

      if(!updateInfo) {
        return res.serverError({msg: '更新失敗'});
      } else {
        return res.ok(findProduct.toJSON());
      }

    } catch (error) {
      return res.serverError(error);
    }
  }
};

module.exports = ProductController;
