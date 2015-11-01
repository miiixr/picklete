import moment from 'moment';

let ShopController = {

  done: async( req, res ) => {

    let order = await db.Order.findOne({
      where: {
        TradeNo: req.query.t
      }
    });

    //console.log("======");
    //console.log("req.query.t=" + req.query.t);
    //console.log(order);
    //console.log("======");

    res.view('main/cartDone', {order: order});
  },
  list: async(req,res) => {

    let query = req.query;
    query.isPublish = true;
    let limit = await pagination.limit(req);
    let page = await pagination.page(req);
    let offset = await pagination.offset(req);

    query.brandId = query.brand;

    sails.log.info('=== query ===', query);

    try {

      if (query.flash) {

        let promotion = await db.Promotion.findOne({
          where: {
            id: query.flash,
            type: 'flash'
          },
          include:[{
            model: db.Product,
            required: true,
            include:[{
              model: db.ProductGm
            }]
          }]
        });

      
        products = await PromotionService.productPriceTransPromotionPrice(new Date(), promotion.Products);

        res.view('main/flash', {
          promotion: promotion,
          products: products
        });
        return 
      }
      let brand = query.brand || '';
      let dptSubId = query.dptSubId || '';
      let dptId = query.dptId || '';
      let sort = query.sort || '';

      // when not query any items, select recent 3 month products.
      if (brand == '' && dptSubId == '' && dptId == '') {
        query.dateEnd = moment().format();
        query.dateFrom = moment().subtract(3, 'months').format();
      }

      let productsWithCount = await ProductService.productQuery(query, offset, limit);
      let products = productsWithCount.rows || [];
      // sails.log.info('=== shop products ===',products);
      products = await PromotionService.productPriceTransPromotionPrice(new Date(), products);

      let brands = await db.Brand.findAll({order: 'weight ASC',});
      let dpts = await DptService.findAll();


      // for(var i in products){
      //   var Today = new Date();
      //   var date = new Date(products[i].createdAt);
      //   products[i].price = '$ ' + UtilService.numberFormat(products[i].price);
      //   if (products[i].originPrice) {
      //     products[i].originPrice = '$ ' + UtilService.numberFormat(products[i].originPrice);
      //   }
      //   if(products[i].stockQuantity <= 0)
      //     products[i].status = 'soldout';
      //   else if(products[i].status != 'sale' && (Today - date)/86400000 <= 10)
      //     products[i].status = 'new';
      // }

      let result = {
        dptSubId,
        dptId,
        sort,
        brand,
        brands,
        dpts,
        query,
        products,
        limit: limit,
        page: page,
        totalPages: Math.ceil(productsWithCount.count / limit),
        totalRows: productsWithCount.count,
        verification: query.verification
      };

      sails.log.info('=== result ===', result.query);
      sails.log.info('=== totalPages ===', result.totalPages);
      sails.log.info('=== totalRows ===', result.totalRows);

      res.view('main/shop', result);


    } catch (e) {
      sails.log.error(e.stack);

      return res.serverError(e);
    }
  },

  show: async(req,res) => {

    let productGmid = req.params.productGmid;
    let productId = req.params.productId;
    let brandId = req.query.brandId ? req.query.brandId : 0;
    let dptId = req.query.dptId ? req.query.dptId : 0;
    let dptSubId = req.query.dptSubId ? req.query.dptSubId : 0;
    let dpt = 0;
    let dptSub = 0;
    
    if(dptId != 0){
      dpt = await db.Dpt.findById(dptId);
    }
    if(dptSubId != 0){
      dptSub = await db.DptSub.findById(dptSubId);
    }
    try {

      
      let productGm = await db.ProductGm.findOne({
            where: {id: productGmid},
            include: [
              { model: db.Product },
              { model: db.Dpt},
              { model: db.DptSub},
              { model: db.Brand}
            ]
          });
      let product = await db.Product.findOne({
            include:[{
              model: db.ProductGm,
              include: [ db.Dpt ]
            }],
            where: {
              id: productId,
              isPublish: true
            }
          });
      let brand = await db.Brand.findOne({
        where: {id: productGm.BrandId}
      });

      let count = (await db.PageView.findOrCreate({
        where:{
          ProductGmId: productGm.id
        },
        defaults:{
          ProductGmId: productGm.id
        }
      }))[0];
      count.pageView ++;
      count = await count.save();

      product.PageViewId = count.id;
      await product.save();

      productGm = productGm.dataValues;

      // console.log('------ productGM -----')
      // console.log(productGm)
      // console.log('------ productGM end -----')

      product = (await PromotionService.productPriceTransPromotionPrice(new Date(), [product]))[0];

      product = product.dataValues;

      console.log('=== product ===', product);

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
            },
            include: [{
              model:db.DptSub,
              where:{
                id: productGm.DptSubs[0].dataValues.id
              }
            }]
          }]
        }],
        limit: 6
      });
      let products = productGm.Products;
      var coverPhotos = JSON.parse(productGm.coverPhoto);
      var photos = JSON.parse(product.photos);
      var service = JSON.parse(product.service);

      var services = [];
      var servicesTerm = ['express', 'store', 'international', 'package'];
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

      else {
        // product.price = '$ ' + UtilService.numberFormat(product.price);
        let resData = {
          dpt: dpt,
          dptSub: dptSub,
          productGm: productGm,
          products: products,
          product: product,
          photos: photos,
          services: services,
          coverPhotos: coverPhotos,
          brand: brand.dataValues,
          brandId: brandId,
          recommendProducts,
         };
         console.log("hihihi",resData);
        return res.view("main/shopProduct", resData);

      }

    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, e});
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
