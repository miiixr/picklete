/*
  ProductController.js
*/

let PromotionController = {

  // list
  list: async (req, res) => {
    try {
      let promotions = await PromotionService.findAll();
      return res.view('user/controlShopDiscount', {
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
      return res.redirect('user/controlShopDiscount');
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
      return res.redirect('user/controlShopDiscount');
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
      return res.redirect('user/controlShopDiscount');
    } catch (error) {
      console.error('=== delete error stack ==>',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  }
  // end delete

};
module.exports = PromotionController;
