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
      await PromotionService.create(promotion);
      return res.redirect('promotion/controlShopDiscount');
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
  controlShopDiscountDetail: function(req, res) {
    res.view('promotion/controlShopDiscountDetail',{
      pageName: "shop-discount-detail"
    });
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
  controlShopBuyMore: function(req, res) {
    res.view('promotion/controlShopBuyMore',{
      pageName: "shop-buy-more"
    });
  },
  controlShopBuyMoreDetail: function(req, res) {
    res.view('promotion/controlShopBuyMoreDetail',{
      pageName: "shop-buy-more-detail"
    });
  },
  controlShopBuyMoreAddItem: function(req, res) {
    res.view('promotion/controlShopBuyMoreAddItem',{
      pageName: "shop-buy-more-add-item"
    });
  },
  controlShopCode: function(req, res) {
    res.view('promotion/controlShopCode',{
      pageName: "shop-code"
    });
  },
  controlShopCodeDetail: function(req, res) {
    res.view('promotion/controlShopCodeDetail',{
      pageName: "shop-code-detail"
    });
  },
  controlShopReportForm: function(req, res) {
    res.view('promotion/controlShopReportForm',{
      pageName: "shop-report-form"
    });
  },
  controlBonusDiscount: async function(req, res) {
    try{
      console.log('query',req.query);
      let query = req.query;
      let queryObj = {};

      if(query.keyword)
        queryObj.email= { 'like': '%'+query.keyword+'%'};

      let page = req.session.UserController_controlMembers_page =
      parseInt(req.param('page',
        req.session.UserController_controlMembers_page || 0
      ));

      let limit = req.session.UserController_controlMembers_limit =
      parseInt(req.param('limit',
        req.session.UserController_controlMembers_limit || 10
      ));

      let allBonus = await db.BonusPoint.findAndCountAll({
        where: queryObj,
        offset: page * limit,
        limit: limit
      });
      res.view('promotion/controlBonusDiscount',{
        pageName: "bonus-discount",
        query,
        page,
        limit,
        allBonus
      });
    }catch(e){
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  // end not clean yet


};
module.exports = PromotionController;
