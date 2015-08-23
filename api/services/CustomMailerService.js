let sprintf = require("sprintf-js").sprintf

module.exports = {
  orderConfirm: async (result) => {
    var orderConfirmTemplete = sails.config.mail.templete.orderConfirm;
    var mailSendConfig = {...orderConfirmTemplete, to: result.user.email};
    var productsName = result.products.map((product) => product.name);

    mailSendConfig.subject = sprintf(mailSendConfig.subject, {orderSerialNumber: result.order.SerialNumber});
    mailSendConfig.text = sprintf(mailSendConfig.text, {
      username: result.user.username,
      orderSerialNumber: result.order.SerialNumber,
      productName: productsName.join('、'),
      shipmentUsername: result.shipment.username,
      shipmentAddress: result.shipment.address
    });

    try {
      let result = await sails.config.mail.mailer.send(mailSendConfig);

      return {result};
    } catch (error) {
      throw error;
    }

  }
};
