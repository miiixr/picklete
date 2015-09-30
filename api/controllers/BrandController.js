import _ from 'lodash';

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

    let brands = await BrandService.list();

    // return res.ok(brands);
    res.view('admin/brandList', {
      pageName: '/admin/brands',
      brands: brands.brandsGood,
      agents: brands.brandsAgent,
      brandLocks: brands.brandLock,
    });
  },

  update: async (req, res) => {

    try {
      let brandId = req.query.id;
      let brand = await db.Brand.findById(brandId);
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

  },

  show: async (req, res) => {
    try {
      let brandId = req.params["id"] || null;

      if ( ! brandId)
        return res.redirect("/");

      let brand = await db.Brand.findOne({ where: {id: brandId}});

      return res.view("main/brands", {
        brand
      });
    } catch (e) {
      let msg = e.message;
      return res.serverError({msg});
    }

  },

  delete: async (req, res) => {
    try{

      let deleteBrand = await db.Brand.destroy({
        where: {
          id : req.body.id
        }
      });

      return res.redirect("/admin/brands");
    } catch(e){
      let msg = e.message;
      return res.serverError({msg});
    }
  },

  resetWeight: async (req, res) => {
    try {
      let brandIdArray = req.body.data;
      let weight = 1;
      for (let count = 0; count < brandIdArray.length; count++) {
        await* brandIdArray[count].map(async(brandId) => {

          let brand = await db.Brand.findById(brandId.id);

          brand.weight = weight;
          weight += 1;
          return await brand.save();
        });
      }

      return res.ok();
    } catch (e) {
      let msg = e.message;
      return res.serverError({msg});
    }
  },

};
module.exports = BrandController;
