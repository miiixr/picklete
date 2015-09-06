
let ProductController = {

  // show create page and prepare all stuff
  showCreate: async (req, res) => {
    // let products = await ProductService.findAllWithImages();
    try {
      let brands = await db.Brand.findAll({
        where: {
          type: {$ne: 'OTHER'}
        }
      });

      let dpts = await db.Dpt.findAll({
        include: [{
          model: db.DptSub
        }],
        order: ['Dpt.weight', 'DptSubs.weight']
      });

      let tags = await db.Tag.findAll({
        limit: 15
      });

      return res.view('admin/goodCreate', {
        brands,
        dpts,
        tags,
        pageName: '/admin/goods/create'
      });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  // list all goods result, include query items
  list: async (req, res) => {
    try {
      let brands = await db.Brand.findAll();
      let dpts = await db.Dpt.findAll({
        include: [{
          model: db.DptSub
        }],
        order: ['Dpt.weight', 'DptSubs.weight']
      });

      let products = await ProductService.productQuery(req),
          query = req.query;

      // let products = await ProductService.findAllWithImages();
      return res.view('admin/goodList', {
        brands,
        dpts,
        query,
        products,
        pageName: "/admin/goods"
      });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  showUpdate: async (req, res) => {
    // let products = await ProductService.findAllWithImages();
    try {
      let brands = await db.Brand.findAll();
      let dpts = await db.Dpt.findAll({
        include: [{
          model: db.DptSub
        }],
        order: ['weight', 'DptSubs.weight']
      });
      let tags = await db.Tag.findAll({
        limit: 15
      });

      let gid = req.query.id;
      let good = await ProductService.findWithImages(gid);


      if (!good) {
        return res.redirect('/admin/goods');
      }

      // have to query this is
      return res.view('admin/goodUpdate', {
        good,
        brands,
        dpts,
        tags
      });

    } catch (e) {
      console.error(e.stack);
      res.serverError(e);

    }
  },

  doUpdate: async (req, res) => {

    let productUpdate = req.body;

    console.log('=== productUpdate ===', productUpdate);

    try {

      await ProductService.update(productUpdate);
      return res.redirect('/admin/goods/');
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }

    // return res.json(newProduct);
  },

  createUpdate: async (req, res) => {
    let newProduct = req.body;
    console.log(newProduct);
    try {
      await ProductService.createProduct(req);
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
    return res.redirect('/admin/goods/');
    // return res.json(newProduct);
  },





  findOne: async (req, res) => {
    try {
      let productId = req.param("productId");
      let product = await ProductService.findWithImages(productId);
      return res.ok({
        product
      });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  find: async (req, res) => {

    try {
      let products = await ProductService.findAllWithImages();
      return res.ok({
        products
      });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }

  },

  index: async (req, res) => {

    try {
      let products = await ProductService.findAllWithImages();
      return res.view({
        products
      });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  show: async (req, res) => {

    try {
      let productId = req.param("id");
      let product = await ProductService.findWithImages(productId);
      return res.view({
        product
      });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  create: async (req, res) => {
    return res.view('product/create');
  },

  edit: async (req, res) => {

    try {
      let productId = req.param("id");
      let product = await ProductService.findWithImages(productId);
      return res.view({
        product
      });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  add: async (req, res) => {
    try {
      let newProduct = req.body.product;
      let addProduct = await db.Product.create(newProduct);
      if (!addProduct) {
        throw new Error('找不到商品！ 請確認商品ID！');
      }
      var query = req.query.responseType;
      if (!query || query.toLowerCase() == 'json') {
        return res.ok(addProduct.toJSON());
      } else {
        return res.redirect('product/index');
      }
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  delete: async (req, res) => {
    try {
      let productId = req.param("id");
      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        throw new Error('找不到商品！ 請確認商品ID！');
      }
      await findProduct.destroy();
      let ensureDelete = await db.Product.findById(productId);
      if (ensureDelete) {
        throw new Error('delete失敗');
      }
      return res.redirect('product/index');
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  publish: async (req, res) => {
    try {
      let productId = req.param("id");
      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        throw new Error('找不到商品！ 請確認商品ID！');
      }
      findProduct.isPublish = true;
      let updateProduct = await findProduct.save();
      if (!updateProduct){
        req.flash('message', `商品ID ${productId} 上架失敗`);
        throw new Error('上架失敗');
      }
      req.flash('message', `商品ID ${productId} 上架成功`);
      var query = req.query.responseType;
      if (query == undefined){
        res.redirect('/admin/goods');
        return
      }else if (query.toLowerCase() == 'json') {
        return res.ok(updateProduct.toJSON());
      }else if (query.toLowerCase() == 'view'){
        let url = "product/show/" + productId;
        return res.redirect(url);
      }
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  unpublish: async (req, res) => {
    try {
      let productId = req.param("id");
      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        throw new Error('找不到商品！ 請確認商品ID！');
      }
      findProduct.isPublish = false;
      let updateProduct = await findProduct.save();
      if (!updateProduct) {
        req.flash('message', `商品ID ${productId} 下架失敗`);
        throw new Error('下架失敗');
      }
      req.flash('message', `商品ID ${productId} 下架成功`);
      var query = req.query.responseType;
      if (query == undefined){
        res.redirect('/admin/goods');
        return
      }else if (query.toLowerCase() == 'json') {
        return res.ok(updateProduct.toJSON());
      }else if (query.toLowerCase() == 'view'){
        let url = "product/show/" + productId;
        return res.redirect(url);
      }
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  updateProduct: async (req, res) => {

    try {
      let productId = req.param("productId");
      let findProduct = await db.Product.findById(productId);
      if (!findProduct) {
        throw new Error('找不到商品！ 請確認商品ID！');
      }

      findProduct.name = req.body.name
      findProduct.description = req.body.description
      findProduct.stockQuantity = req.body.stockQuantity
      findProduct.price = req.body.price

      let updateInfo = await findProduct.save();

      if (!updateInfo) {
        throw new Error('更新失敗');
      } else {
        var query = req.query.responseType;
        if (!query || query.toLowerCase() == 'json') {
          return res.ok(findProduct.toJSON());
        } else {
          return res.redirect('product/show/' + productId);
        }
      }

    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  }
};

module.exports = ProductController;
