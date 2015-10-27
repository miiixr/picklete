import {sprintf} from 'sprintf-js';
import moment from 'moment';



module.exports = {
  index: async function (req, res) {
    let company = await db.Company.findOne();
    res.view('main/contact', {
      company
    });
  },

  contactUs: async function (req, res) {

    try {

      let user = req.query;
      user.issue = user.issue.join("、");

      let messageConfig = await CustomMailerService.contactUs(user);
      let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);

      res.ok(send);

      //res.ok(mailSendConfig);
    } catch (e) {
      console.error(e);
      throw error;
    }
  }

};