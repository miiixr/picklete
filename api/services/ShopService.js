import moment from "moment";
import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {
  

  findBrand : async (brandId) => {
    
    let products;

    let productGmIds = await db.ProductGm.findAll({
      where: {
        brandId : brandId
      }
    });


    let includeDpt = {
      model: db.Dpt,
      where: {}
    }

    let includeDptSub = {
      model: db.DptSub,
      where: {}
    }
    
    var key;
    let subQuery = { "$or": [] };
    

    for (key in productGmIds) {

      subQuery["$or"].push({ProductGmId: productGmIds[key].id});
    }
    console.log(subQuery);
    if (subQuery["$or"].length < 1)
      return [];

    products = await db.Product.findAll({
      where: subQuery,
      include: [{
        model: db.ProductGm,
        required:true,
        include: [
          includeDpt,
          includeDptSub
        ],
      }],
      order: [['id', 'ASC']]
    });

    return products;
  }
}