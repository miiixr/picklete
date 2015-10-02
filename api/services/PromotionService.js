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

  // productPriceTransPromotionPrice
  productPriceTransPromotionPrice: async(date, products) => {
    let targetDate = date;
    try {
      if(date == undefined || date == null) targetDate=new Date();

      // check each prduct
      await* products.map(async (product) => {

        // find promotion
        let findPromotions = await db.Promotion.findAll({
          where:{
            startDate: {
              lt: targetDate
            },
            endDate: {
              gte: targetDate
            }
          },
          include:[{
            model: db.ProductGm,
            where:{
              id: product.ProductGmId
            }
          }]
        });

        // set new price
        findPromotions.forEach((promotion) => {
          if(promotion.discountType == 'discount'){
            // console.log('=== promotion.discount ==>',promotion.discount);
            product.price = product.price * promotion.discount;
          }else if(promotion.discountType == 'price'){
            // console.log('=== promotion.price ==>',promotion.price);
            product.price = product.price - promotion.price;
          }
        });
        // console.log('=== product.price ==>',product.price);
      });

      return products;
    } catch (e) {
      console.log('=== pricing err ==>',e.stack);
      throw e;
      return false;
    }
  }
  // end productPriceTransPromotionPrice

};
