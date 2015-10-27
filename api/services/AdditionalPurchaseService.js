module.exports = {
  getProducts: async ({date, paymentTotalAmount}) => {

    console.log(date, paymentTotalAmount);

    try {

      let additionalPurchaseProductGms = [];
      let additionalPurchases = await db.AdditionalPurchase.findAll({
        where: {
          startDate: {
            lt: date
          },
          endDate: {
            gte: date
          },
          activityLimit: {
            lt: paymentTotalAmount
          }
        },
        include: [{
          model: db.Product,
          include:{
            model: db.ProductGm,
            include:{
              model: db.Brand,
            }
          }
        }]

      });
      let additionalProducts = [];
      additionalPurchases.forEach((additional) => {
        additional.Products.forEach((product) => {
          product.originPrice = product.price;
          if(additional.type == 'reduce'){
            product.price = product.price - additional.reducePrice;
          }else{
            if(additional.discount > 10)
              product.price = product.price * (additional.discount * 0.01);
            else
              product.price = product.price * (additional.discount * 0.1);
          }
          additionalProducts.push(product);
        });

      });

      return additionalProducts;


    } catch (e) {

      throw e;

    }

  }
}
