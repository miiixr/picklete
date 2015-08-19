let sprintf = require("sprintf-js").sprintf

module.exports = {
  orderConfirm: async (result) => {
    var orderConfirmTemplete = sails.config.mail.templete.orderConfirm;
    var mailSendConfig = {...orderConfirmTemplete, to: result.user.email};

    mailSendConfig.subject = sprintf(mailSendConfig.subject, {orderSerialNumber: result.order.SerialNumber});
    mailSendConfig.text = sprintf(mailSendConfig.text, {
      username: result.user.username,
      orderSerialNumber: result.order.SerialNumber,
      productName: result.product.name,
      shipmentUsername: result.shipment.username,
      shipmentAddress: result.shipment.address
    });

    try {
      let result = await sails.config.mail.mailer.send(mailSendConfig);

      return {result};
    } catch (error) {
      console.error(error.stack);
      return {error};
    }

  }
};
