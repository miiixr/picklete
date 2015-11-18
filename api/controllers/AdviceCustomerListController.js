/**
 * AdviceCustomerListController
 *
 * @description :: Server-side logic for managing Advicecustomerlists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let AdviceCustomerListController = {
	create : async(req,res) => {
		let user = await UserService.getLoginUser(req);
		let AdviceCustomerCheck = await db.AdviceCustomerList.findAll({
			where:{
				status: false
			},
			include: [
        {
          model: db.User,
          where: {
          	id : user.id
          }
        }, {
          model: db.Product,
          where: {
          	id: req.query.productid
          }
        }
       ]
		});
		console.log(AdviceCustomerCheck);
		if(AdviceCustomerCheck.length > 0){
			res.ok("您已登記過");
		}
		else{
			let AdviceCustomerList = await db.AdviceCustomerList.create();
			AdviceCustomerList.setProduct(req.query.productid);
			AdviceCustomerList.setUser(user.id);
			res.ok("您已登記通知");
  	}
  }
};

module.exports = AdviceCustomerListController;