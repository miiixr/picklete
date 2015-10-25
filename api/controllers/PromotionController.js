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
  discountAddItem: async function(req, res) {

    try {
      let query = req.query;
      let queryObj = {};

      console.log('==== discountAddItem query ====', query);

      if(!query.hasOwnProperty("productId"))
        query.productId = [];

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

      products = await PromotionService.productPriceTransPromotionPrice(new Date(), products);

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



      let promotion = {productId: []};

      let isCreatePromotion = (query.id == null);
      if(isCreatePromotion){
        let products = await db.Product.findAll({
          where: {
            id: query.productId
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
        let promotion = await db.Promotion.find({
          where: {
            id: query.id
          },
          include: [db.Product]
        });

      }

      console.log('=== promotion ===', promotion);

      res.view('promotion/controlShopDiscountDetail',{
        pageName: "shop-discount-detail",
        promotion,
        query,
        limit,
        page,
        totalPages: Math.ceil(promotion.Products.length / limit),
        totalRows: promotion.Products.length
      });


      // if(promotion){
      //
      //   products = await db.Product.findAndCountAll({
      //     where: queryObj,
      //     offset: offset,
      //     limit: limit
      //   });
      //
      //   promotion = await db.Promotion.find({
      //     where:{
      //       id: promotion.id
      //     },
      //     include:{
      //       model: db.Product
      //     }
      //   });
      //
      //   promotion.Products.forEach((promotedProduct) => {
      //     products.rows.forEach((product) => {
      //       console.log('=== product.id ==>', product.id, '===  promotedProduct.id ==>', promotedProduct.id);
      //       if(product.id == promotedProduct.id){
      //         console.log('=== true ==');
      //         product.promoted = true;
      //       }
      //     });
      //   });
      //
      //   products.rows.forEach((product) => {
      //     console.log('=== product.id ==>', product.id, '===  product.promoted ==>',product.promoted);
      //   });
      //
      // }else{
      //   promotion = {
      //     title: '',
      //     description: '',
      //     type: 'flash',
      //     discountType: 'price',
      //     startDate: null,
      //     endDate: null,
      //     discount: '',
      //     price: ''
      //   };
      //
      //   if(query.brand && query.brand!=0){
      //     let findProductGm = await db.ProductGm.findAll({
      //       where:{
      //         BrandId: query.brand
      //       }
      //     });
      //     let productGmIds = [];
      //     findProductGm.forEach((ProductGm) => {
      //       productGmIds.push(ProductGm.id);
      //     });
      //     queryObj.ProductGmId = productGmIds;
      //   }
      //
      //   products = await db.Product.findAndCountAll({
      //     where: queryObj,
      //     offset: offset,
      //     limit: limit
      //   });
      // }

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

      let limit = await pagination.limit(req);
      let page = await pagination.page(req);
      let offset = await pagination.offset(req);

      let additionalPurchaseNoLimit = await db.AdditionalPurchase.findAndCountAll({
        where:{
          limit:0
        },
        include:{
          model: db.ProductGm
        },
        offset: offset,
        limit: limit
      });

      let additionalPurchaseLimit = await db.AdditionalPurchase.findAll({
        where:{
          limit:1500
        },
        include:{
          model: db.ProductGm
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

    let brands = await db.Brand.findAll();
    let productGmIds = [];
    if(query.brand && query.brand!=0){
      queryObj.BrandId= query.brand;
    }

    let additionalPurchase = await db.ProductGm.findAndCountAll({
      where: queryObj,
      offset: page * limit,
      limit: limit
    });

    // let additionalPurchase = await db.AdditionalPurchase.findAll();
    res.view('promotion/controlShopBuyMoreAddItem',{
      pageName: "shop-buy-more-add-item",
      brands,
      additionalPurchase,
      query,
      page,
      limit
    });
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
