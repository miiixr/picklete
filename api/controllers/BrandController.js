

let BrandController = {

  create: async (req, res) => {

    if (req.method === "GET") {
      return res.view("admin/brandCreate", {
        pageName: "brands"
      });
    }

    var brandData = req.body;
    // console.log(brandData);

    let uploadInput = ["avatar", "photos[]", "banner"];
    let files = await ImageService.upload(req, uploadInput);
    
    if (files[0].length) {
      brandData.avatar = files[0][0].fd;
    }

    let photos = files[1];
    if (photos.length) {
      for (let i in photos) {
        photos[i] = photos[i].fd;
      }
      brandData.photos = photos;
    }

    if (files[2].length) {
      brandData.banner = files[2][0].fd;
    }

    console.log(brandData);

    // create brand 
    return db.Brand.create(brandData)
    .then(function(newBrand) {
      return res.redirect("/admin/brands");
    })
    .catch(function(error) {

      return res.serverError(error);
    });
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

    let brandLock = await db.Brand.findOne({  
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
      brandLock: brandLock
    });
  },

  update: async (req, res) => {

    let brandId = req.params.brand;
    var updateData = req.body;

    return db.Brand.findById(brandId)
    .then(function(brand) {

        if(!brand){
            return res.serverError({
              msg: '找不到這個 brand'
            });
        }

        brand.name = updateData.name;
        brand.avatar = updateData.avatar;
        brand.type = updateData.type;
        brand.desc = updateData.desc;
        brand.banner = updateData.banner;
        brand.photos = updateData.photos;

        return brand.save();
    })
    .then(function(updatedBrand) {
        return res.ok(updatedBrand);
    })
    .catch(function(error) {
        return res.serverError(error);
    });
  }

};

module.exports = BrandController;