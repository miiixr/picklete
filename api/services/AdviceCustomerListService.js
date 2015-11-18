module.exports = {
	sendEmail: async (req, res) => {
		let AdviceCustomerList = await db.AdviceCustomerList.findAll({
			where:{
				status: false
			},
			include: [
        {
          model: db.User
        }, {
          model: db.Product,
          where: {
          	id: req
          }
        }
       ]
		});

		for(var i = 0; i < AdviceCustomerList.length;i++){
			let link = await UrlHelper.resolve(`shop/products/${AdviceCustomerList[i].Product.ProductGmId}/${AdviceCustomerList[i].Product.id}`,true);
			let adviceCustomer = AdviceCustomerList[i];

			let messageConfig = await CustomMailerService.adviceCustomerMail({adviceCustomer, link});
			let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);
      AdviceCustomerList[i].status = true;
      AdviceCustomerList[i].save();
		}
	}
}