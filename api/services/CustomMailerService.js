var MailerService = require('sails-service-mailer');

var mailer = MailerService.create('direct', {
  from: 'no-reply@ghaiklor.com',
  transporter: {
    name: 'example.mx-server.com', // hostname to be used when introducing the client to the MX server
    debug: true // if true, the connection emits all traffic between client and server as `log` events
  }
});

module.exports = {
  orderConfirm: async (to) => {

    try {
      let result = await mailer.send({to})
      return {result};
    } catch (error) {
      console.error(error.stack);
      return {error};
    }

  }
};
