var ses = MailerService.create('ses', {
  from: 'no-reply@ghaiklor.com',
  transporter: {
    ses: {}, // instantiated AWS SES object with new AWS.SES()
    accessKeyId: 'MY_KEY', // AWS access key
    secretAccessKey: 'MY_SECRET', // AWS secret key
    sessionToken: '', // Session token
    region: '', // Specify the region to send the service request
    httpOptions: {}, // A hash of options to pass to the low-level AWS HTTP request
    rateLimit: 5 // Specify the amount of messages can be sent in 1 second
  }
});

module.exports = {
  send: function(req, res) {
    ses
      .send({
        to: req.param('to')
      })
      .then(res.ok)
      .catch(res.serverError);
  }
};
