/*
  ProductController.js
*/

let PromotionController = {

  // list
  list: async (req, res) => {
    try {
      let promotions = await PromotionService.findAll();
      return res.view('promotion/controlShopDiscount', {
        promotions,
        pageName: "shop-discount"
      });
    } catch (error) {
      console.error('=== create error stack ==>',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end list

  // create
  create: async (req, res) => {
    let promotion = req.body;
    try {
      let createdPromotion = await PromotionService.create(promotion);
      return res.redirect('admin/shop-discount');
    } catch (error) {
      console.error('=== create error stack ==>',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end create

  // update
  update: async (req, res) => {
    let promotion = req.body;
    try {
      console.log("!!!",promotion);
      await PromotionService.update(promotion);
      return res.redirect('promotion/controlShopDiscount');
    } catch (error) {
      console.error('=== update error stack ==>',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end update

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
      console.log("data",data);
      let products = await* data.productIds.map(async (productId)=>{
        let findProductGm = await db.ProductGm.findById(productId);
        let additionalPurchase = {};
        additionalPurchase.name = findProductGm.name;
        if(data.discount!='')
          additionalPurchase.discount = data.discount;
        if(data.reducePrice!='')
          additionalPurchase.reducePrice = data.reducePrice;
        additionalPurchase.startDate = data.startDate;
        additionalPurchase.endDate = data.endDate;
        additionalPurchase.limit = data.limit;
        additionalPurchase.type = data.type;
        let addPurchase = await db.AdditionalPurchase.create(additionalPurchase);
        await addPurchase.setProductGms([findProductGm]);
        return findProductGm;
      });
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
  controlShopItemAdd: function(req, res) {
    res.view('promotion/controlShopItemAdd',{
      pageName: "shop-item-add"
    });
  },
  controlShopDiscountDetail: async(req, res) => {
    try {
      console.log('query',req.query);
      let query = req.query;
      let queryObj = {};

      if(query.keyword)
        queryObj.name = { 'like': '%'+query.keyword+'%'};
      else
        query.keyword = ''

      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);

      let productGms = await db.ProductGm.findAndCountAll({
        where: queryObj,
        offset: offset,
        limit: limit
      });

      res.view('promotion/controlShopDiscountDetail',{
        pageName: "shop-discount-detail",
        productGms,
        query,
        limit,
        page,
        totalPages: Math.ceil(productGms.count / limit),
        totalRows: productGms.count
      });
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  controlShopDiscountDetail2: function(req, res) {
    res.view('promotion/controlShopDiscountDetail2',{
      pageName: "shop-discount-detail2"
    });
  },
  controlShopDiscountAddItem: function(req, res) {
    res.view('promotion/controlShopDiscountAddItem',{
      pageName: "shop-discount-add-item"
    });
  },
  controlShopBuyMore: async (req, res) => {
    try {
      let noLimit = await db.AdditionalPurchase.findAll({
        where:{
          limit:0
        }
      });
      let limit = await db.AdditionalPurchase.findAll({
        where:{
          limit:1500
        }
      });
      res.view('promotion/controlShopBuyMore',{
        pageName: "shop-buy-more",
        noLimit,
        limit
      });
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  controlShopBuyMoreDetail: function(req, res) {
    console.log('req',req.query);
    res.view('promotion/controlShopBuyMoreDetail',{
      pageName: "shop-buy-more-detail"
    });
  },
  controlShopBuyMoreAddItem: async (req, res) => {
    console.log('query',req.query);
    let query = req.query;
    let queryObj = {};

    if(query.keyword)
      queryObj.name = { 'like': '%'+query.keyword+'%'};
    else
      query.keyword = ''

    let page = req.session.UserController_controlMembers_page =
    parseInt(req.param('page',
      req.session.UserController_controlMembers_page || 0
    ));

    let limit = req.session.UserController_controlMembers_limit =
    parseInt(req.param('limit',
      req.session.UserController_controlMembers_limit || 10
    ));

    let additionalPurchase = await db.ProductGm.findAndCountAll({
      where: queryObj,
      offset: page * limit,
      limit: limit
    });

    // let additionalPurchase = await db.AdditionalPurchase.findAll();
    res.view('promotion/controlShopBuyMoreAddItem',{
      pageName: "shop-buy-more-add-item",
      additionalPurchase,
      query,
      page,
      limit
    });
  },
  controlShopReportForm: function(req, res) {
    res.view('promotion/controlShopReportForm',{
      pageName: "shop-report-form"
    });
  }
  // end not clean yet


};
module.exports = PromotionController;
