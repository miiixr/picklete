module.exports = {
  getCurrentItem: async ({date, paymentTotalAmount}) => {

    console.log(date, paymentTotalAmount);

    try {
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
        include: [
          db.Product
        ]

      });

      return additionalPurchases;


    } catch (e) {

      throw e;

    }

  }
}
