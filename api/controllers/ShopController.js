
let ShopController = {

  list: async(req,res) => {
    let dptSubId = req.query.dptSubId || -1;
    let dptId = req.query.dptId || -1;

    let products;


    let includeDpt = {
      model: db.Dpt,
      where: {}
    }

    let includeDptSub = {
      model: db.DptSub,
      where: {}
    }
    if(dptId >= 0) includeDpt.where.id = dptId;
    if(dptSubId >= 0) includeDptSub.where.id = dptSubId;




    try {
      products = await db.Product.findAll({

        include: [{
          model: db.ProductGm,
          require:true,
          include: [
            includeDpt,
            includeDptSub
          ]
        }]
      });

      console.log('products.length', products.length);

      let dpts = await db.Dpt.findAll({
        include: [{
          model: db.DptSub
        }],
        order: ['Dpt.weight', 'DptSubs.weight']
      })


      res.view('main/shop', {
        dpts,
        products: products || {},
        pageName: 'main/shop'
      });


    } catch (e) {

      return res.serverError(e);
    }
  }
}

module.exports = ShopController;
