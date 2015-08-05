var OrderController;
//var models = require('../api/db');

OrderController = {
  create: function(req, res) {
    // print body
    console.log('req.body is=>\n', req.body);

    // get params from body
    var newOrder = req.body.order;
    // separate params
    var quantity = newOrder.quantity;
    var product = newOrder.product;
    var user = newOrder.user;
    var shipment = newOrder.shipment;

    // set a result object
    var result = {
      order: null,
      success: null,
      user: null,
      product: null
    };

    // method - find product
    var findProduct = async( function (done) {
      console.log('product.id=>',product.id);
      // db action
      try {
        // find product from db by given Id.
        var targetProduct =
           await (db.Product.findById(1));
        // find no pid.
        if (!findProduct) {
          return done({
            msg: '找不到商品！ 請確認商品ID！'
          });
        }else{
          result.product = targetProduct
         // print target product.
         console.log ('==========targetProduct=============');
         console.log (targetProduct);
          // end
          return done(null);
        }
        // no stockQuantity.
        if (findProduct.stockQuantity === 0) {
          return done({
            msg: '商品售鑿！'
          });
        }
        // over-ordering.
        if (findProduct.stockQuantity < quantity) {
          return done({
            msg: '商品數量不足！'
          });
        }
      } catch (e) {
        console.log ('err=>',e);
        return done({
          msg: e
        });
      }
    });


    return res.ok({
      order:  result.product,
      bank: sails.config.bank,
      success: true
    });
  },
  //
  status: function(req, res) {

  }
};

module.exports = OrderController;
