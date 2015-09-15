
let ShopController = {

  list: async(req,res) => {
    let dptSubId = req.query.dptSubId || "error";
    let dptId = req.query.dptId || "error"; 

    let products;

    products = await db.Product.findAll({

      include: [{
        model: db.ProductGm,
        require:true,
        where: {
          dptId: dptId,
          dptSubId: dptSubId
        }
      }]
    });

    return db.Dpt.findAll({
      include: [{
        model: db.DptSub
      }],
      order: ['Dpt.weight', 'DptSubs.weight']
    })
    .then(function(dpts) {
      res.view('main/shop', {
        dpts,
        products: products || {},
        pageName: 'main/shop'
      });
    })
    .catch(function(error) {
      return res.serverError(error);
    });
  }
}

module.exports = ShopController;