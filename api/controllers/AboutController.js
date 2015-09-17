let AboutController = {

  show : async(req,res) => {
    return res.view("main/about")
  },

  create : async(req,res) => {
    try{
      let about = await db.About.findOne();
      if (req.method === "GET") {
         return res.view("admin/controlAbout", {
           pageName: "/admin/about",
           about: about.dataValues || null
        });
      }

      var params = req.body;

      if (! params) {
        return res.redirect("/admin/about");
      }
    
      about.brandVision = params['brandVision'];
      about.productPhotos = params['productPhotos'];
      about.aboutCompany = params['aboutCompany'];
      about.dealerPhotos = params['dealerPhotos'];
      about.dealerNames = params['dealerNames'];

      let updatedAbout = await about.save();
      return res.redirect("/admin/about");
    } catch(e){
      let msg = e.message;
      return res.serverError({msg});
    }
  } 
};

module.exports = AboutController;