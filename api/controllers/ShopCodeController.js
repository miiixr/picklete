let ShopCodeController = {
    
  
  // List 'get /admin/shop-code'
  controlShopCode: async (req, res) => { 
    
    let ShopCodes = await db.ShopCode.findAll();
    res.view('promotion/controlShopCode',{
      pageName: "shop-code",
      ShopCodes: ShopCodes
    });
  },

  // CreateView get /admin/shop-code/create'
  controlShopCodeDetail: async (req, res) => {
    
  },

  // CreateAction 'post /admin/shop-code/create' 
  create: async (req, res) => {
    
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
