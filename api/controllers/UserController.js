
/**
 * Authentication Controller
#
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
let moment = require("moment");

let UserController = {

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
    console.log('=== req.cookies ===', req.cookies.picklete_cart);

    let picklete_cart = req.cookies.picklete_cart;
    let paymentTotalAmount = 0;

    if(picklete_cart != undefined){
      picklete_cart = JSON.parse(picklete_cart);

      picklete_cart.orderItems.forEach( (orderItem) => {
        paymentTotalAmount += parseInt(orderItem.quantity, 10) * parseInt(orderItem.price, 10);
      });
    }



    let company = await db.Company.findOne();
    let brands = await db.Brand.findAll();

    let date = new Date();
    let query = {date, paymentTotalAmount};
    let additionalPurchaseProductGms = await AdditionalPurchaseService.getProductGms(query);
    console.log('=== additionalPurchaseProducts ===', additionalPurchaseProductGms);

    // add an item for Shippings(運費) by kuyen
    let shippings = await ShippingService.findAll();
    // console.log('=== shippings ==>',shippings);
    let paymentMethod = sails.config.allpay.paymentMethod;
    return res.view('main/cart', {
      company,
      brands,
      additionalPurchaseProductGms,
      shippings,
      paymentMethod
    });
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

      let user = await db.User.findById(loginUser.id);

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



      return res.redirect('/member/setting');


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
      res.view({});
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
