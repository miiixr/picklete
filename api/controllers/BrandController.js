

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

    // create brand 
    return db.Brand.create(brandData)
    .then(function(newBrand) {

        return res.ok(newBrand);
    })
    .catch(function(error) {

        return res.serverError(error);
    });
    
    // res.ok();
    // async.map(uploadInput, (file, cb) => {
    //   req.file(file).upload((err, files) => {
    //     return cb(err, files); 
    //   });
    // }, (err, files) => {

    //   // If any errors occurred, show server error
    //   if (err) {
    //     return res.serverError(err);
    //   }
    //   // Otherwise list files that were uploaded

    //   console.log(files);
    //   return db.Brand.create(brandData)
    //   .then((newBrand) => {
    //     return res.redirect('/admin/brands/');  
    //   })
    //   .catch((error) => {
    //     req.flash('warn', 'upload data is fail');
    //     return res.serverError(error);
    //   });


    // });

    // await async.parallel([
    //   (next) => {
    //     req.file('profile').upload(function (err, _uploadedFile){
    //       if (err) return next(err);
    //       console.log(_uploadedFile);
    //       return next();
    //     });
    //   },
    //   (next) => {
    //     req.file('imagePhoto[]').upload(function (err, _uploadedFile){
    //       if (err) return next(err);
    //       console.log(_uploadedFile);
    //       return next();
    //     });
    //   },
    //   (next) => {
    //     req.file('cover').upload(function (err, _uploadedFile){
    //       if (err) return next(err);
    //       console.log(_uploadedFile);
    //       return next();
    //     });
    //   },      
    // ], (err, data) => {
    //   if (err) {
    //     console.log(">>>>> error");
    //     return res.negotiate(err); 
    //   }

    //   // `uploadedFilesOfType1` and `uploadedFilesOfType0` contain the uploaded metadata
    //   console.log("ok");
    //   res.ok("ok");
    // });

    // req.file('profile').upload((err, uploadedFiles) => {
    //   console.log(uploadedFiles);
    //   // console.log(req.files);


    //   return res.json(brandData);
    // });
    
    // return db.Brand.create(brandData)
    // .then(function(newBrand) {

    //     return res.ok(newBrand);
    // })
    // .catch(function(error) {

    //     return res.serverError(error);
    // });
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
        type: 'LOCK'
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