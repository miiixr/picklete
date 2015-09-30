module.exports = {
  getProductGms: async ({date, paymentTotalAmount}) => {

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
          limit: {
            lt: paymentTotalAmount
          }
        },
        include: [{
          model: db.ProductGm,
          include: [db.Product, db.Brand]
        }]

      });

      additionalPurchases.forEach((additionalPurchase) => {
        let finalAdditionalPurchase = additionalPurchase.toJSON();
        let productGms = finalAdditionalPurchase.ProductGms;

        productGms.forEach((productGm) => {
          productGm.originPrice = productGm.Products[0].price;

          productGm.Products.forEach((product, index) => {

            if(additionalPurchase.type == 'reduce')
              product.price = product.price - additionalPurchase.reducePrice;
            else {
              product.price = product.price * additionalPurchase.discount;
            }

          });

          productGm.price = productGm.Products[0].price;
          additionalPurchaseProductGms.push(productGm);
        });

      });

      return additionalPurchaseProductGms;


    } catch (e) {

      throw e;

    }

  }
}
