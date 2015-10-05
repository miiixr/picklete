
module.exports = {

  // find one by giving type
  findBy: async (type) => {
    console.log('=== ShippingService : type ==>',type);
    try {
        let shippings = await db.Shipping.findAll({
          where:{
            type: type
          }
        });
        console.log('=== shippings ==>',shippings);
        return shippings;
    } catch (error) {
      //  throw error;
      let msg = error.stack;
      return { msg, success: false };
    }
  },
  // end

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
    // console.log('=== 1 new shippings ==>\n',shippings);
    try {
      // avoid accidentally delete all datas.
      if(shippings == undefined || shippings.length < 1)
        return { msg:'運費資料有誤！', success: false };
      // clean up
      let findAll = await db.Shipping.findAll();
      let deleteAll = await* findAll.map((shipping) => shipping.destroy());
      // save them all!
      let newShippings = shippings;
      let savedShippings = await* newShippings.map((shipping) =>
        db.Shipping.create(shipping)
      );
      // console.log('=== 2 now savedShippings length ==>', savedShippings.length);
      // console.log('=== 3 now savedShippings ==>\n', savedShippings);
      return { savedShippings, success: true };
    } catch (error) {
      //  throw error;
      let msg = error.stack;
      return { msg, success: false };
    }
  }
  // end save all

};
