// # 1. 透過 Productid 找到 model product
// # 2. 檢查 user 是否存在，若否進行建立
// # 3. 建立訂單 order

var OrderController;

OrderController = {
  index: async (req, res) => {
    try {
      let orders = await db.Order.findAll();
      return res.view({orders});
    } catch (error) {
      return res.serverError(error);
    }
  },
  create: async (req, res) => {

    var dateFormat, randomNumber;

    dateFormat = function(nowDate) {
      var dd, mm, yyyy;
      yyyy = nowDate.getFullYear().toString();
      mm = (nowDate.getMonth() + 1).toString();
      dd = nowDate.getDate().toString();
      return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
    };

    randomNumber = function() {
      var maxNum, minNum;
      maxNum = 9999;
      minNum = 0;
      return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    };


    var newOrder = req.body.order;
    var result = {
      product:null
    };

    try {
      // find product.
      let findProduct = await db.Product.findById(newOrder.product.id);
      if (!findProduct) {
        console.log('err=>find product failed.');
        return res.serverError({
          msg: '找不到商品！ 請確認商品ID！'
        });
      }
      if (findProduct.stockQuantity === 0) {
        console.log('err=>product no stock.');
        return res.serverError({
          msg: '商品售鑿！'
        });
      }
      if (findProduct.stockQuantity < newOrder.quantity) {
        console.log('err=>over-ordering.');
        return res.serverError({
          msg: '商品數量不足！'
        });
      }
      result.product = findProduct;

      // find or create user.
      let insertUser = await db.User.findOrCreate({
        where:
          {
            email:newOrder.user.email
          },
          defaults:newOrder.user
        });
      result.user = insertUser[0];

      // build order and shipment.
      let thisOrder = {
        quantity: newOrder.quantity,
        UserId: result.user.id,
        SerialNumber: dateFormat(new Date()) + randomNumber()
      };
      let insertOrder = await db.Order.create(thisOrder);
      if (!insertOrder){
        console.log('err=>create order failed.');
        return res.serverError({
          msg: '建立訂單失敗'
        });
      }
      result.order = insertOrder;
      result.id = result.order.id;

      // build shipment.
      let insertShipment = await (
        ShipmentService.create(newOrder.shipment, function (error, createdShipment) {
          if (!createdShipment){
            console.log('err=>create Shipment failed.');
            return res.serverError({
              msg: '建立Shipment失敗'
              });
          }
          result.shipment = createdShipment;
          result.success = true;
        })
      );

      // associations
      let associatedShipment = await (result.order.setShipment(result.shipment));
      let associatedProduct = await (result.order.setProduct(result.product));
      let associatedUser = await (result.order.setUser(result.user));

      // send email
      let mailResult = await CustomMailerService.orderConfirm(result);

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
  status: async function(req, res) {
    console.log(req.body.SerialNumber);
    console.log(req.body.email);

    try{
      let userData = await db.User.findOne({
            where: {
              email: req.body.email
            }
          });

      if (userData === null) {
        return res.serverError({
          msg: '沒有此User！'
        });
      }

      let orderProduct = await db.Order.findOne({
            where: {
              SerialNumber: req.body.SerialNumber,
              UserId: userData.id
            },
            include: [
              {
                model: db.User
              }, {
                model: db.Shipment
              }, {
                model: db.Product
              }
            ]
        });

      if (orderProduct === null) {
        return res.serverError({
          msg: '沒有此訂單'
        });
      }


      var bank = sails.config.bank;
      return res.ok({
        order: orderProduct,
        bank: bank
      });

    } catch (error) {
      console.log ('error',error.stack);
      return res.serverError(error);
    }
  }
};

module.exports = OrderController;
