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

    var newOrder = req.body.order;
    try {

      let result = await OrderService.create(newOrder);
      let mailResult = await CustomMailerService.orderConfirm(result);

      return res.ok(result);
    } catch (e) {
      console.log ('err=>',e);
      return res.serverError(e);
    }
  },


  // 查詢
  status: async function(req, res) {

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
