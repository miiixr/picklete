import crypto from 'crypto';
import {sprintf} from 'sprintf-js';

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

  },
  orderSync: async (user, host) => {

    try {
      var orderSyncTemplete = sails.config.mail.templete.orderSync;
      var email = user.email;
      var mailSendConfig = {...orderSyncTemplete, to: email};
      var token = await new Promise((resolve) => crypto.randomBytes(20, (error, buf) => resolve(buf.toString("hex"))));

      user.orderSyncToken = token;
      await user.save();

      var addr = 'localhost';
      var port = sails.config.port;

      var syncLinkHost = host || `/api/order/status`
      var syncLinkParams = `token=${token}`
      var syncLink = `${syncLinkHost}?${syncLinkParams}`

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {email});
      mailSendConfig.text = sprintf(mailSendConfig.text, {
        syncLink,
        email,
        username: user.username
      });

      let result = await sails.config.mail.mailer.send(mailSendConfig);

      return {syncLink, syncLinkHost, syncLinkParams};
    } catch (error) {
      console.log(error.stack);
      throw error;
    }

  }

};
