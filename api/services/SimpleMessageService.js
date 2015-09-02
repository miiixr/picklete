import {sprintf} from 'sprintf-js';

module.exports = {

  /*
   * 發送歡迎簡訊
   */
  greeting: (user) => {
    try {
      var tpl = sails.config.sms.templete.greeting;
      var result = {...tpl, from: sails.config.sms.config.from, to: user.mobile};

      result.text = sprintf(result.text, {
        storeName: sails.config.store.name,
        username: user.username
      });

      return result;

    } catch (error) {
      throw error;
    }
  },
  send: async (msg) => {
    try {
      if (sails.config.environment === 'production') {

        var username = sails.config.sms.config.username;
        var password = sails.config.sms.config.password;

        if (username && password) {
          var smsurl = sprintf("http://%(host)s:%(port)s/SmSendGet.asp?username=%(username)s&password=%(password)s&dstaddr=%(dstaddr)s&encoding=%(encoding)s&DestName=%(dstname)s&dlvtime=&vldtime=&smbody=%(smbody)s&response=", {
            host: sails.config.sms.config.host,
            port: sails.config.sms.config.port,
            encoding: sails.config.sms.config.encoding,
            username: username,
            password: password,
            dstaddr: msg.to,
            dstname: msg.toName,
            smbody: encodeURIComponent(msg.text)
          })

          console.log('---------SMS DEBUG MESSAGE-----------');
          console.log(smsurl);
          console.log('-------------------------------------');

          var http = require('http');
          http.get(smsurl, function(res) {
            console.log("Got response: " + res.statusCode);
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              console.log('BODY: ' + chunk);

              //todo: save chunk to msg.response
              //todo: determine successful from chunk
            });
          }).on('error', function(e) {
            console.log("Got error: " + e.message);
          });

          msg.success = true;
          await msg.save();
        }
        else {
          msg.success = false;
          msg.error = "sms username or password not found in config"
          await msg.save();
        }

        msg.error = '';
      }
      else {
        msg.error = 'TEST_ONLY';
      }
    }
    catch (error) {
      console.error(error.stack);
      msg.success = false;
      msg.error = error.message;
      await msg.save();
    }
  }
};
