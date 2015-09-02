import moment from 'moment';
let sprintf = require("sprintf-js").sprintf;

module.exports = {
  generateOrderSerialNumber: async () => {
    let dateString = OrderService._dateFormat(moment());
    let startDate = moment().startOf('day').toDate();
    let endDate = moment().startOf('day').add(1, 'days').add(-1, 'seconds').toDate();

    let todayOrderConut = await db.Order.count({
      where: {
        createdAt: {
          between: [startDate, endDate]
        }
      }
    })

    let todayOrderConutString = sprintf("%03d", todayOrderConut);

    return `${dateString}${todayOrderConutString}`;

  },

  create: async (newOrder) => {
    let result = {};

    try {

      let orderItems = newOrder.orderItems.reduce((result, orderItem) => {
        if(parseInt(orderItem.quantity) === 0) return result;

        result.push(orderItem);

        return result;
      }, [])

      let products = await* orderItems.map(async (orderItem) => {

        let product = await db.Product.findById(orderItem.ProductId);

        if (!product)
          throw new Error('找不到商品！ 請確認商品ID！');

        if (product.stockQuantity === 0)
          throw new Error('商品售鑿！');

        if (product.stockQuantity < orderItem.quantity)
          throw new Error('商品數量不足！');
        product.stockQuantity = product.stockQuantity - orderItem.quantity;

        return product;
      });

      let userFindOrCreateResult = await db.User.findOrCreate({
        where: {
          email: newOrder.user.email
        },
        defaults: newOrder.user
      });

      let buyer = userFindOrCreateResult[0];

      let thisOrder = {
        quantity: newOrder.quantity,
        UserId: buyer.id,
        serialNumber: await OrderService.generateOrderSerialNumber()
      };

      let isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
      let transaction = await db.sequelize.transaction({isolationLevel});

      try {

        let createdOrderItems = await* orderItems.map((orderItem) => db.OrderItem.create(orderItem));
        await* products.map((product) => product.save({transaction}));

        let createdOrderItemIds = createdOrderItems.map((orderItem) => orderItem.id);

        let createdOrder = await db.Order.create(thisOrder, {transaction});
        let createdShipment = await db.Shipment.create(newOrder.shipment, {transaction});
        let associatedShipment = await createdOrder.setShipment(result.shipment, {transaction});
        let associatedProduct = await createdOrder.setOrderItems(createdOrderItems, {transaction});
        let associatedUser = await createdOrder.setUser(result.user, {transaction});

        transaction.commit();

        result.products = products;
        result.success = true;
        result.bank = sails.config.bank;

        result.order = createdOrder.toJSON();
        result.order.OrderItems = createdOrderItems;
        result.order.User = buyer;
        result.order.Shipment = createdShipment;
      } catch (e) {
        console.error(e.stack);
        transaction.rollback();
        throw e;
      }

      return result

    } catch (e) {
      throw e;
    }


  },

  _dateFormat: (nowDate) => {
    let years = parseInt(nowDate.format('YY'));
    let month = parseInt(nowDate.format('MM'));
    let day = parseInt(nowDate.format('DD'));

    let alphabet = [
      '0','1','2','3','4',
      '5','6','7','8','9',
      'a','b','c','d','e',
      'f','g','h','i','j',
      'k','l','m','n','o',
      'p','q','r','s','t',
      'u','v','w','x','y',
      'z'];

    let result = `${years}${alphabet[month]}${alphabet[day]}`;

    return result;
  }
}
