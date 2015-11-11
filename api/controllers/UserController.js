
/**
 * Authentication Controller
#
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
let moment = require("moment");

let UserController = {


  verify: async (req, res) => {
    var email = req.param("email");

    if ( ! email)
      return res.json({ result: 'fail' });

    try {
      if(UserService.getLoginState(req)){
        let loginUser = UserService.getLoginUser(req);
        var result = await db.User.findOne({
          where: {
            email: email
          }
        });
        if(result){
          if(result.id == loginUser.id){
            result = null;
          }
        }
      }else{
        var result = await db.User.findOne({
          where: {
            email: email
          }
        });
      }

      var response = (result) ? { result: "existed" } : { result: "ok" };
      return res.json(response);
    } catch (e) {
      console.log(e);
      return res.json({ result: 'fail'});
      return res.view("main/memberFavorite", {products: []});
    }
  },

  favorite: async (req, res) => {

    var FAV_KEY = "picklete_fav";
    var favoriteKeys = req.cookies[FAV_KEY];
    try {
      favoriteKeys = JSON.parse(favoriteKeys);
    } catch (e) {
      favoriteKeys = null;
      return res.view("main/memberFavorite", {products: []});
    }

    let products = await ProductService.findFavorite(favoriteKeys);

    res.view("main/memberFavorite", {
      products
    });
  },

  updatefavorite: async (req, res) => {

    var FAV_KEY = "picklete_fav";
    var favoriteKeys = req.cookies[FAV_KEY];
    sails.log.info("=== cookies ===",req.cookies);
    try {
      favoriteKeys = JSON.parse(favoriteKeys);
      sails.log.info("=== favoriteKeys ===",favoriteKeys);
      let products = Object.keys(favoriteKeys);
      sails.log.info("=== products ===",products);
      let user = UserService.getLoginUser(req);
      if(user){
        user = await db.User.findById(user.id);
        let UserFavorites = await user.getProducts();
        let favorite = await* products.map( async (productId) => {
          // sails.log.info("==== find ====",find);
          let product;
          let isNewFavorite = true;
          UserFavorites.forEach((favorite) => {
            if(favorite.id == productId){
              isNewFavorite = false
            }
          });
          product = await db.Product.findById(productId);
          if(isNewFavorite){
            let productGm = await db.ProductGm.findById(product.ProductGmId);

            let count = (await db.LikesCount.findOrCreate({
              where:{
                ProductGmId: productGm.id
              },
              defaults:{
                ProductGmId: productGm.id
              }
            }))[0];
            count.likesCount ++;
            count = await count.save();

          }
          return product;
        });
        await user.setProducts(favorite);
      }
      let message = '更新收藏';
      return res.ok(message);
    } catch (e) {
      favoriteKeys = null;
      sails.log.error(e);
      let {message} = e;
      let success = false;
      return res.json(500,{message, success});
    }
  },

  // /* 3:50:05 AM Localhost */ SELECT * FROM `Orders` ORDER BY `createdAt` DESC LIMIT 0,1000;

  purchase:async (req, res) => {
    let loginUser = UserService.getLoginUser(req);
    let orders = await db.Order.findAll({
      where: {UserId: loginUser.id},
      order: 'createdAt DESC',
      include: [{
        model: db.OrderItem
      },{
        model: db.Shipment
      },{
        model: db.Invoice
      }]
    });

    // sails.log.info("=== purchase orders ===",JSON.stringify(orders,null,2));
    res.view("main/memberPurchase",{
      orders
    });
  },
  loginStatus: async(req, res) => {
    try {
        let loginStatus = UserService.getLoginState(req);
        return res.ok({loginStatus});
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },

  cart: async (req, res) => {
    try {
      console.log('=== req.cookies ===', req.cookies.picklete_cart);

      let picklete_cart = req.cookies.picklete_cart;
      let paymentTotalAmount = 0;

      if(picklete_cart != undefined){
        picklete_cart = JSON.parse(picklete_cart);
        picklete_cart.orderItems.forEach( (orderItem) => {
          paymentTotalAmount += parseInt(orderItem.quantity, 10) * parseInt(orderItem.price, 10);
        });
      }
      let slesctedAdditionalPurchases=[];
      if(picklete_cart && picklete_cart.hasOwnProperty('additionalPurchasesItem')){
        slesctedAdditionalPurchases = await AdditionalPurchaseService.cartAddAdditionalPurchases(picklete_cart.additionalPurchasesItem);
        picklete_cart.buymore = slesctedAdditionalPurchases.buyMoreTotalPrice;
        res.cookie('picklete_cart', JSON.stringify(picklete_cart));
      }

      let company = await db.Company.findOne();
      let brands = await db.Brand.findAll();

      let date = new Date();
      let query = {date, paymentTotalAmount};
      let additionalPurchaseProducts = await AdditionalPurchaseService.getProducts(query);
      // add an item for Shippings
      let shippings = await ShippingService.findAll();
      // console.log('=== shippings ==>',shippings);
      let paymentMethod = sails.config.allpay.paymentMethod;
      return res.view('main/cart', {
        company,
        brands,
        additionalPurchaseProducts,
        slesctedAdditionalPurchases,
        shippings,
        paymentMethod
      });
    } catch (e) {
      sails.log.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },

  addAdditionalPurchases: async (req, res) => {
    try{
      console.log('=== addAdditionalPurchases ===',req.query);
      let data = req.query;
      let picklete_cart = req.cookies.picklete_cart;
      if(picklete_cart != undefined){

        try {
          picklete_cart = JSON.parse(picklete_cart);
        } catch (e) {
          console.error(e.stack);
          let {message} = e;
          res.serverError({message});
        }

        picklete_cart.additionalPurchasesItem = picklete_cart.additionalPurchasesItem ? picklete_cart.additionalPurchasesItem : [];

        picklete_cart.additionalPurchasesItem.push({
          additionalPurchasesId: data.additionalPurchasesId,
          productId: data.productId
        });

        res.cookie('picklete_cart', JSON.stringify(picklete_cart));
      }
      res.redirect("/user/cart");
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError({message});
    }
  },

  removeAdditionalPurchases: async (req, res) => {
    try{
      console.log('=== addAdditionalPurchases ===',req.query);
      let data = req.query;
      let picklete_cart = req.cookies.picklete_cart;
      if(picklete_cart != undefined){
        picklete_cart = JSON.parse(picklete_cart);
        picklete_cart.additionalPurchasesItem.splice(data.index, 1);
        res.cookie('picklete_cart', JSON.stringify(picklete_cart));
      }
      res.redirect("/user/cart");
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError({message});
    }
  },

  edit: async (req, res) => {
    let loginUser = UserService.getLoginUser(req);

    let user = (await db.User.find({
      where: {id: loginUser.id},
      include: [db.Like]
    })).toJSON();

    let passport = await db.Passport.find({where: {UserId: user.id}});
    user.password = passport.password;
    user.passwordAgain = passport.password;


    user.userLikes = user.Likes.map((like) => like.id+"");

    let likes = await db.Like.findAll();
    res.view({
      user,
      likes
    });
  },
  update: async (req, res) => {

    try {
      let loginUser = UserService.getLoginUser(req);
      let updateUser = req.body;
      let passport = await db.Passport.find({where: {UserId: loginUser.id}});

      let user = await db.User.findOne({
        where:{
          id: loginUser.id
        },
        include:{
          model: db.Role
        }
      });

      if(updateUser.password != passport.password){
        passport.password = updateUser.password;
        await passport.save()
      }

      let updateUserKeys = Object.keys(updateUser);

      updateUserKeys.forEach((key)=>{
        if(typeof(user[key]) != undefined) user[key] = updateUser[key];
      });

      await user.save();

      if(updateUser.userLikes != undefined)
        await user.setLikes(updateUser.userLikes);

      let messageConfig = await CustomMailerService.userUpdateMail(user);
      let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);

      req.login(user, function(err) {
          if (err) return res.serverError(err);

          return res.redirect('/');
      })

    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError({message});

    }






  },

  controlLogin: function(req, res) {
    if(UserService.getLoginState(req))
      res.redirect('/admin/goods');
    else
      res.view("admin/login");
  },
  indexSlider: function(req, res) {
    res.view({
      pageName: "index-slider"
    });
  },
  indexSliderDetail: function(req, res) {
    res.view({
      pageName: "index-slider-detail"
    });
  },
  password: async function(req, res) {

    let message = '無';

    try {

      if (req.method=='POST') {

        let user = await UserService.getLoginUser(req);

        if (user) {
          let passport = await db.Passport.findOne({
            where: {
              protocol: 'local',
              UserId: user
            }
          });

          if (passport) {
            passport.password = req.body.newPassword;
            passport.save();

            message = '密碼已經更新';
          }
        }
      }
    }
    catch (error){
      return res.serverError(error);
    }

    res.view({
      message
    });
  },
  indexExclusive: function(req, res) {
    res.view({
      pageName: "index-exclusive"
    });
  },
  indexTheme: function(req, res) {
    res.view({
      pageName: "index-theme"
    });
  },
  controlBrands: function (req, res) {
    res.view({
      pageName: "brands"
    });
  },
  controlBrandsDetail: function(req, res) {
    res.view({
      pageName: "brands-detail"
    });
  },
  controlAbout: function(req, res) {
    res.view({
      pageName: "about"
    });
  },
  // controlQa: function(req, res) {
  //   res.view({
  //     pageName: "qa"
  //   });
  // },
  // controlQaDetail: function(req, res) {
  //   res.view({
  //     pageName: "qa-detail"
  //   });
  // },
  // controlQaType: function(req, res) {
  //   res.view({
  //     pageName: "qa-type"
  //   });
  // },
  // controlQaAdd: function(req, res) {
  //   res.view({
  //     pageName: "qa-add"
  //   });
  // },
  controlMembers: async function(req, res) {

    try {
      console.log('query',req.query);

      let query = req.query;
      let queryObj = {};

      if (query.fullName) {
        queryObj.fullName = { 'like': '%'+query.fullName+'%'};
      }

      if (query.keyword) {
        queryObj.$or = [
          { comment:  { $like: '%'+query.keyword+'%' }},
          { email:    { $like: '%'+query.keyword+'%' }},
          { mobile:   { $like: '%'+query.keyword+'%' }},
          { fullName: { $like: '%'+query.keyword+'%' }}
        ];
      }

      if (query.mobile) {
        queryObj.mobile = { 'like': '%'+query.mobile+'%'};
      }

      if (query.createdStart && query.createdEnd) {
         queryObj.createdAt = {
           between : [
             new Date(query.createdStart),
             new Date(query.createdEnd)
           ]
         };
      }
      else if (query.createdStart || query.createdEnd) {
        queryObj.createdAt = query.createdStart? {
          gte : new Date(query.createdStart)}: {
          lte : new Date(query.createdEnd)};
      }

      let page = await pagination.page(req);
      let offset = await pagination.offset(req);
      let limit = await pagination.limit(req);

      let members = await db.User.findAndCountAll({
        where: queryObj,
        offset: offset,
        limit: limit
      });

      //查詢購物金
      for (var i = 0; i < members.rows.length; i++) {
        let member = members.rows[i];

        member.totalBonusRemain = await UserService.calcTotalBonusRemain(member);
      }

      res.view("user/controlMembers", {
        pageName: "members",
        members: members,
        page: page,
        limit: limit,
        totalPages: Math.ceil(members.count / limit),
        totalRows: members.count,
        query
      });
    }
    catch (error) {
      return res.serverError(error);
    }
  },
  showAdminInformation: async(req, res) => {

    let user = await db.User.findOne({
      where :{
        email :'admin@gmail.com'
      }
    });

    let passport = await db.Passport.find({where: {UserId: user.id}});
    user.password = passport.password;
    user.passwordAgain = passport.password;
    return res.view("admin/adminSet",{user});
  },
  updateAdminInformation: async(req, res) => {

    let user = await db.User.findOne({
      where :{
        email :'admin@gmail.com'
      }
    });

    let passport = await db.Passport.find({where: {UserId: user.id}});
    user.password = passport.password;
    user.passwordAgain = passport.password;

    let updateUser = req.body;

    if(updateUser.password != passport.password){
      passport.password = updateUser.password;
      await passport.save()
    }

    let updateUserKeys = Object.keys(updateUser);

    updateUserKeys.forEach((key)=>{
      if(typeof(user[key]) != undefined) user[key] = updateUser[key];
    });

    await user.save();

    return res.view("admin/adminSet",{user});

  },
  controlMemberDetail: async function(req, res) {
    try {
      res.view("user/controlMemberDetail", {
        pageName: "member-detail",
        member: await db.User.findById(req.param('id'))
      });
    }
    catch (error) {
      return res.serverError(error);
    }
  },

  index: async (req, res) => {
    try {
      let users = await UserService.findAll();
      let roles = await UserService.findRoles();
      return res.view({users,roles});
    } catch (error) {
      return res.serverError(error);
    }
  },

  show: async (req, res) => {
    try {
      let userId = req.param("id");
      let user = await UserService.findOne(userId);
      return res.view({user});
    } catch (error) {
      return res.serverError(error);
    }
  },

  create: async (req, res) => {
    try {
      return res.view();
    } catch (error) {
      return res.serverError(error);
    }
  },

  findAll: async (req, res) => {
    try {
      let users = await UserService.findAll();
      return res.ok({users});
    } catch (error) {
      return res.serverError(error);
    }
  },

  findOne: async (req, res) => {
    try {
      let userId = req.param("id");
      let user = await UserService.findOne(userId);
      // console.log("\n ### find user =>",user);
      return res.ok({user});
    } catch (error) {
      return res.serverError(error);
    }
  },

  filterByRole: async (req, res) => {
    try {
      let roleId = req.param("id");
      let users = await UserService.findAllByRole(roleId);
      return res.ok({users});
    } catch (error) {
      return res.serverError(error);
    }
  },

  search: async (req, res) => {
    try {
      let userName = req.param("username");
      let users = await UserService.search(userName);
      // console.log("\n ### find user =>",user);
      return res.ok({users});
    } catch (error) {
      return res.serverError(error);
    }
  },

  add: async (req, res) => {
    try{
      let newUser = req.body.user;
      // console.log("\n ### new user =>\n",newUser);
      let addUser = await db.User.create(newUser);
      if(!addUser){
        return res.serverError({
          msg: 'add a new user failed.'
        });
      }
      var query = req.query.responseType;
      if(!query || query.toLowerCase() == 'json'){
        return res.ok(addUser.toJSON());
      }else{
        return res.redirect('user/index');
      }
    }catch(error){
      return res.serverError(error);
    }
  },

  delete: async (req, res) => {
    try{
      let userId = req.param("id");
      let findUser = await db.User.findById(userId);
      if (!findUser) {
        return res.serverError({
          msg: '找不到User！ 請確認UserID！'
        });
      }
      await findUser.destroy();
      let ensureDelete = await db.User.findById(userId);
      // console.log("\n ### ensureDelete =>\n",ensureDelete);
      if(ensureDelete) {
        return res.serverError({msg: 'delete失敗'});
      }
      return res.redirect('user/index/');
    }catch(error){
      return res.serverError(error);
    }
  },

  setRole: async (req, res) => {
    try{
      let roleId = req.param("roleid");
      let userId = req.param("id");
      // console.log("\n ### roleId =>\n",roleId);
      // console.log("\n ### userId =>\n",userId);
      let findUser = await db.User.findById(userId);
      if (!findUser) {
        return res.serverError({
          msg: '找不到User！ 請確認User ID！'
        });
      }
      let findRole = await db.Role.findById(roleId);
      if (!findRole) {
        return res.serverError({
          msg: '找不到Role！ 請確認roleId！'
        });
      }
      findUser.RoleId = findRole.id;
      let updateUser = await findUser.save();
      if(!updateUser) {
        return res.serverError({msg: 'Set-Role 失敗'});
      }
      var query = req.query.responseType;
      if(query == undefined || query.toLowerCase() == 'json'){
        return res.ok(updateUser.toJSON());
      }
      let url = "user/show/" + userId;
      return res.redirect(url);
    }catch(error){
      return res.serverError(error);
    }
  },

  orderSync: async (req, res) => {

  }

};

module.exports = UserController;
