import {sprintf} from 'sprintf-js';
import moment from 'moment';

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
        fullName: user.fullName
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        fullName: user.fullName,
        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3:sails.config.store.name3,
        serviceMail: sails.config.store.serviceMail,
      });

      mailSendConfig.type = 'greeting';

      return mailSendConfig;

    } catch (e) {
      throw error;
    }

  },
  orderConfirm: (result) => {

    try {
      console.log("result",result);
      var orderConfirmTemplete = sails.config.mail.templete.orderConfirm;
      var mailSendConfig = {...orderConfirmTemplete, to: result.order.User.email};
      var productsName = result.OrderItems.map((item) => item.name);
      var DOMAIN_HOST = process.env.DOMAIN_HOST || 'localhost:1337';
      var orderConfirmLink = `http://${DOMAIN_HOST}/order/paymentConfirm?serial=${result.order.serialNumber}`
      var {bank} = sails.config;

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {orderSerialNumber: result.order.serialNumber});
      mailSendConfig.html = sprintf(mailSendConfig.html, {
        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3:sails.config.store.name3,
        orderTime: sails.moment(result.order.createdAt).format('YYYY/MM/DD HH:mm:ss'),
        shipmentUsername: result.order.User.fullName,
        shipmentId: result.order.User.email,
        orderSerialNumber: result.order.serialNumber,
        deadLine:  sails.moment(result.order.createdAt).add(3, 'days').format('YYYY/MM/DD HH:mm:ss'),
        productName: productsName.join('、'),
        serviceMail: sails.config.store.serviceMail,
        // fullName: result.order.User.username,
        // orderSerialNumber: result.order.serialNumber,
        // productName: productsName.join('、'),
        // bankId: result.order.bankId,
        // bankName: result.order.bankName,
        // accountId: result.order.bankAccountId,
        // accountName: result.order.bankAccountName,
        // paymentTotalAmount: result.order.paymentTotalAmount,
        // shipmentUsername: result.order.Shipment.username,
        // shipmentAddress: result.order.Shipment.address,
        // storeName: sails.config.store.name,
        // orderConfirmLink
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
        fullName: user.username
      });

      mailSendConfig.type = 'orderSync';

      return {...mailSendConfig, syncLink, syncLinkHost, syncLinkParams};

    } catch (e) {
      throw error;
    }

  },
  paymentConfirm: (order) => {
    try {
      console.log("order",order);
      var paymentConfirmTemplete = sails.config.mail.templete.paymentConfirm;
      var mailSendConfig = {...paymentConfirmTemplete, to: order.User.email};

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {orderSerialNumber: order.serialNumber});
      mailSendConfig.text = sprintf(mailSendConfig.text, {

        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3:sails.config.store.name3,
        paymentTotalAmount: order.paymentTotalAmount,
        orderSerialNumber: order.serialNumber,
        serviceMail: sails.config.store.serviceMail,
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
        storeName2: sails.config.store.name2,
        storeName3:sails.config.store.name3,
        paymentTotalAmount: order.paymentTotalAmount,
        orderSerialNumber: order.serialNumber,
        serviceMail: sails.config.store.serviceMail,

      });

      mailSendConfig.type = 'deliveryConfirm';
      return mailSendConfig;
    } catch (e) {
      throw error;
    }

  },
  sendMail: async (message) => {

    try {
      if(sails.config.environment === 'production' || sails.config.mail.active){
        let send = await sails.config.mail.mailer.send(message.toJSON());
        console.log("send!!!",send);
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

  checkForgotPasswordMail: async({user, link}) => {
    try {
      var checkForgotTpl = sails.config.mail.templete.checkForgot;
      var email = user.email;
      var mailSendConfig = {...checkForgotTpl, from: sails.config.mail.config.from, to: email};
      mailSendConfig.subject = sprintf(mailSendConfig.subject, {
        storeName: sails.config.store.name
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        fullName: user.fullName,
        link: link,
        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3:sails.config.store.name3,
        serviceMail: sails.config.store.serviceMail,
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
        fullName: user.fullName
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        fullName: user.fullName,
        createdAt: sails.moment(passport.updatedAt).format('YYYY/MM/DD HH:mm:ss'),
        userId: user.email,
        password: password,
        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3: sails.config.store.name3,
        serviceMail: sails.config.store.serviceMail,
      });

      mailSendConfig.type = 'newPassword';

      return mailSendConfig;
    } catch (e) {
      throw e;
    }
  },

  verificationMail: async(user,link) => {
    try {

      var verificationTpl = sails.config.mail.templete.verification;
      var email = user.email;
      var mailSendConfig = {...verificationTpl, from: sails.config.mail.config.from, to: email};
      mailSendConfig.subject = sprintf(mailSendConfig.subject, {
        fullName: user.fullName
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        fullName: user.fullName,
        link: link,
        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3:sails.config.store.name3,
        serviceMail: sails.config.store.serviceMail,
      });

      mailSendConfig.type = 'verification';

      return mailSendConfig;
    } catch (e) {
      throw e;
    }
  },

  userUpdateMail: async(user) => {

    try {
      var userUpdateTpl = sails.config.mail.templete.userUpdate;
      var email = user.email;
      var mailSendConfig = {...userUpdateTpl, from: sails.config.mail.config.from, to: email};
      mailSendConfig.subject = sprintf(mailSendConfig.subject, {
        fullName: user.fullName
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        fullName: user.fullName,
        createdAt: sails.moment(new Date()).format('YYYY/MM/DD HH:mm:ss'),
        userId: user.email,
        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3: sails.config.store.name3,
        serviceMail: sails.config.store.serviceMail,
      });

      mailSendConfig.type = 'verification';

      return mailSendConfig;
    } catch (e) {
      throw e;
    }

  },

  shopCodeMail: ({user, shopCode}) => {
    try {

      var shopCodeTpl = sails.config.mail.templete.shopCode;

      var email = user.email;
      var mailSendConfig = {...shopCodeTpl, from: sails.config.mail.config.from, to: email};
      mailSendConfig.subject = sprintf(mailSendConfig.subject, {
        fullName: user.fullName
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        fullName: user.fullName,
        shopCodeToken: shopCode.code,
        shopCodeSentContent: shopCode.sentContent || '',
        startDate: moment(shopCode.startDate).format('YYYY/MM/DD'),
        endDate: moment(shopCode.endDate).format('YYYY/MM/DD'),
        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3: sails.config.store.name3,
        serviceMail: sails.config.store.serviceMail,
      });

      mailSendConfig.type = 'shopCode';

      return mailSendConfig;
    } catch (e) {
      throw e;
    }
  }



};
