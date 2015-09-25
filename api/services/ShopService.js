import moment from "moment";
import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {
  

  findBrand : async (brandId) => {
    
    let products;

    let productGmId = await db.ProductGm.findAll({
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
    console.log(productGmId);
    products = await db.Product.findAll({
      where:{
        ProductGmId :  //這裏不知道怎篩上一個找到得值 
      },
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