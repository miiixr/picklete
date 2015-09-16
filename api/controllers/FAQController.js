let FAQController = {
  FAQ : async(req,res) => {
    let FAQTypes = await db.FAQType.findAll({
      include: [{
        model: db.FAQ
      }]
    })
    return res.view("user/controlFAQ", {
      FAQTypes: FAQTypes
    });
  },
  FAQAdd : async(req,res) => {
    try{
      let FAQTypes = await db.FAQType.findAll();
      if(req.method == "GET"){
        return res.view("user/controlFAQAdd",{
         FAQTypes: FAQTypes || null
        });
      }
      var FAQData = {
        title: req.body.title,
        answer: req.body.answer,
        FAQTypeId: req.body.typeId
      }

      return db.FAQ.create(FAQData)
      .then(function(newDptSub) {
        return res.redirect("/admin/FAQ");
      })
      .catch(function(error) {
        return res.serverError(error);
      });
      
    } catch(e){
      console.log(e);
    }
  },
  FAQTypeUpdate : async(req,res) => {
    try{
      let FAQTypes = await db.FAQType.findAll();
      if(req.method == "GET"){
        return res.view("user/controlFQAType",{
          FAQTypes: FAQTypes || null
        });
      }
      console.log(req.body);
      var name = req.body.name;
      for(var i=0;i<name.length;i++){
        if(name[i] != ""){
          var createTypeData = await db.FAQType.create({
            name: name[i]
          });
        }
      }
      var FAQTypeId = req.body.FAQTypeId;
      var FAQType = req.body.FAQType;
      for(var i=0;i<FAQTypeId.length;i++){
        var updateFAQType = await db.FAQType.findById(FAQTypeId[i]);
        if(FAQType[i]!=""){
          updateFAQType.name = FAQType[i];
          var update = updateFAQType.save();
        }
      }
      return res.redirect("/admin/FAQ");
    } catch(e){
      console.log(e);
    }
  }
};
module.exports = FAQController;