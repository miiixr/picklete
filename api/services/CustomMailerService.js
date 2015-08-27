import {sprintf} from 'sprintf-js';

module.exports = {
  orderConfirm: (result) => {

    try {

      var orderConfirmTemplete = sails.config.mail.templete.orderConfirm;
      var mailSendConfig = {...orderConfirmTemplete, to: result.order.User.email};
      var productsName = result.products.map((product) => product.name);
      var DOMAIN_HOST = process.env.DOMAIN_HOST || 'localhost:1337';
      var orderConfirmLink = `http://${DOMAIN_HOST}/order/paymentConfirm?serial=${result.order.serialNumber}`

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {orderSerialNumber: result.order.serialNumber});
      mailSendConfig.html = sprintf(mailSendConfig.html, {
        username: result.order.User.username,
        orderSerialNumber: result.order.serialNumber,
        productName: productsName.join('、'),
        shipmentUsername: result.order.Shipment.username,
        shipmentAddress: result.order.Shipment.address,
        orderConfirmLink
      });

      mailSendConfig.type = 'orderConfirm';

      return mailSendConfig;

    } catch (error) {
      throw error;
    }

  },
  orderSync: (user, host) => {

    try {
      var orderSyncTemplete = sails.config.mail.templete.orderSync;
      var email = user.email;
      var mailSendConfig = {...orderSyncTemplete, to: email};

      var addr = 'localhost';
      var port = sails.config.port;

      var syncLinkHost = host || `/api/order/status`
      var syncLinkParams = `token=${user.orderSyncToken}`
      var syncLink = `${syncLinkHost}?${syncLinkParams}`

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {email});
      mailSendConfig.html = sprintf(mailSendConfig.html, {
        syncLink,
        email,
        username: user.username
      });

      mailSendConfig.type = 'orderSync';

      return {...mailSendConfig, syncLink, syncLinkHost, syncLinkParams};

    } catch (e) {
      throw error;
    }

  },
  paymentConfirm: (order) => {
    try {

      var paymentConfirmTemplete = sails.config.mail.templete.paymentConfirm;
      var mailSendConfig = {...paymentConfirmTemplete, to: order.User.email};

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {orderSerialNumber: order.serialNumber});
      mailSendConfig.text = sprintf(mailSendConfig.text, {
        username: order.User.username
      });

      mailSendConfig.type = 'paymentConfirm';

      return mailSendConfig;
    } catch (e) {
      throw error;
    }



  },
  deliveryConfirm: (order) => {

    try {
      var deliveryConfirmTemplete = sails.config.mail.templete.deliveryConfirm;
      var mailSendConfig = {...deliveryConfirmTemplete, to: order.User.email};

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {orderSerialNumber: order.serialNumber});
      mailSendConfig.text = sprintf(mailSendConfig.text, {
        username: order.User.username
      });

      mailSendConfig.type = 'deliveryConfirm';
      return mailSendConfig;
    } catch (e) {
      throw error;
    }

  },
  sendMail: async (message) => {

    try {
      if(sails.config.environment === 'prodcution'){
        await sails.config.mail.mailer.send(message.toJSON());
        message.error = '';
      }
      else {
        message.error = 'test only';
      }
      message.success = true;

      await message.save();

    } catch (error) {
      console.error(error.stack);
      message.success = false;
      message.error = error.message;
      await message.save();

    }
  }

};
