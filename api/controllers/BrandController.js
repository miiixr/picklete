let BrandController = {

  create: async (req, res) => {

    if (req.method === "GET") {
      return res.view("admin/brandCreate", {
      pageName: "/admin/brands"
      });
    }

    var params = req.body;


    console.log('admin/create params >>>', params);

    if (! params) {
      return res.redirect("/admin/brands");
    }

    let brandData = {
      avatar: params['avatar'],
      name: params['name'],
      type: params['type'] || "OTHER",
      desc: params['desc'],
      banner: params['banner'],
      photos: params['photos[]']
    };

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
      pageName: "/admin/brands",
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
      var domain = sails.config.domain || process.env.domain || 'http://localhost:1337';
      var _processPath = function (originPath) {
        var path = originPath.split(process.cwd())[1];
        path = path.replace('.tmp/', '');
        return path;
      }
      var updateData = req.body;
      let uploadInput = ["avatar", "photos[]", "banner"];
      let files = await ImageService.upload(req, uploadInput);
      console.log(files);
      brand.name = updateData.name;
      brand.type = updateData.type;
      brand.desc = updateData.desc;
      // brand.banner = updateData.banner;
      // brand.photos = updateData.photos;
      if (files[0].length) {
        await ImageService.resize({
          src: files[0][0].fd,
          dst: files[0][0].fd,
          width: 600,
          height: 600
        });
        brand.avatar = domain + _processPath(files[0][0].fd);
        brand.avatar = brand.avatar.replace('.tmp/', '');
      }
      let photos = files[1];

      if (photos.length) {
        for (let i in photos) {
          console.log(photos[i].fd);
          await ImageService.resize({
            src: photos[i].fd,
            dst: photos[i].fd,
            width: 1100,
            height: 500
          });
          photos[i] = domain + _processPath(photos[i].fd);
        }
        brand.photos = photos;
      }
      if (files[2].length) {
        await ImageService.resize({
          src: files[2][0].fd,
          dst: files[2][0].fd,
          width: 1100,
          height: 250
        });
        brand.banner = domain + _processPath(files[2][0].fd);
      }
      let updatedBrand = await brand.save();
      return res.redirect("/admin/brands");
    } catch (e) {
      let msg = e.message;
      return res.serverError({msg});

    }

  }

};
module.exports = BrandController;
