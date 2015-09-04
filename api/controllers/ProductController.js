import moment from "moment";

let ProductController = {

  // show create page and prepare all stuff
  showCreate: async (req, res) => {
    // let products = await ProductService.findAllWithImages();
    try {
      let brands = await db.Brand.findAll();
      let dpts = await db.Dpt.findAll({
          include: [{
            model: db.DptSub
          }],
          order: ['Dpt.weight', 'DptSubs.weight']
        });

      let tags = await db.Tag.findAll({ limit: 15});

      return res.view('admin/goodCreate', {
        brands,
        dpts,
        tags,
        pageName: '/admin/goods/create'
      });
    } catch (error) {
      return res.serverError(error);
    }
  },

  // list all goods result, include query items
  list: async (req,res) => {
    try {
      let brands = await db.Brand.findAll();
      let dpts = await db.Dpt.findAll({
          include: [{
            model: db.DptSub
          }],
          order: ['Dpt.weight', 'DptSubs.weight']
        });
      let query = req.query;
      let queryObj = {};

      // search condition
      if(query.price) {
        queryObj.price = query.price;
      }
      if(query.name) {
        queryObj.name = { 'like': '%'+query.name+'%'};
      }
      if(query.productNumber) {
        queryObj.productNumber = query.productNumber;
      }
      // 存貨數量搜尋條件
      if(query.stockQuantityStart && query.stockQuantityEnd) {
        queryObj.stockQuantity = { between : [query.stockQuantityStart, query.stockQuantityEnd] };
      }
      else if (query.stockQuantityStart || query.stockQuantityEnd) {
        queryObj.stockQuantity = query.stockQuantityStart? { gte : query.stockQuantityStart }: { lte : query.stockQuantityEnd };
      }
      // 日期搜尋條件
      if(query.dateFrom && query.dateEnd) {
        queryObj.createdAt = { between : [new Date(query.dateFrom), new Date(query.dateEnd)]};
      }
      else if(query.dateFrom || query.dateEnd) {
        queryObj.createdAt = query.dateFrom? { gte : new Date(query.dateFrom)}: { lte : new Date(query.dateEnd)};
      }

      // 販售狀態 1:隱藏, 2:上架
      if(query.isPublish>0) {
        queryObj.isPublish = (query.isPublish == 1)? null : true;
      }

      queryObj = {
        where: queryObj,
        include: [db.ProductGm]
      };

      let products = await db.Product.findAll(queryObj);

      let productGms = [];
      products.map(function(product, index) {
        if(product.ProductGmId) {
          let pass=true;
          // 品牌篩選
          if(query.brandId>0) {
            console.log('++++++++++++'+JSON.stringify(product,null,4));
            if(product.ProductGm.brandId != query.brandId)
              pass= false;
          }
          // 大館別篩選
          if(query.dptId>0 && pass) {
            if(product.ProductGm.dptId != query.dptId)
              pass= false;
          }
          // 小館別篩選
          if(query.dptSubId>0 && pass) {
            if(product.ProductGm.dptSubId != query.dptSubId)
              pass= false;
          }
          if(pass)
            productGms.push(product);
        }
      });

      // if(productGms.length>0)
      //   products = productGms;


      // format datetime
      products = products.map(ProductService.withImage);
      for (let product of products) {
          product.createdAt = moment(product.createdAt).format("YYYY-MM-DD");
      }

      // let products = await ProductService.findAllWithImages();
      return res.view('admin/goodList', {
        brands,
        dpts,
        query,
        products,
        pageName: "/admin/goods"
      });
    } catch (error) {
      return res.serverError(error);
    }
  },

  showUpdate: async (req, res) => {
    // let products = await ProductService.findAllWithImages();
    let brands = await db.Brand.findAll();
    let dpts = await db.Dpt.findAll({
        include: [{
          model: db.DptSub
        }],
        order: ['weight', 'DptSubs.weight']
      });
    let tags = await db.Tag.findAll({ limit: 15});

    let gid = req.query.id;
    let good = await ProductService.findAllWithImages(gid);

    if ( ! good) {
      return res.redirect('/admin/goods');
    }

    // have to query this is
    return res.view('admin/goodCreate', {
      good,
      brands,
      dpts,
      tags
    });
  },

  createUpdate: async (req, res) => {
    let newProduct = req.body;
    console.log(newProduct);
    try {
      await ProductService.createProduct(req);
    } catch (error) {
      return res.serverError(error);
    }
    return res.redirect('/admin/goods/');
    // return res.json(newProduct);
  },

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
    return res.view('product/create');
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

  add: async (req, res) => {
    try{
      let newProduct = req.body.product;
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
      return res.redirect('product/index');
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
