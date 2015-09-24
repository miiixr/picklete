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

    console.log('-------------');
    console.log(shopCode);
    console.log('-------------');

    try {
       await db.ShopCode.create(shopCode);
       return res.redirect("/admin/shop-code");
    } catch (e) {
       return res.serverError(e);
    }
  },
  
  // UpdateView 'get /admin/shop-code/update'
  showUpdate: async (req, res) => {

  },

  // UpdateAction 'post /admin/shop-code/update'
  update: async (req, res) => {

  },

  // DeleteAction 'post /admin/shop-code/delete'
  delete: async (req, res) => {
    
  }


};
module.exports = ShopCodeController;
