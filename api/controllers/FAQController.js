let FAQController = {

  show : async(req,res) => {
    let FAQTypes = await db.FAQType.findAll({
        include: [{
          model: db.FAQ
        }],
        //order: []
    });  
    return res.view("main/FAQ",{
      FAQTypes : FAQTypes
    }); 
  },

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

      let FAQAdd = db.FAQ.create(FAQData);
      
      return res.redirect("/admin/FAQ");
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

      try{
        FAQService.create(name);
      } catch(e){
        console.log(e);
        return res.serverError(e);
      }

      try{
        var FAQTypeId = req.body.FAQTypeId;
        var FAQType = req.body.FAQType;

        FAQService.update(FAQType,FAQTypeId);
      } catch(e){
        console.log(e);
        return res.serverError(e);
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
      var FAQDelete = await db.FAQ.destroy({
        where: {
          FAQTypeId :req.body.id
        }
      });

      var FAQTypeDelete = await db.FAQType.destroy({
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