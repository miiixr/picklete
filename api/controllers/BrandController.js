

let BrandController = {

    create: async (req, res) => {

        var brandData = req.body;

        return db.Brand.create(brandData)
            .then(function(newBrand) {

                return res.ok(newBrand);
            })
            .catch(function(error) {

                return res.serverError(error);
            });
    },

    list: async (req, res) => {

        let brands = await db.Brand.findAll();

        return res.ok(brands);
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