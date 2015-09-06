let BrandController = {
  
  create: async (req, res) => {

    if (req.method === "GET") {
      return res.view("admin/brandCreate", {
        pageName: "brands"
      });
    }
    var domain = sails.config.domain || process.env.domain || 'http://localhost:1337';
    var brandData = req.body;
    var _processPath = function (originPath) {
      var path = originPath.split(process.cwd())[1];
      path = path.replace('.tmp/', '');
      return path;
    }

    let uploadInput = ["avatar", "photos[]", "banner"];
    let files = await ImageService.upload(req, uploadInput);

    if (files[0].length) {
      brandData.avatar = domain + _processPath(files[0][0].fd);
      brandData.avatar = brandData.avatar.replace('.tmp/', '');
    }

    let photos = files[1];
    if (photos.length) {
      for (let i in photos) {
        photos[i] = domain + _processPath(photos[i].fd);
      }
      brandData.photos = photos;
      brandData.avatar = brandData.avatar.replace('.tmp/', '');
    }

    if (files[2].length) {
      brandData.banner = domain + _processPath(files[2][0].fd);
    }
    if (brandData.type == null){
      brandData.type = "OTHER";
    }

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
      if (req.method === "GET") {
      return res.view("admin/brandCreate", {
        brand: brand.dataValues || {}
      });
    }
      var updateData = req.body;
      brand.name = updateData.name;
      // brand.avatar = updateData.avatar;
      brand.type = updateData.type;
      brand.desc = updateData.desc;
      // brand.banner = updateData.banner;
      // brand.photos = updateData.photos;
      let updatedBrand = await brand.save();

      return res.redirect("/admin/brands");

    } catch (e) {
      let msg = e.message;
      return res.serverError({msg});

    }

  }

};
module.exports = BrandController;