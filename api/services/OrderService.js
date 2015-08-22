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
    var result = {
      product:null
    };

    try {
      // find product.
      let findProduct = await db.Product.findById(newOrder.product.id);

      if (!findProduct)
        return res.serverError({msg: '找不到商品！ 請確認商品ID！'});

      if (findProduct.stockQuantity === 0)
        return res.serverError({msg: '商品售鑿！'});

      if (findProduct.stockQuantity < newOrder.quantity)
        return res.serverError({msg: '商品數量不足！'});


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
        SerialNumber: await OrderService.generateOrderSerialNumber()
      };



      let isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
      let transaction = await db.sequelize.transaction({isolationLevel});

      try {
        findProduct.stockQuantity = findProduct.stockQuantity - newOrder.quantity
        await findProduct.save({transaction});
        let insertOrder = await db.Order.create(thisOrder, {transaction});
        let insertShipment = await db.Shipment.create(newOrder.shipment, {transaction});
        let associatedShipment = await insertOrder.setShipment(result.shipment, {transaction});
        let associatedProduct = await insertOrder.setProduct(result.product, {transaction});
        let associatedUser = await insertOrder.setUser(result.user, {transaction});

        transaction.commit();

        result.product = findProduct;
        result.user = buyer;
        result.order = insertOrder;
        result.shipment = insertShipment;
        result.success = true;
        result.bank = sails.config.bank;
      } catch (e) {
        console.error(e.stack);
        result.success = false;
        transaction.rollback();
        throw e;
      }

      return result

    } catch (e) {
      console.error(e.stack);

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
