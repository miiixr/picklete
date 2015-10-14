import {sprintf} from 'sprintf-js';
import moment from 'moment';

module.exports = {

  index: async (req, res) => {
    try {
      let selectionActivities = await SelectionActiveService.getModel();
      let sliders = await db.Slider.findAll();
      let topicActivities = await TopicActiveService.getModel();
      let flashPromotions = await PromotionService.getModel();
      res.view("main/index", {
        selectionActivities,
        topicActivities,
        sliders,
        flashPromotions
      });

    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError({message, success: false});
    }
  },

  mail: async (req, res) => {
    try {
      let user = {
        username: 'test',
        email: 'lyhcode@gmail.com'
      };
      var greetingTpl = sails.config.mail.templete.greeting;
      var email = user.email;
      var mailSendConfig = {...greetingTpl, from: sails.config.mail.config.from, to: email};

      mailSendConfig.subject = sprintf(mailSendConfig.subject, {
        username: user.username
      });

      mailSendConfig.html = sprintf(mailSendConfig.html, {
        username: user.username,
        storeName: sails.config.store.name,
        storeName2: sails.config.store.name2,
        storeName3:sails.config.store.name3,
        serviceMail: sails.config.store.serviceMail,
      });

      mailSendConfig.type = 'greeting';

      let send = await sails.config.mail.mailer.send(mailSendConfig);

      res.ok(send);

      //res.ok(mailSendConfig);
    } catch (e) {
      console.error(e);
      throw error;
    }
  }

}
