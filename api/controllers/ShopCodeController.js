let ShopCodeController = {
    
  
  // List 'get /admin/shop-code'
  controlShopCode: async (req, res) => { 
    
    let ShopCodes = await db.ShopCode.findAll();

    res.view('promotion/controlShopCode',{
      pageName: "shop-code",
      shopCodes: ShopCodes
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

    params['sentTarget'] = [].concat( params['sentTarget'] )

    if(params['autoRandomCode'] == 'on'){
      params['code'] = Math.floor(Math.random()*10000000%10000000).toString();
    }

    if(params['restrictionDate'] == 'on'){
      params['startDate'] = Date.parse(1);
      params['endDate'] = Date.parse(1);
    }

    if(params['type']=='price'){
      var description = params['price-description'];
      var restriction = params['price-restriction'];
    }
    if(params['type']=='discount'){
      var description = params['discount-description'];
      var restriction = params['discount-restriction'];
    }

    let shopCode = {
      code: params['code'],
      title: params['title'],
      type: params['type'],
      description: description,
      restriction: restriction,
      startDate: Date.parse(params['startDate']) || 1,
      endDate: Date.parse(params['endDate']) || 1,
      restrictionDate: params['restrictionDate'],
      sentType: params['sentType'],
      sentTarget: params['sentTarget'] || [],
      sentContent: params['sentContent'] || '',
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
       return res.view("promotion/controlShopCodeUpdate",{ shopCode: shopCode });
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

      params['sentTarget'] = [].concat( params['sentTarget'] )

      if(params['autoRandomCode'] == 'true'){
        params['code'] = Math.floor(Math.random()*10000000%10000000).toString();
      }

      if(params['restrictionDate'] == 'true'){
        params['startDate'] = Date.parse(1);
        params['endDate'] = Date.parse(1);
      }

      if(params['type']=='price'){
        var description = params['price-description'];
        var restriction = params['price-restriction'];
      }
      if(params['type']=='discount'){
        var description = params['discount-description'];
        var restriction = params['discount-restriction'];
      }
      
      shopCode.code = params['code'];
      shopCode.title = params['title'];
      shopCode.type = params['type'];
      shopCode.description = description;
      shopCode.restriction = restriction;
      shopCode.startDate = Date.parse(params['startDate']) || 1;
      shopCode.endDate = Date.parse(params['endDate']) || 1,
      shopCode.restrictionDate = params['restrictionDate'],
      shopCode.sentType = params['sentType'];
      shopCode.sentTarget = params['sentTarget'] || [];
      shopCode.sentContent = params['sentContent'] || '';

      await shopCode.save();
      return res.redirect("/admin/shop-code");
    } catch (e) {
      return res.serverError(e);
    }

  },

  // DeleteAction 'post /admin/shop-code/delete'
  delete: async (req, res) => {

    let id = req.params.id;
    let shopCode = await db.ShopCode.findOne({ where: {id: id} });
    await shopCode.destroy();
    return res.ok(shopCode);
    
  }


};
module.exports = ShopCodeController;
