import moment from "moment";
import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {
  

  findBrand : async (brandId) => {
    
    let products;

    let productGmId = await db.ProductGm.findOne({
      where: {
        brandId : brandId
      }
    });


    if(productGmId != null){

      products = await db.Product.findAll({
        where:{
          ProductGmId : productGmId.id
        }
      });
    }

    return products;
  }
}