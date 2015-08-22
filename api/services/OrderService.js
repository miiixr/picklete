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
        SerialNumber: await OrderService.generateOrderSerialNumber()
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
