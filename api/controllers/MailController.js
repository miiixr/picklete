var aws = require('aws-sdk');

/*
var mailer = MailerService.create('ses', {
  from: 'no-reply@ghaiklor.com',
  transporter: {
    ses: new aws.SES(), // instantiated AWS SES object with new AWS.SES()
    accessKeyId: 'MY_KEY', // AWS access key
    secretAccessKey: 'MY_SECRET', // AWS secret key
    sessionToken: '', // Session token
    region: '', // Specify the region to send the service request
    httpOptions: {}, // A hash of options to pass to the low-level AWS HTTP request
    rateLimit: 5 // Specify the amount of messages can be sent in 1 second
  }
});
*/

var mailer = MailerService.create('direct', {
  from: 'no-reply@ghaiklor.com',
  transporter: {
    name: 'example.mx-server.com', // hostname to be used when introducing the client to the MX server
    debug: true // if true, the connection emits all traffic between client and server as `log` events
  }
});

module.exports = {
  send: function(req, res) {
    mailer
      .send({
        to: req.param('to')
      })
      .then(res.ok)
      .catch(res.serverError);
  }
};
