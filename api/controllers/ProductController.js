
let ProductController = {

  debug: async (req, res) => {
    try {
      res.ok(await db.Product.findAndCountAll());
    }
    catch (error) {
      return res.serverError(error);
    }
  },

  image: async (req, res) => {
    try {
      res.ok({product: await db.Product.findById(req.param('id'))});
    }
    catch (error) {
      return res.serverError(error);
    }
  },

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

      let tags = await db.Tag.findAll();

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

      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);

      let brands = await db.Brand.findAll();
      let dpts = await DptService.findAll();

      let query = req.query;

      let productsWithCount = await ProductService.productQuery(query, offset, limit);

      // processing prices with productPriceTransPromotionPrice
      let now = new Date();
      productsWithCount = await PromotionService.productPriceTransPromotionPrice(now,productsWithCount);

      let products = productsWithCount.rows;

      let result = {
        brands,
        dpts,
        query,
        products,
        pageName: "/admin/goods",
        limit: limit,
        page: page,
        totalPages: Math.ceil(productsWithCount.count / limit),
        totalRows: productsWithCount.count
      };

      // console.log('========= Product Query Parameters =========');
      // console.log('limit = ' + limit);
      // console.log('page = ' + page);
      // console.log('offset = ' + offset);
      // console.log('count = ' + productsWithCount.count);
      // console.log(' products = ' + JSON.stringify(products,null,4));

      if (query.responseType && query.responseType.toLowerCase() == 'json') {
        return res.ok(result);
      }
      else {
        // let products = await ProductService.findAllWithImages();
        return res.view('admin/goodList', result);
      }
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

      let tags = await db.Tag.findAll();

      let gid = req.query.id;
      // console.log('=== gid ===>',gid);
      // query from productGm
      let good = await ProductService.findGmWithImages(gid);

      if (!good) {
        return res.redirect('/admin/goods');
      }

      // TODO:
      // this is hack way for make gm show, need to fixe;
      good.ProductGm = good;

      // let dptDisplay = [];

      let dptsJson = dpts.map((dpt) => dpt.toJSON());

      good.ProductGm.Dpts.forEach((productGmDpt) => {

        dptsJson.forEach((dpt) => {
          // if(!dpt.selected) dpt.selected={};
          if(dpt.id === productGmDpt.id) {
            dpt.selected = productGmDpt.id;
          }
          else return;

          let {DptSubs} = dpt;
          good.ProductGm.DptSubs.forEach((productGmDptSubs) => {
            DptSubs.forEach((dptSub) => {
              // if(!dptSub.selected) dptSub.selected={};
              if(dptSub.id === productGmDptSubs.id){
                dptSub.selected = productGmDpt.id;
              }
            });
          });
        });
      });

      let result =  {
        good,
        brands,
        dpts: dptsJson,
        tags
      };

      let query = req.query;

      if (query.responseType && query.responseType.toLowerCase() == 'json') {
        return res.ok(result);
      }else{
        // have to query this is
        return res.view('admin/goodUpdate',result);
      }
    } catch (e) {
      console.error(e.stack);
      res.serverError(e);
    }
  },

  doUpdate: async (req, res) => {
    let productUpdate = req.body;
    // console.log('=== ProductContoller : productUpdate ==>\n', productUpdate);
    try {
      let result = await ProductService.update(productUpdate);
      let query = req.query.responseType;
      if (query && query.toLowerCase() == 'json')
        return res.ok(result);
      else
        return res.redirect('/admin/goods/');
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
    // return res.json(newProduct);
  },

  doCreate: async (req, res) => {
    let newProduct = req.body;
    console.log('----------');
    console.log(newProduct);
    console.log('----------');
    try {
      let result = await ProductService.create(req.body);
      let query = req.query.responseType;
      if (query && query.toLowerCase() == 'json')
        return res.ok(result);
      else
        return res.redirect('/admin/goods/');
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
    // return res.json(newProduct);
  },

  // delete
  doDelete: async (req, res) => {
    try {
      let productGmId = req.body.id;
      let jsonOut = req.body.jsonOut;
      let productDelete = await ProductService.delete(productGmId);
      if(jsonOut){
        return res.ok(productDelete.toJSON());
      }
      return res.redirect('/admin/goods/');
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end delete

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
