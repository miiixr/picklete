module.exports = {

    //  list all
    list: async (req, res) => {
      try {
        // get query first!
        let responseType = req.query.responseType;
        // then get data.
        let shippings = await ShippingService.findAll();
        // let's do it.
        if (responseType != undefined && responseType.toLowerCase() == 'json') {
          return res.ok(shippings);
        }else{
          return res.view('admin/shipping', {
            shippings,
            pageName: '/admin/shipping'
          });
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
        // get data set and save.
        let shippings = req.body;
        let savedShippings = await ShippingService.saveAll(shippings);
        // output by demanded
        if (responseType != undefined && responseType.toLowerCase() == 'json') {
          return res.ok(savedShippings);
        }else{
          return res.view('admin/shipping', {
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
