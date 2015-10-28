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
      // { productIds: [ '1' ],
      // activityLimit: '1500',
      // startDate: '2015-10-28',
      // endDate: '2015-10-28',
      // restrictionDate: 'on',
      // reducePrice: '',
      // type: 'discount',
      // discount: '95' }
      sails.log.info("=== shopBuyMore create ===",data);
      var additionalPurchase = {};
      if(data.hasOwnProperty("id")){
        additionalPurchase = await db.AdditionalPurchase.findById(data.id);
      }
      // additionalPurchase.name = findProduct.name;
      if(data.discount!=''){
        if(data.discount>10) data.discount*=0.1;
        additionalPurchase.discount = data.discount;
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

      console.log('==== queryObj ====', queryObj);


      let products = await db.Product.findAndCountAll({
        where: queryObj,
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
            },
            offset: offset,
            limit: limit
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

      sails.log.info("=== controlShopBuyMore NoLimit ===",additionalPurchaseNoLimit.rows)

      let additionalPurchaseLimit = await db.AdditionalPurchase.findAll({
        where:{
          activityLimit:1500
        },
        include:{
          model: db.Product
        }
      });

      res.view('promotion/controlShopBuyMore',{
        pageName: "shop-buy-more",
        additionalPurchaseNoLimit,
        additionalPurchaseLimit,
        limit: limit,
        page: page,
        totalPages: Math.ceil(additionalPurchaseNoLimit.count / limit),
        totalRows: additionalPurchaseNoLimit.count
      });
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },

  // controlShopBuyMoreDetail: function(req, res) {
  //   console.log('req',req.query);
  //   res.view('promotion/controlShopBuyMoreDetail',{
  //     pageName: "shop-buy-more-detail"
  //   });
  // },

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
      sail.log.error(e);
      return res.serverError(e);
    }
  },

  controlShopBuyMoreDetail: async (req, res) => {

    try {

      console.log('query',req.query);
      let query = req.query;
      let queryObj = {};

      let page = req.session.UserController_controlMembers_page =
      parseInt(req.param('page',
        req.session.UserController_controlMembers_page || 0
      ));

      let limit = req.session.UserController_controlMembers_limit =
      parseInt(req.param('limit',
        req.session.UserController_controlMembers_limit || 10
      ));

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
          offset: page * limit,
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
          offset: page * limit,
          limit: limit
        });

      }

      // let additionalPurchase = await db.AdditionalPurchase.findAll();
        res.view('promotion/controlShopBuyMoreAddItem',{
        pageName: "shop-buy-more-add-item",
        brands,
        additionalPurchase,
        query,
        page,
        limit
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
  }
  // end not clean yet


};
module.exports = PromotionController;
