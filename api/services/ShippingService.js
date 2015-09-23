
module.exports = {

  // find all
  findAll: async () => {
    try {
      let shippings = await db.Shipping.findAll();
      return shippings;
    } catch (error) {
       throw error;
    }
  },
  // end find all

  // save all
  saveAll: async (shippings) => {
    console.log('=== shippings ==>',shippings);
    try {
      // clean up
      let findAll = await ShippingService.findAll();
      let deleteAll = await* findAll.map((shipping) => {
        shipping.destroy();
        // console.log('=== now this id is destroied ==>',shipping.id);
      });
      // save them all!
      let savedShippings = await* shippings.map((shipping) => {
        db.Shipping.create(shipping);
      });
      // console.log('=== now savedShippings length ==>', savedShippings.length);
      return savedShippings;
    } catch (error) {
       throw error;
    }
  }
  // end save all

};
