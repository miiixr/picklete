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
      if(promotion.id){
        await PromotionService.update(promotion);
      }else {
        let createdPromotion = await PromotionService.create(promotion);
      }
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
      console.log('=== controlShopDiscountDetail query ==>',req.query);
      let query = req.query;
      let queryObj = {};
      if(query.keyword)
        queryObj.name = { 'like': '%'+query.keyword+'%'};
      else
        query.keyword = ''

      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);

      let promotion = await db.Promotion.findById(query.id);
      // let productGms;
      let products;
      if(promotion){

        products = await db.Product.findAndCountAll({
          where: queryObj,
          offset: offset,
          limit: limit
        });

        promotion = await db.Promotion.find({
          where:{
            id: promotion.id
          },
          include:{
            model: db.Product
          }
        });

        promotion.Products.forEach((promotedProduct) => {
          products.rows.forEach((product) => {
            console.log('=== product.id ==>', product.id, '===  promotedProduct.id ==>', promotedProduct.id);
            if(product.id == promotedProduct.id){
              console.log('=== true ==');
              product.promoted = true;
            }
          });
        });

        products.rows.forEach((product) => {
          console.log('=== product.id ==>', product.id, '===  product.promoted ==>',product.promoted);
        });

      }else{
        promotion = {
          title: '',
          description: '',
          type: 'flash',
          discountType: 'price',
          startDate: null,
          endDate: null,
          discount: '',
          price: ''
        };
        products = await db.Product.findAndCountAll({
          where: queryObj,
          offset: offset,
          limit: limit
        });
      }

      res.view('promotion/controlShopDiscountDetail',{
        pageName: "shop-discount-detail",
        products,
        promotion,
        query,
        limit,
        page,
        totalPages: Math.ceil(products.count / limit),
        totalRows: products.count
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
      let queryObj = {};

      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);

      let query = req.query;

      if(query.keyword)
        queryObj.name = { 'like': '%'+query.keyword+'%'};
      else
        query.keyword = '';

      let noLimit = await db.AdditionalPurchase.findAndCountAll({
        subQuery: false,
        include: [{
          model: db.ProductGm
        }],
        where: queryObj,
        limit: limit,
        offset: offset
      });
      console.log(' ==== no Limit ====');
      console.log(JSON.stringify(noLimit,null,4 ));
      let limitResult = await db.AdditionalPurchase.findAndCountAll({
        subQuery: false,
        include: [{
          model: db.ProductGm
        }],
        where: {
          limit: 1500
        },
        limit: limit,
        offset: offset
      });

      res.view('promotion/controlShopBuyMore',{
        query,
        pageName: "/admin/shop-buy-more",
        noLimit,
        limitResult,
        limit,
        page,
        totalPages: Math.ceil(noLimit.count / limit),
        totalRows: noLimit.count
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

    let limit = await pagination.limit(req);
    let page = await pagination.page(req);
    let offset = await pagination.offset(req);

    if(query.keyword)
      queryObj.name = { 'like': '%'+query.keyword+'%'};
    else
      query.keyword = ''

    if(query.brandId > 0)
      queryObj.brandId = query.brandId;

    let additionalPurchase = await db.ProductGm.findAndCountAll({
      where: queryObj,
      offset: offset,
      limit: limit
    });
    console.log(JSON.stringify(additionalPurchase,null,4));
    let brands = await db.Brand.findAll();

    // let additionalPurchase = await db.AdditionalPurchase.findAll();
    res.view('promotion/controlShopBuyMoreAddItem',{
      pageName: "/admin/shop-buy-more",
      additionalPurchase,
      query,
      brands,
      page,
      limit,
      totalPages: Math.ceil(additionalPurchase.count / limit),
      totalRows: additionalPurchase.count
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
