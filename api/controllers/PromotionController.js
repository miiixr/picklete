/*
  ProductController.js
*/

let PromotionController = {

  // list
  list: async (req, res) => {
    try {
      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);

      let promotions = await db.Promotion.findAndCountAll({
        offset: offset,
        limit: limit
      });
      return res.view('promotion/controlShopDiscount', {
        promotions,
        pageName: "shop-discount",
        limit: limit,
        page: page,
        totalPages: Math.ceil(promotions.count / limit),
        totalRows: promotions.count
      });
    } catch (error) {
      console.error('=== create error stack ==>',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end list

  // create
  save: async (req, res) => {
    let promotion = req.body;
    try {
      let savedPromotion;
      if(promotion.id){
        savedPromotion = await PromotionService.update(promotion);
      }else {
        savedPromotion = await PromotionService.create(promotion);
      }

      console.log('=== promotion ===', promotion);
      if(promotion.createDpt || promotion.type == 'flash'){
        await PromotionService.createDpt({promotion, productIds: promotion.productIds});
      }

      return res.redirect('admin/shop-discount');
    } catch (error) {
      console.error('=== create error stack ==>',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end create

  // delete
  delete: async (req, res) => {
    let promotion = req.body;
    try {
      await PromotionService.delete(promotion);
      return res.redirect('promotion/controlShopDiscount');
    } catch (error) {
      console.error('=== delete error stack ==>',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end delete

  addPurchaseUpdate: async (req, res) => {
    let data = req.body;
    try {
      sails.log.info("=== shopBuyMore create ===",data);
      var additionalPurchase = {};
      if(data.hasOwnProperty("id")){
        additionalPurchase = await db.AdditionalPurchase.findById(data.id);
      }
      // additionalPurchase.name = findProduct.name;
      if(data.discount != '') {
        var count = data.discount.toString().length;
        var discount = (count > 1) ? parseInt(data.discount, 10) / 100 : parseInt(data.discount, 10) / 10;
        additionalPurchase.discount = discount;
        console.log('---------------- discount');
        console.log(discount);
      }

      if(data.reducePrice!='')
        additionalPurchase.reducePrice = data.reducePrice;

      if(!data.anyTime){
        additionalPurchase.startDate = data.startDate;
        additionalPurchase.endDate = data.endDate;
        additionalPurchase.anyTime = false
      }else{
        additionalPurchase.anyTime = true
      }
      additionalPurchase.activityLimit = data.activityLimit;
      additionalPurchase.type = data.type;

      let products = await* data.productIds.map(async (productId)=>{
        let findProduct = await db.Product.findById(productId);
        return findProduct;
      });

      if(data.hasOwnProperty("id")){
        await additionalPurchase.save();
      }else{
        additionalPurchase = await db.AdditionalPurchase.create(additionalPurchase);
      }
        await additionalPurchase.setProducts(products);

      return res.ok();
    } catch (error) {
      console.error('=== update error stack ==>',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },

  // not clean yet
  controlShopType: function (req, res) {
    res.view({
      pageName: "shop-type"
    });
  },
  discountAddItem: async function(req, res) {

    try {
      let query = req.query;
      let queryObj = {};

      console.log('==== discountAddItem query ====', query);

      if(!query.hasOwnProperty("productIds"))
        query.productIds = [];

      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);
      
      let brands = await db.Brand.findAll();

      if(query.keyword)
        queryObj.name = { 'like': '%'+query.keyword+'%'};
      else
        query.keyword = ''

      if(query.brand && query.brand!=0){
        let findProductGm = await db.ProductGm.findAll({
          where:{
            BrandId: query.brand
          }
        });
        let productGmIds = [];
        findProductGm.forEach((ProductGm) => {
          productGmIds.push(ProductGm.id);
        });
        queryObj.ProductGmId = productGmIds;
      }

      // console.log('==== queryObj ====', queryObj);

      console.log('------------ page');
      console.log(offset);

      let products = await db.Product.findAndCountAll({
        where: queryObj,
        include: [{
          model: db.ProductGm
        }],
        offset: offset,
        limit: limit
      });

      products.rows = await PromotionService.productPriceTransPromotionPrice(new Date(), products.rows);

      res.view('promotion/discountAddItem',{
        pageName: "shop-item-add",
        query,
        limit,
        page,
        products,
        brands,
        promotion: query,
        totalPages: Math.ceil(products.count / limit),
        totalRows: products.count
      });
    } catch (e) {
      console.log('------------ error');
      console.log(e);
      return res.serverError(e);
    }
  },
  controlShopDiscountDetail: async(req, res) => {
    try {
      console.log('=== controlShopDiscountDetail query ==>',req.query);
      let query = req.query;


      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);



      let promotion = {productIds: []};

      let isCreatePromotion = (query.id == null || query.id == '');

      console.log('=== isCreatePromotion ===', isCreatePromotion);
      if(isCreatePromotion){
        let products = await db.Product.findAll({
          where: {
            id: query.productIds
          },
          offset: offset,
          limit: limit
        });

        if(products == null)
          products = []

        if(query.type)
          promotion = query


        promotion.Products = products;
      } else {
        promotion = await db.Promotion.find({
          where: {
            id: query.id
          },
          include: [db.Product]
        });

        promotion = promotion.toJSON();

        if(promotion.endDate)
          promotion.endDate = promotion.endDate.toISOString().replace('Z', '');
        if(promotion.startDate)
          promotion.startDate = promotion.startDate.toISOString().replace('Z', '');

        if(query.productIds){
          let products = await db.Product.findAll({
            where: {
              id: query.productIds
            }
            // offset: offset,
            // limit: limit
          });

          promotion.Products = products;
        }
      }

      console.log('=== promotion ===', promotion);

      let view = "";

      if(query.discountType == 'flash') view = 'promotion/controlShopDiscountDetail';
      else view = 'promotion/controlShopDiscountDetail2';

      res.view(view,{
        pageName: "shop-discount-detail",
        promotion,
        query,
        limit,
        page,
        totalPages: Math.ceil(promotion.Products.length / limit),
        totalRows: promotion.Products.length
      });

    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },

  controlShopBuyMore: async (req, res) => {
    try {
      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);

      let query = req.query;
      let limitPage = query.limitPage? query.limitPage : 0;
      // query
      if(query.keyword)
        queryObj.name = { 'like': '%'+query.keyword+'%'};
      else
        query.keyword = '';

      let additionalPurchaseNoLimit = await db.AdditionalPurchase.findAndCountAll({
        where:{
          activityLimit:0
        },
        include:{
          model: db.Product
        },
        offset: offset,
        limit: limit
      });

      sails.log.info("=== controlShopBuyMore NoLimit ===",additionalPurchaseNoLimit.rows);

      let additionalPurchaseLimit = await db.AdditionalPurchase.findAndCountAll({
        where:{
          activityLimit:1500
        },
        include:{
          model: db.Product
        },
        offset: offset,
        limit: limit
      });
      // end query
      // console.log("=== controlShopBuyMore Limit ===",additionalPurchaseLimit.count);

      console.log('==========  limit  ===============  Page   ===============');
      console.log(limitPage);
      console.log(Math.ceil(additionalPurchaseLimit.count / limit));
      console.log(additionalPurchaseLimit.count);

      res.view('promotion/controlShopBuyMore',{
        query,
        pageName: "/admin/shop-buy-more",
        additionalPurchaseNoLimit,
        additionalPurchaseLimit,
        limit,
        page,
        totalPages: Math.ceil(additionalPurchaseNoLimit.count / limit),
        totalRows: additionalPurchaseNoLimit.count,
        limitTotalPages: Math.ceil(additionalPurchaseLimit.count / limit),
        limitTotalRows: additionalPurchaseLimit.count,
        limitPage
      });
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },

  buyMoreAddItem: async function(req, res) {

    try {
      let query = req.query;
      let queryObj = {};

      console.log('==== buyMoreAddItem query ====', query);

      if(!query.hasOwnProperty("productIds"))
        query.productIds = [];

      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);
      let brands = await db.Brand.findAll();

      if(query.keyword)
        queryObj.name = { 'like': '%'+query.keyword+'%'};
      else
        query.keyword = ''

      if(query.brand && query.brand!=0){
        let findProductGm = await db.ProductGm.findAll({
          where:{
            BrandId: query.brand
          }
        });
        let productGmIds = [];
        findProductGm.forEach((ProductGm) => {
          productGmIds.push(ProductGm.id);
        });
        queryObj.ProductGmId = productGmIds;
      }

      console.log('==== queryObj ====', queryObj);


      let products = await db.Product.findAndCountAll({
        where: queryObj,
        offset: offset,
        limit: limit
      });

      res.view('promotion/buyMoreAddItem',{
        pageName: "/admin/shop-buy-more",
        query,
        limit,
        page,
        products,
        brands,
        promotion: query,
        totalPages: Math.ceil(products.count / limit),
        totalRows: products.count
      });
    } catch (e) {
      sail.log.error(e);
      return res.serverError(e);
    }
  },


  controlShopBuyMoreDetail: async (req, res) => {

    try {

      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);

      console.log('query',req.query);
      let query = req.query;
      let queryObj = {};

      let brands = await db.Brand.findAll();
      if(query.brand && query.brand!=0){
        queryObj.BrandId= query.brand;
      }

      let additionalPurchase;
      if(query.hasOwnProperty("id")){
        additionalPurchase = await db.AdditionalPurchase.findAndCountAll({
          where: {
            id: query.id
          },
          include:[{
            model: db.Product
          }],
          offset: offset,
          limit: limit
        });
        query = additionalPurchase.rows[0].dataValues;
        additionalPurchase.rows = additionalPurchase.rows[0].Products
      }else{

        if(query.keyword)
          queryObj.name = { 'like': '%'+query.keyword+'%'};
        else
          query.keyword = ''

        if(query.hasOwnProperty("productIds"))
          queryObj.id = query.productIds;
        else
          queryObj.id = []

        additionalPurchase = await db.Product.findAndCountAll({
          where: queryObj,
          offset: offset,
          limit: limit
        });

      }

      // let additionalPurchase = await db.AdditionalPurchase.findAll();
      res.view('promotion/controlShopBuyMoreAddItem',{
        pageName: "/admin/shop-buy-more",
        brands,
        additionalPurchase,
        query,
        page,
        limit,
        totalPages: Math.ceil(additionalPurchase.count / limit),
        totalRows: additionalPurchase.count
      });
    } catch (e) {
      sail.log.error(e);
      return res.serverError(e);
    }
  },
  controlShopReportForm: async (req, res) => {
    let dateList = await ReportService.list();
    res.view('promotion/controlShopReportForm',{
      pageName: "shop-report-form",
      dateList: dateList
    });
  },

  buymoreDelete: async (req, res) => {
    try {
      let id = req.params.id;
      let additionalPurchase = await db.AdditionalPurchase.findOne({ where: {id: id} });
      await additionalPurchase.destroy();
      return res.ok(additionalPurchase);
    } catch (e) {
      sail.log.error(e);
      return res.serverError(e);
    }
  },

  shopDiscountDelete: async (req, res) => {
    try {
      let id = req.params.id;
      let promotion = await db.Promotion.findOne({ where: {id: id} });
      await promotion.destroy();
      return res.ok(promotion);
    } catch (e) {
      sail.log.error(e);
      return res.serverError(e);
    }
  }


  // end not clean yet


};
module.exports = PromotionController;
