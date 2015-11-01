module.exports = {
  getProducts: async ({date, paymentTotalAmount}) => {

    console.log(date, paymentTotalAmount);

    try {

      let additionalPurchaseProductGms = [];
      let additionalPurchases = await db.AdditionalPurchase.findAll({
        where: {
          $or:[{
            anyTime: true
          },{
            startDate: {
              $lt: date
            },
            endDate: {
              $gte: date
            },
          }],
          activityLimit: {
            $lt: paymentTotalAmount
          }
        },
        include: [{
          model: db.Product,
          where:{
            stockQuantity:{
              $gt: 0
            }
          },
          include:{
            model: db.ProductGm,
            include:{
              model: db.Brand,
            }
          }
        }],
        limit: 6
      });
      let additionalProducts = [];
      additionalPurchases.forEach((additional) => {
        additional.Products.forEach((product) => {
          product.originPrice = product.price;
          if(additional.type == 'reduce'){
            product.price = additional.reducePrice;
          }else{
            product.price = product.price * additional.discount;
          }
          additionalProducts.push(product);
        });

      });

      return {additionalProducts,additionalPurchases};
    } catch (e) {

      throw e;

    }

  },

cartAddAdditionalPurchases: async(additionalPurchasesItems) => {
    try {
      sails.log.info("=== additionalPurchasesItems ===",additionalPurchasesItems);
      let buyMoreTotalPrice = 0;
      additionalPurchasesItems = await* additionalPurchasesItems.map(async (item) =>{
        let find = await db.AdditionalPurchase.findOne({
          where:{
            id: item.additionalPurchasesId
          },
          include:{
            model: db.Product,
            where:{
              id: item.productId
            },
            include:{
              model: db.ProductGm,
              include:{
                model: db.Brand
              }
            }
          }
        });
        find.originPrice = find.Products[0].price;
        if(find.type == 'reduce')
          find.price = find.reducePrice;
        else{
          find.price = find.originPrice * find.discount;
        }
        buyMoreTotalPrice += find.price ;
        return find;
      });
      sails.log.info("=== additionalPurchasesItems ===",JSON.stringify(additionalPurchasesItems,null,2));
      return {additionalPurchasesItems,buyMoreTotalPrice};
    } catch (e) {
      throw e;
    }
  }
}
