// # 1. 透過 Productid 找到 model product
// # 2. 檢查 user 是否存在，若否進行建立
// # 3. 建立訂單 order

var OrderController;

OrderController = {
  create: async (req, res) => {
    // print body
    console.log('req.body is=>\n', req.body);

    var newOrder = req.body.order;

    var quantity = newOrder.quantity;
    var product = newOrder.product;
    var user = newOrder.user;
    var shipment = newOrder.shipment;

    var result = {
      product:null
    };

    try {
      // find product.
      let findProduct = await (db.Product.findById(product.id).then(function(targetProduct){
          if (!targetProduct) {
            console.log('err=>find product failed.');
            return res.serverError({
              msg: '找不到商品！ 請確認商品ID！'
            });
          }
          if (targetProduct.stockQuantity === 0) {
            console.log('err=>product no stock.');
            return res.serverError({
              msg: '商品售鑿！'
            });
          }
          if (targetProduct.stockQuantity < quantity) {
            console.log('err=>over-ordering.');
            return res.serverError({
              msg: '商品數量不足！'
            });
          }
          result.product = targetProduct.toJSON();
        })
      );

      // find or create user.
      let insertUser = await (db.User.findOrCreate({
        where:
          {
            email:user.email
          },
          defaults:user
        }).then(function(user, created){
          if (!created){
            console.log('create user.');
          }
          result.user = user;
        })
      );

      // build order and shipment.
      let thisOrder = {
        quantity: quantity,
        UserId: result.user.id,
        orderId: 'not-set-yet'
      };
      let insertOrder = await (db.Order.create(thisOrder).then(function(createdOrder){
          if (!createdOrder){
            console.log('err=>create order failed.');
            return res.serverError({
              msg: '建立訂單失敗'
            });
          }
          result.order = createdOrder.toJSON();
          result.id = result.order.id;
          result.success = true;
        })
      );

      // build shipment.
      ShipmentService.create(shipment, async(error, createShipment) => {
        if (!createShipment){
          console.log('err=>create Shipment failed.');
          return res.serverError({
            msg: '建立Shipment失敗'
            });
        }
        result.shipment = createShipment;
        // var associatedShipment = await (result.order.setShipment(result.shipment));
        // let associatedProduct = await (result.order.setProduct(result.product));
        // let associatedUser = await (result.order.setUser(orderUser));
      });

      // output
      console.log('\nRESULT===============>\n',result);
      return res.ok({
        order: result,
        bank: sails.config.bank,
        success: result.success
      });
    } catch (e) {
      console.log ('err=>',e);
      return res.serverError(e);
    }
  },
  // 查詢
  status: function(req, res) {
    return res.ok({
      msg: '沒有此訂單'
    });
  }
};

module.exports = OrderController;
