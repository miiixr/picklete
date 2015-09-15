let FAQController = {
  FAQ : async(req,res) => {
    let FAQType = await db.FAQType.findAll({
      include: [{
        model: db.FAQ
      }]
    })
    return res.view("user/controlFAQ", {
      FAQType: FAQType
    });
  }
};
module.exports = FAQController;