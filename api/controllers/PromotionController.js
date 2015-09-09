
let moment = require("moment");

let PromotionController = {

  // list
  list: async (req, res) => {
    try {
      let brands = await db.Brand.findAll();
      let dpts = await db.Dpt.findAll({
        include: [{
          model: db.DptSub
        }],
        order: ['Dpt.weight', 'DptSubs.weight']
      });

      let promotions = await PromotionService.findAll();

      return res.view('user/controlShopDiscount', {
        promotions,
        pageName: "shop-discount"
      });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end list


  // create
  create: async (req, res) => {
    let newPromotion = req.body;
    console.log('=== newPromotion is ==>\n',newPromotion);
    try {
      await ProductService.createProduct(req);
    } catch (error) {
      console.error('=== error ==>\n',error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
    return res.redirect('/admin/shop-discount-detail');
  },
  // end create


  // update
  update: async (req, res) => {
    let productUpdate = req.body;
    console.log('=== productUpdate ===', productUpdate);
    try {
      await ProductService.update(productUpdate);
      return res.redirect('/admin/goods/');
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end update


  // delete
  delete: async (req, res) => {
      try {
        let productId = req.param("id");
        let product = await ProductService.findWithImages(productId);
        return res.view({
          product
        });
      } catch (error) {
        console.error(error.stack);
        let msg = error.message;
        return res.serverError({msg});
      }
    },
    // end delete

};

module.exports = PromotionController;
