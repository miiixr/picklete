import {sprintf} from 'sprintf-js';

module.exports = {

  /*
   * 向新註冊的使用者問安
   */
  greeting: (user) => {

    try {
      var greetingTpl = sails.config.mail.templete.greeting;
      var email = user.email;
      var mailSendConfig = {...greetingTpl, from: sails.config.mail.config.from, to: email};

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {
        username: user.username
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        storeName: sails.config.store.name,
        username: user.username
      });

      mailSendConfig.type = 'greeting';

      return mailSendConfig;

    } catch (e) {
      throw error;
    }

  },
  orderConfirm: (result) => {

    try {
      var orderConfirmTemplete = sails.config.mail.templete.orderConfirm;
      var mailSendConfig = {...orderConfirmTemplete, to: result.order.User.email};
      var productsName = result.OrderItems.map((item) => item.name);
      var DOMAIN_HOST = process.env.DOMAIN_HOST || 'localhost:1337';
      var orderConfirmLink = `http://${DOMAIN_HOST}/order/paymentConfirm?serial=${result.order.serialNumber}`
      var {bank} = sails.config;

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {orderSerialNumber: result.order.serialNumber});
      mailSendConfig.html = sprintf(mailSendConfig.html, {
        username: result.order.User.username,
        orderSerialNumber: result.order.serialNumber,
        productName: productsName.join('、'),
        bankId: result.order.bankId,
        bankName: result.order.bankName,
        accountId: result.order.bankAccountId,
        accountName: result.order.bankAccountName,
        paymentTotalAmount: result.order.paymentTotalAmount,
        shipmentUsername: result.order.Shipment.username,
        shipmentAddress: result.order.Shipment.address,
        storeName: sails.config.store.name,
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
        storeName: sails.config.store.name,
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
        storeName: sails.config.store.name,
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
        storeName: sails.config.store.name,
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
      if(sails.config.environment === 'production'){
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
  },

  checkForgotPasswordMail: async(user) => {
    try {
      var checkForgotTpl = sails.config.mail.templete.checkForgot;
      var email = user.email;
      var forgotToken = user.forgotToken;
      var mailSendConfig = {...checkForgotTpl, from: sails.config.mail.config.from, to: email};
      mailSendConfig.subject = sprintf(mailSendConfig.subject, {
        storeName: sails.config.store.name
      });

      let domain = sails.config.domain || process.env.domain || 'http://localhost:1337';

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        storeName: sails.config.store.name,
        username: user.username,
        link: `${domain}?email=${email}&forgotToken=${forgotToken}`
      });

      mailSendConfig.type = 'checkForgotPassword';

      return mailSendConfig;
    } catch (e) {
      throw e;
    }
  },

  newPasswordMail: async({user,passport}) =>{
    try {
      var newPasswordTpl = sails.config.mail.templete.newPassword;
      var email = user.email;
      var password = passport.password;
      var mailSendConfig = {...newPasswordTpl, from: sails.config.mail.config.from, to: email};
      mailSendConfig.subject = sprintf(mailSendConfig.subject, {
        username: user.username
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        storeName: sails.config.store.name,
        username: user.username,
        password: password,
      });

      mailSendConfig.type = 'newPassword';

      return mailSendConfig;
    } catch (e) {
      throw e;
    }
  }

};
