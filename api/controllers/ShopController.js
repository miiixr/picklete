
let ShopController = {

  list: async(req,res) => {
    let dptSubId = req.query.dptSubId || 1;
    let dptId = req.query.dptId || 1;

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
    try {

      let productGm = await db.ProductGm.findOne({ 
            where: {id: productGmid}, 
            include: [
              { model: db.Product },
              { model: db.Dpt},
              { model: db.DptSub}
            ]
          });
      let product = await db.Product.findOne({where: {id: productId}});
      
      productGm = productGm.dataValues;
      product = product.dataValues;

      let products = await productGm.Products;
      var coverPhotos = JSON.parse(productGm.coverPhoto);
      var photos = JSON.parse(product.photos);
      var service = JSON.parse(product.service);

      var services = [];
      var servicesTerm = ['快遞宅配', '超商取貨', '國際運送', '禮品包裝'];
      for (var i in servicesTerm){
        if(service.indexOf(servicesTerm[i]) >= 0){
          services.push(true);
        }
        else{
          services.push(false);
        }
      }
      
      if(product.ProductGmId != productGmid){
        return res.view('common/warning', {errors:'not found'});
      }
      else{  
        let resData = { productGm: productGm, products: products, product: product, photos: photos, services: services, coverPhotos: coverPhotos };

        return res.view("main/shopProduct", resData);

      }

    } catch (e) {
      console.error(e);
      return res.view('common/warning', {errors:'not found'});
    };
    

  }


}

module.exports = ShopController;
