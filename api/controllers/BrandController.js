let BrandController = {
  
  create: async (req, res) => {

    if (req.method === "GET") {
      return res.view("admin/brandCreate", {
        pageName: "brands"
      });
    }
    var domain = "http://test/upload";
    var brandData = req.body;
    // console.log(brandData);

    let uploadInput = ["avatar", "photos[]", "banner"];
    let files = await ImageService.upload(req, uploadInput);

    if (files[0].length) {
      brandData.avatar = domain + files[0][0].fd.split(process.cwd())[1];
    }

    let photos = files[1];
    if (photos.length) {
      for (let i in photos) {
        photos[i] = domain + photos[i].fd.split(process.cwd())[1];
      }
      brandData.photos = photos;
    }

    if (files[2].length) {
      brandData.banner = domain + files[2][0].fd.split(process.cwd())[1];
    }
    if (brandData.type == null){
      brandData.type = "OTHER";
    }
    console.log(brandData);

    // create brand
    try {

      await db.Brand.create(brandData);
      return res.redirect("/admin/brands");

    } catch (e) {
      return res.serverError(e);
    }
  },

  list: async (req, res) => {

    let brandsGood = await db.Brand.findAll({
      where: {
        type: 'PRIME_GOOD'
      }
    });

    let brandsAgent = await db.Brand.findAll({
      where: {
        type: 'AGENT'
      }
    });

    let brandLock = await db.Brand.findAll({
      where: {
        type: 'OTHER'
      }
    });

    // console.log(brands);

    // return res.ok(brands);
    res.view("admin/brandList", {
      pageName: "brands",
      brands: brandsGood,
      agents: brandsAgent,
      brandLocks: brandLock
    });
  },

  update: async (req, res) => {

    try {
      let brandId = req.query.id; 
      let brand = await db.Brand.findById(brandId)
      if(!brand) throw new Error ('找不到這個 brand');
      console.log(brand.dataValues);
      if (req.method === "GET") {
      return res.view("admin/brandCreate", {
        brand: brand.dataValues || {}
      });
    }
      var updateData = req.body;
      console.log(req.body);
      brand.name = updateData.name;
      // brand.avatar = updateData.avatar;
      brand.type = updateData.type;
      brand.desc = updateData.desc;
      // brand.banner = updateData.banner;
      // brand.photos = updateData.photos;
      console.log(brand);
      let updatedBrand = await brand.save();

      return res.redirect("/admin/brands");

    } catch (e) {
      let msg = e.message;
      return res.serverError({msg});

    }

  }

};
module.exports = BrandController;