let ShopCodeController = {
    
  
  // List 'get /admin/shop-code'
  controlShopCode: async (req, res) => { 
    
    let ShopCodes = await db.ShopCode.findAll();

    console.log('-------------');
    console.log(ShopCodes[0].dataValues);
    console.log('-------------');

    res.view('promotion/controlShopCode',{
      pageName: "shop-code",
      ShopCodes: ShopCodes
    });
  },

  // CreateView get /admin/shop-code/create'
  controlShopCodeDetail: async (req, res) => {
    res.view('promotion/controlShopCodeDetail',{
    });
  },

  // CreateAction 'post /admin/shop-code/create' 
  create: async (req, res) => {
    
    var params = req.body;

    let shopCode = {
      code: params['code'],
      title: params['title'],
      type: params['type'],
      description: params['description'],
      restriction: params['restriction'] || '',
      startDate: params['startDate'],
      endDate: params['endDate'],
      sent: params['sent'],
      content: params['content'] || '',
    };

    try {
       await db.ShopCode.create(shopCode);
       return res.redirect("/admin/shop-code");
    } catch (e) {
       return res.serverError(e);
    }
  },
  
  // UpdateView 'get /admin/shop-code/update'
  showUpdate: async (req, res) => {

    let id = req.query.id;
    let shopCode = await db.ShopCode.findOne({ where: {id: id} });
    
    try {
       return res.view("admin/promotion/controlShopCodeUpdate",{ shopCode: shopCode });
    } catch (e) {
       return res.serverError(e);
    }
  },

  // UpdateAction 'post /admin/shop-code/update'
  update: async (req, res) => {

    try {
      var params = req.body;
      let id = parseInt(req.body['id'] || req.query.id);
      let shopCode = await db.ShopCode.findOne({ where: {id: id} });
      
      shopCode.code = req.body['code'];
      shopCode.title = req.body['title'];
      shopCode.type = req.body['type'];
      shopCode.description = req.body['description'];
      shopCode.restriction = req.body['restriction'] || '';
      shopCode.startDate = req.body['startDate'];
      shopCode.endDate = req.body['endDate'];
      shopCode.sent = req.body['sent'];
      shopCode.content = req.body['content'] || '';

      await shopCode.save();
      return res.redirect("/admin/shop-code");
    } catch (e) {
      return res.serverError(e);
    }

  },

  // DeleteAction 'post /admin/shop-code/delete'
  delete: async (req, res) => {
    
  }


};
module.exports = ShopCodeController;
