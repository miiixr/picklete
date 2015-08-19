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
      return res.view();
    } catch (error) {
      return res.serverError(error);
    }
  },

  addProduct: async (req, res) => {
    try{
      let newProduct = req.body;
      let addProduct = await db.Product.create(newProduct);
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

  delete: async (req, res) => {
    try{
      let productId = req.param("id");
      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        return res.serverError({
          msg: '找不到商品！ 請確認商品ID！'
        });
      }
      await findProduct.destroy();
      let ensureDelete = await db.Product.findById(productId);
      console.log("ensureDelete -->",ensureDelete);
      if(ensureDelete) {
        return res.serverError({msg: 'delete失敗'});
      }
      // var query = req.query.responseType;
      // if(query == undefined || query.toLowerCase() == 'json'){
      //   return res.ok(findProduct.toJSON());
      // }
      return res.redirect('product/index/');
    }catch(error){
      return res.serverError(error);
    }
  },

  publish: async (req, res) => {
    try{
      let productId = req.param("id");
      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        return res.serverError({
          msg: '找不到商品！ 請確認商品ID！'
        });
      }
      findProduct.isPublish = true;
      let updateProduct = await findProduct.save();
      if(!updateProduct) {
        return res.serverError({msg: '上架失敗'});
      }
      var query = req.query.responseType;
      if(query == undefined || query.toLowerCase() == 'json'){
        return res.ok(updateProduct.toJSON());
      }
      let url = "product/show/" + productId;
      return res.redirect(url);
    }catch(error){
      return res.serverError(error);
    }
  },

  unpublish: async (req, res) => {
    try{
      let productId = req.param("id");
      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        return res.serverError({
          msg: '找不到商品！ 請確認商品ID！'
        });
      }
      findProduct.isPublish = false;
      let updateProduct = await findProduct.save();
      if(!updateProduct) {
        return res.serverError({msg: '下架失敗'});
      }
      var query = req.query.responseType;
      if(query == undefined || query.toLowerCase() == 'json'){
        return res.ok(updateProduct.toJSON());
      }
      let url = "product/show/" + productId;
      return res.redirect(url);
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

      findProduct.name = req.body.order.name
      findProduct.description = req.body.order.description
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
