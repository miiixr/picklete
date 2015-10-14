import crypto from 'crypto';

let ShopCodeController = {


  // List 'get /admin/shop-code'
  controlShopCode: async (req, res) => {
    console.log('query',req.query);
    let query = req.query;
    let queryObj = {};

    if(query.keyword)
      queryObj.title = { 'like': '%'+query.keyword+'%'};
    else
      query.keyword = ''

    let limit = await pagination.limit(req);
    let page = await pagination.page(req);
    let offset = await pagination.offset(req);

    let ShopCodes = await db.ShopCode.findAndCountAll({
      where: queryObj,
      offset: offset,
      limit: limit,
    });
    res.view('promotion/controlShopCode',{
      pageName: "shop-code",
      shopCodes: ShopCodes,
      query: query,
      limit: limit,
      page: page,
      totalPages: Math.ceil(ShopCodes.count / limit),
      totalRows: ShopCodes.count
    });
  },

  // CreateView get /admin/shop-code/create'
  controlShopCodeDetail: async (req, res) => {
    let users = await db.User.findAll();
    res.view('promotion/controlShopCodeDetail',{
      users
    });
  },

  // CreateAction 'post /admin/shop-code/create'
  create: async (req, res) => {

    var params = req.body;

    params['sentTarget'] = [].concat( params['sentTarget'] )

    if(params['autoRandomCode'] == 'on'){
      params.code = crypto.randomBytes(32).toString('hex').substr(0, 20);
    }

    if(params['type']=='price'){
      var description = params['price-description'];
      var restriction = params['price-restriction'];
    }
    if(params['type']=='discount'){
      var description = params['discount-description'];
      var restriction = params['discount-restriction'];
    }

    let shopCode = {
      code: params['code'],
      title: params['title'],
      type: params['type'],
      description: description,
      restriction: restriction,
      startDate: params['startDate'] || 1,
      endDate: params['endDate'] || 1,
      restrictionDate: params['restrictionDate'],
      sentType: params['sentType'],
      sentTarget: params['sentTarget'] || [],
      sentContent: params['sentContent'] || '',
    };

    if(params['restrictionDate'] == 'on'){
      delete shopCode['startDate'];
      delete shopCode['endDate'];
    }

    try {
       let createShopCode = await db.ShopCode.create(shopCode);
       if(params.sentType == 'all'){
         let shopCode = createShopCode;
         await ShopCodeService.sendAllUsers({shopCode});
       }else if(params.sentType == 'specific' && params.users.length!=0){
         await* params.users.map( async (userId) => {
           let find = await db.User.findById(userId);
           find.ShopCodeId = createShopCode.id;
           await find.save();
         });
         let shopCode = await db.ShopCode.findOne({
           where:{
             id:createShopCode.id
           },
           include:{
             model: db.User
           }
         });
         await ShopCodeService.sendTargetUsers({shopCode});
       }
       return res.redirect("/admin/shop-code");
    } catch (e) {
       return res.serverError(e);
    }
  },

  // UpdateView 'get /admin/shop-code/update'
  showUpdate: async (req, res) => {

    let id = req.query.id;
    let shopCode = await db.ShopCode.findOne({ where: {id: id} });
    try {
       return res.view("promotion/controlShopCodeUpdate",{ shopCode: shopCode });
    } catch (e) {
       return res.serverError(e);
    }
  },

  // UpdateAction 'post /admin/shop-code/update'
  update: async (req, res) => {

    try {
      var params = req.body;

      let id = parseInt(req.body['id'] || req.query.id);
      let shopCode = await db.ShopCode.findOne({ where: {id: id} });

      params['sentTarget'] = [].concat( params['sentTarget'] )

      if(params['autoRandomCode'] == 'true'){
        params.code = crypto.randomBytes(32).toString('hex').substr(0, 20);
      }

      if(params['type']=='price'){
        var description = params['price-description'];
        var restriction = params['price-restriction'];
      }
      if(params['type']=='discount'){
        var description = params['discount-description'];
        var restriction = params['discount-restriction'];
      }



      shopCode.code = params['code'];
      shopCode.title = params['title'];
      shopCode.type = params['type'];
      shopCode.description = description;
      shopCode.restriction = restriction;
      if(params['restrictionDate'] != 'on'){
        shopCode.startDate = params['startDate'] || 1;
        shopCode.endDate = params['endDate'] || 1;
      }
      shopCode.restrictionDate = params['restrictionDate'],
      shopCode.sentType = params['sentType'];
      shopCode.sentTarget = params['sentTarget'] || [];
      shopCode.sentContent = params['sentContent'] || '';

      await shopCode.save();
      return res.redirect("/admin/shop-code");
    } catch (e) {
      return res.serverError(e);
    }

  },

  // DeleteAction 'post /admin/shop-code/delete'
  delete: async (req, res) => {

    let id = req.params.id;
    let shopCode = await db.ShopCode.findOne({ where: {id: id} });
    await shopCode.destroy();
    return res.ok(shopCode);

  },

  checkCode: async (req, res )=>{
    try {
      let data = req.query;
      let check = await ShopCodeService.use(data);
      return res.ok(check);
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.json(500,{message, success});
    }
  }


};
module.exports = ShopCodeController;
