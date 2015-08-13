var MailerService = require('sails-service-mailer');

var mailer = MailerService.create('direct', {
  from: 'no-reply@ghaiklor.com',
  transporter: {
    name: 'example.mx-server.com', // hostname to be used when introducing the client to the MX server
    debug: true // if true, the connection emits all traffic between client and server as `log` events
  }
});

module.exports = {
  orderConfirm: async () => {
    
    mailer
      .send({
        to: req.param('to')
      })
      .then(res.ok)
      .catch(res.serverError);

    return "";
  }
};
