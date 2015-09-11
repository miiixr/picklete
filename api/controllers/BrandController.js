let BrandController = {

  create: async (req, res) => {

    if (req.method === "GET") {
      return res.view("admin/brandCreate", {
      pageName: "/admin/brands"
      });
    }

    var params = req.body;

    console.log('craete server ', params);

    if (! params) {
      return res.redirect("/admin/brands");
    }

    let brandData = {
      avatar: params['avatar'],
      name: params['name'],
      type: params['type'] || "OTHER",
      desc: params['desc'],
      banner: params['banner'],
      photos: params['photos']
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
      if( ! brand) throw new Error ('找不到這個 brand');
      if (req.method === "GET") {
        return res.view("admin/brandCreate", {
          brand: brand.dataValues || null
        });
      }

      var params = req.body;

      console.log('craete server ', params);

      if (! params) {
        return res.redirect("/admin/brands");
      }

      brand.avatar = params['avatar'];
      brand.name = params['name'];
      brand.type = params['type'] || "OTHER";
      brand.desc = params['desc'];
      brand.banner = params['banner'];
      brand.photos = params['photos'];

      let updatedBrand = await brand.save();
      return res.redirect("/admin/brands");
    } catch (e) {
      let msg = e.message;
      return res.serverError({msg});

    }

  }

};
module.exports = BrandController;
