import moment from "moment";
import fs from 'fs';
import mime from "mime";
import util from "util";

/*
  PromotionService.js
*/

module.exports = {

  // findAll
  findAll: async () => {
    let promotions = await db.Promotion.findAll();
    return promotions;
  },
  // end findAll

  // create
  create: async (promotion) => {
    try {
      console.log('=== raw promotion ==>',promotion);

      if(promotion.discount =='')
        delete promotion.discount;
      if(promotion.price=='')
        delete promotion.price;

      let createdPromotion = await db.Promotion.create(promotion);
      console.log('=== createdPromotion ==>',createdPromotion);

      let promotedProducts = await* promotion.productGmIds.map(async (productGmId)=>{
        let findProductGm = await db.ProductGm.findById(productGmId);
        await createdPromotion.setProductGms([findProductGm]);
        return createdPromotion;
      });

      return createdPromotion;
    } catch (e) {
      console.log('=== create err ==>',e.stack);
      return false;
    }
  },
  // end create

  // update
  update: async (promotion) => {
    try {
      console.log('=== raw promotion ==>',promotion);
      let updatePromoiton = await db.Promotion.find({
        where: {
          id: promotion.id
        }
      });
      console.log('=== updatePromoiton ==>',updatePromoiton);
      updatePromoiton.title = promotion.title;
      updatePromoitondescription = promotion.description;
      updatePromoiton.type = promotion.type;
      updatePromoiton.startDate = promotion.startDate;
      updatePromoiton.endDate = promotion.endDate;
      updatePromoiton.discount = promotion.discount;
      await updatePromoiton.save();
      return updatePromoiton;
    } catch (e) {
      console.log('=== update err ==>',e.stack);
      return false;
    }
  },
  // end update

  // delete
  delete: async (promotion) => {
    try {
      console.log('=== raw promotion ==>',promotion);
      let findProduct = await db.Product.findById(promotion.id);
      if (!findPromotion) {
        throw new Error('cant find this promotion! id is ==>',promotion.id);
      }
      await findPromotion.destroy();
      return true;
    } catch (e) {
      console.log('=== delete err ==>',e.stack);
      return false;
    }
  },
  // end delete

  // pricing
  pricing: async(promotion) => {
    try {
      // console.log('=== raw promotion is ==>',promotion);
      var now = new Date();

      // find promotion and productGms,products
      let findPromotionProductGms = await db.Promotion.findAll({
        where:{
          startDate: {
            lt: now
          },
          endDate: {
            gte: now
          }
        },
        include: [{
          model: db.ProductGm,
          include: [db.Product]
        }]
      });

      // set price from promotion settings
      await* findPromotionProductGms.map(async (findPromotionProductGm) => {
        // console.log('=== findPromotionProductGm.discountType ==>',findPromotionProductGm.discountType);
        // console.log('=== findPromotionProductGm ==>',findPromotionProductGm);
        // console.log('=== findPromotionProductGm.ProductGms ==>',findPromotionProductGm.ProductGms);
        let productGms = findPromotionProductGm.ProductGms;
        let discountType = findPromotionProductGm.discountType;

        if(productGms.length != 0){
          // check productGms for each
          await* productGms.map(async (productGm) => {
            // console.log('=== productGm.id ==>',productGm.id);
            // console.log('=== productGm.Products.length ==>',productGm.Products.length);
            // get origin price
            productGm.originPrice = productGm.Products[0].price;

            if(productGm.Products.length != 0){
              // set new price from promotion for each one
              await* productGm.Products.map(async (product) => {
                // console.log('=== product.id ==>',product.id);
                // depends on discountType
                if(discountType == 'discount'){
                  // console.log('=== findPromotionProductGm.discount ==>',findPromotionProductGm.discount);
                  product.price = product.price * findPromotionProductGm.discount;
                }else if(discountType == 'price'){
                  // console.log('=== findPromotionProductGm.price ==>',findPromotionProductGm.price);
                  product.price = findPromotionProductGm.price;
                }
                return await product.save();
              });
            }
            return await productGm.save();
          });
        }
        return findPromotionProductGm;
      });

      return findPromotionProductGms;
    } catch (e) {
      console.log('=== pricing err ==>',e.stack);
      throw e;
      return false;
    }
  }
  // end pricing

};
