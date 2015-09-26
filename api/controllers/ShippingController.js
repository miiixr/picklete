module.exports = {

  // get shipping fee and region
  type: async(req,res) => {
    // let type = req.body.type;
      let type = req.param("type");;
    console.log('=== ShopController : type ==>',type);
    try {
      let shippings = await ShippingService.findBy(type);
      return res.ok({shippings});
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  // end

  //  list all
  list: async (req, res) => {
    try {
      // get query first!
      let responseType = req.query.responseType;
      // then get data.
      let shippings = await ShippingService.findAll();
      // output by demanded
      let types = [ 'delivery', 'postoffice' ];
      let result = {
        shippings,
        types,
        pageName: '/admin/shipping'
      };
      if (responseType != undefined && responseType.toLowerCase() == 'json') {
        return res.ok(shippings);
      }else{
        return res.view('admin/shipping', result);
      }
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  },
  // end list all

  // save all
  save: async (req, res) => {
    try {
      // get query first!
      let responseType = req.query.responseType;

      // output by demanded
      if (responseType != undefined && responseType.toLowerCase() == 'json') {
        // get data set and save.
        let shippings = req.body;
        // console.log('=== shippings ==>\n',shippings);
        let savedShippings = await ShippingService.saveAll(shippings);

        return res.ok(savedShippings);
      }else{
        // get data set and save.
        let shippings = req.body.shippings;
        // console.log('=== shippings ==>\n',shippings);
        let savedShippings = await ShippingService.saveAll(shippings);
        shippings = await ShippingService.findAll();
        let types = [ 'delivery', 'postoffice' ];
        return res.view('admin/shipping', {
          shippings,
          types,
          pageName: '/admin/shipping'
        });
      }
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  }
  // end save all

}
