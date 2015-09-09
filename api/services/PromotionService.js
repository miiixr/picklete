import moment from "moment";
import fs from 'fs';
import mime from "mime";
import util from "util";

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
      let createdPromotion = await db.Promotion.create(promotion);
      console.log('== createdPromotion ==>',createdPromotion);
    } catch (e) {
      console.log('=== create err ==>',e);
    }
    return createdPromotion;
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
    } catch (e) {
      console.log('=== update err ==>',e);
    }
    return updatePromoiton;
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
      // let ensureDelete = await db.Product.findById(promotion.id);
      // if (ensureDelete) {
      //   throw new Error('delete失敗');
      // }
    } catch (e) {
      console.log('=== delete err ==>',e);
      return false;
    }
    return true;
  }
  // end delete

};
