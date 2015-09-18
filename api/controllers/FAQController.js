let FAQController = {
  FAQ : async(req,res) => {
    try{

      let FAQTypes = await db.FAQType.findAll({
        include: [{
          model: db.FAQ
        }]
      })

      return res.view("user/controlFAQ", {
        FAQTypes: FAQTypes
      });

    } catch(e){
      console.error(e.stack);
      let msg = e.message;
      return res.serverError({msg});
    }
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

  FAQUpdate : async(req,res) => {
   
    try{
     
      var FAQId = req.query.FAQId;
      let FAQ = await db.FAQ.findById(FAQId);
      let FAQTypes = await db.FAQType.findAll();
      
      if(req.method == "GET"){
        return res.view("user/controlFAQAdd",{
          FAQ :FAQ,
          FAQTypes : FAQTypes || null
        });
      }
      
      var params = req.body;

      if (! params) {
        return res.redirect("/admin/FAQ");
      
      }
      FAQ.title = params["title"];
      FAQ.FAQTypeId = params["typeId"];
      FAQ.answer = params["answer"];
      let updatedFAQ = await FAQ.save();
      
      return res.redirect("/admin/FAQ");

    } catch(e){
      console.log(e);
      return res.redirect("/admin/FAQ");
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
      var name = req.body.name;
      
      for(var i=0;i<name.length;i++){
        if(name[i] != ""){
          var createTypeData = await db.FAQType.create({
            name: name[i]
          });
        }
      }
      
      try{
        var FAQTypeId = req.body.FAQTypeId;
        var FAQType = req.body.FAQType;

        for(var i=0;i<FAQTypeId.length;i++){
          var updateFAQType = await db.FAQType.findById(FAQTypeId[i]);
          if(FAQType[i]!=""){
            updateFAQType.name = FAQType[i];
            var update = updateFAQType.save();
          }
        }
        
      } catch(e){
        console.log(e);
      }
      
      return res.redirect("/admin/FAQ");
    } catch(e){
      console.log(e);
    }
  },

  FAQDelete : async(req,res) => {
    
    try{
      var FAQDelete = await db.FAQ.destroy({
        where: {
          id :req.body.id
        }
      });
      
      return res.redirect("/admin/FAQ");
    } catch(e){
      console.log(e);
    }
  },

  FAQTypeDelete : async(req,res) => {
    
    try{
      var FAQDelete = await db.FAQType.destroy({
        where: {
          id :req.body.id
        }
      });
      return res.redirect("/admin/FAQTypeUpdate");
    
    } catch(e){
      console.log(e);
    }
  }
};
module.exports = FAQController;