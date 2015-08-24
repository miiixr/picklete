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
  paymentConfirm: async (req, res) => {
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
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  // 查詢
  status: async function(req, res) {

    try{
      var {email} = req.query;
      var orderSyncToken = req.query.token;
      let userData = await db.User.findOne({
        where: {email, orderSyncToken}
      });

      let purchaseHistory = await db.Order.findAll({
        where: {
          UserId: userData.id
        },
        include: [
          {
            model: db.User
          }, {
            model: db.Shipment
          }, {
            model: db.OrderItem
          }
        ]
      });

      return res.ok({purchaseHistory});

    } catch (error) {
      console.log ('error',error.stack);
      return res.serverError(error);
    }
  },

  sync: async (req, res) => {
    try {
      var email = req.query.email;
      var user = await db.User.find({where: {email}});

      let result = await CustomMailerService.orderSync(user);

      res.ok(result);

    } catch (e) {
      console.error(e.stack);
      let {message} = e;

      res.serverError({message});
    }
  }
};

module.exports = OrderController;
