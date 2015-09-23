
module.exports = {

  // find all
  findAll: async () => {
    try {
      let shippings = await db.Shipping.findAll();
      return { shippings, success: true };
    } catch (error) {
      //  throw error;
      let msg = error.stack;
      return { msg, success: false };
    }
  },
  // end find all

  // save all
  saveAll: async (shippings) => {
    console.log('=== 1 new shippings ==>\n',shippings);
    try {
      // clean up
      let findAll = await db.Shipping.findAll();
      let deleteAll = await* findAll.map((shipping) => {
        shipping.destroy();
        // console.log('=== now this id is destroied ==>',shipping.id);
      });
      // save them all!
      let newShippings = shippings;
      let savedShippings = await* shippings.map((shipping) => {
        db.Shipping.create(shipping)
        // console.log('=== now this should created ==>\n',shipping);
      });
      console.log('=== 2 now savedShippings length ==>', savedShippings.length);
      console.log('=== 3 now savedShippings ==>\n', savedShippings);
      return { savedShippings, success: true };
    } catch (error) {
      //  throw error;
      let msg = error.stack;
      return { msg, success: false };
    }
  }
  // end save all

};
