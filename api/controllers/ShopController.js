
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
          required:true,
          include: [
            includeDpt,
            includeDptSub
          ]
        }]
      });

      let brands = await db.Brand.findAll();

      console.log('products.length', products.length);

      let dpts = await db.Dpt.findAll({
        include: [{
          model: db.DptSub
        }],
        order: ['Dpt.weight', 'DptSubs.weight']
      })


      res.view('main/shop', {
        dpts,
        brands,
        products: products || {},
        pageName: 'main/shop'
      });


    } catch (e) {
      console.log(e.stack);

      return res.serverError(e);
    }
  },

  show: async(req,res) => {

    let productGmid = req.params.productGmid;
    let productId = req.params.productId

    let productGm = await db.ProductGm.findOne({ 
          where: {id: productGmid}, 
          include:[{ model: db.Product }] 
        });
    let product = await db.Product.findOne({where: {id: productId}});
    
    productGm = productGm.dataValues;
    product = product.dataValues;

    let products = await productGm.Products;

    let resData = { productGm: productGm, products: products, product: product };

    return res.view("main/shop-Product", resData);


  }


}

module.exports = ShopController;
