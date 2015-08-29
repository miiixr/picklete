

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
    }

};

module.exports = BrandController;