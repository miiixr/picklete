let ShopCodeController = {
    
  controlShopCode: function(req, res) {
    res.view('promotion/controlShopCode',{
      pageName: "shop-code"
    });
  },
  controlShopCodeDetail: function(req, res) {
    res.view('promotion/controlShopCodeDetail',{
      pageName: "shop-code-detail"
    });
  }

};
module.exports = ShopCodeController;
