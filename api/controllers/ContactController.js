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
      if(user.issue)
        user.issue = user.issue.join("、");

      // 寄給使用者
      let messageConfig = await CustomMailerService.contactUs(user, user.email);
      let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);

      // 寄給系統信箱
      let systemMail = "service@wevo.com.tw";
      messageConfig = await CustomMailerService.contactUs(user, systemMail);
      message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);

      // return res.ok();

      req.flash('info', '你的訊息已送出');
      res.redirect('/');
      return

    } catch (e) {
      console.error(e);
      throw error;
    }
  }

};