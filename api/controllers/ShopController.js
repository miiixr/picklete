
let ShopController = {

  list: async(req,res) => {

    let query = req.query

    let limit = await pagination.limit(req);
    let page = await pagination.page(req);
    let offset = await pagination.offset(req);

    query.brandId = query.brand

    console.log('=== query ===', query);

    try {
      let productsWithCount = await ProductService.productQuery(query, offset, limit);
      let products = productsWithCount.rows;


      let brands = await db.Brand.findAll({order: 'weight ASC',});
      let dpts = await DptService.findAll();

      var promotions = [];
      let promotion = await db.Promotion.findAll({
        include: [{
          model: db.ProductGm
        }]
      });
      for(var i in promotion){
        promotions += promotion[i].ProductGms;
      }

      for(var i in products){
        var Today = new Date();
        var date = new Date(products[i].createdAt);
        if(products[i].stockQuantity <= 0)
          products[i].status = 'soldout';
        else if(promotions.includes(products[i].ProductGmId))
          products[i].status = 'sale';
        else if((Today - date)/86400000 <= 10)
          products[i].status = 'new';
      }

      let result = {
        brands,
        dpts,
        query,
        products,
        limit: limit,
        page: page,
        totalPages: Math.ceil(productsWithCount.count / limit),
        totalRows: productsWithCount.count,
      };

      console.log('=== totalPages ===', result.totalPages);
      console.log('=== totalRows ===', result.totalRows);

      res.view('main/shop', result);


    } catch (e) {
      console.log(e.stack);

      return res.serverError(e);
    }
  },

  show: async(req,res) => {

    let productGmid = req.params.productGmid;
    let productId = req.params.productId
    try {

      let productGm = await db.ProductGm.findOne({
            where: {id: productGmid},
            include: [
              { model: db.Product },
              { model: db.Dpt},
              { model: db.DptSub}
            ]
          });
      let product = await db.Product.findOne({
            include:[{
              model: db.ProductGm,
              include: [ db.Dpt ]}],
            where: {id: productId}
          });

      productGm = productGm.dataValues;
      product = product.dataValues;

      let dptId = product.ProductGm.Dpts[0].id;

      // recommend products
      let recommendProducts = await db.Product.findAll({
        subQuery: false,
        include: [{
          model: db.ProductGm,
          required: true,
          include: [{
            model: db.Dpt,
            where: {
              id: dptId
            }
          }]
        }],
        limit: 6
      });

      let products = await productGm.Products;
      var coverPhotos = JSON.parse(productGm.coverPhoto);
      var photos = JSON.parse(product.photos);
      var service = JSON.parse(product.service);

      var services = [];
      var servicesTerm = ['快遞宅配', '超商取貨', '國際運送', '禮品包裝'];
      for (var i in servicesTerm){
        if(service.indexOf(servicesTerm[i]) >= 0){
          services.push(true);
        }
        else{
          services.push(false);
        }
      }

      if(product.ProductGmId != productGmid){
        return res.view('common/warning', {errors:'not found'});
      }

      else{
        let resData = {
          productGm: productGm,
          products: products,
          product: product,
          photos: photos,
          services: services,
          coverPhotos: coverPhotos,
          recommendProducts
         };

        return res.view("main/shopProduct", resData);

      }

    } catch (e) {
      console.error(e);
      return res.view('common/warning', {errors:'not found'});
    };


  },

  cartStep2: async(req,res) => {
    try {
      let userData = UserService.getLoginUser(req);
      if(!userData){
        res.redirect('/register');
      }
      else{
        // console.log('\n\n=== userData ==>\n',userData);
        res.view("main/cart-step-2",{userData});
      }
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  }

}

module.exports = ShopController;
