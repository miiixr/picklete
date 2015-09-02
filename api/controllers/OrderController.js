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
      let order = await db.Order.findOne({
        where: {
          serialNumber: req.query.serial
        }
      });
      if (!order) {
        throw ('order not found')
      }

      // 預設匯款日期今天
      if (!order.paymentConfirmDate) {
        order.paymentConfirmDate = Date.now();
      }

      //console.log(order.paymentConfirmDate);

      return res.view({order});
    } catch (error) {
      return res.serverError(error);
    }
  },
  paymentConfirmSave: async (req, res) => {
    try {
      let order = await db.Order.findOne({
        where: {
          serialNumber: req.query.serial
        }
      });
      if (!order) {
        throw ('order not found')
      }
      order.paymentIsConfirmed = true;
      order.paymentConfirmDate = req.body.paymentConfirmDate;
      order.paymentConfirmName = req.body.paymentConfirmName;
      order.paymentConfirmPostfix = req.body.paymentConfirmPostfix;
      order.save();
      return res.json({
        result: true
      });
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

      var orderSyncToken = req.query.token;
      let userData = await db.User.findOne({
        where: {orderSyncToken}
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
      var host = req.query.host || null;
      var user = await db.User.find({where: {email}});

      let result = await CustomMailerService.orderSync(user, host);
      result.success = true;
      res.ok(result);

    } catch (e) {
      console.error(e.stack);
      let {message} = e;

      res.serverError({message, success: false});
    }
  },

  statusUpdate: async (req, res) => {

    let id = req.param("id");
    let status = req.query.status;
    console.log('=== id ===', id);
    console.log('=== status ===', status);
    try {
      let order = await db.Order.find({
        where: {id},
        include: [{model: db.User}]
      });;

      order.status = status;

      await order.save();

      let result = await CustomMailerService[status](order);

      result.success = true;

      res.ok(result);

    } catch (e) {
      console.error(e.stack);
      let {message} = e;

      res.serverError({message, success: false});
    }
  }

};

module.exports = OrderController;
