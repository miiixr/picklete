import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  getLoginState: function(req) {
    if (req.session.authenticated) {
      return true;
    } else {
      return false;
    }
  },

  getLoginUser: function(req) {
    if (req.session.passport != undefined && req.session.passport.user) {
      return req.session.passport.user;
    } else {
      return null;
    }
  },

  findAll: async () => {
    let users = await db.User.findAll();
    return users;
  },

  findOne: async (id) => {
    let user = await db.User.findById(id);
    return user;
  },

  findAllByRole: async (id) => {
    let users = await db.User.findAll({
      where:{
        RoleId:[id]
      }
    });
    return users;
  },

  findRole: async (id) => {
    let role = await db.Role.findById(id);
    return role;
  },

  findRoles: async () => {
    let roles = await db.Role.findAll();
    return roles;
  },

  search: async (username) => {
    let users = await db.User.findAll({
      where:{
        username:{
          $like: username
        }
      }
    });
    return users;
  },

  calcTotalBonusRemain: async (user) => {
    /*
    let result = 0;

    let bonus = await db.BonusPoint.findAll({
      where: {
        email: user.email
      }
    });

    if (bonus) {
      for (var i = 0; i < bonus.length; i++) {
        result += bonus[i].remain;
      }
    }
    */

    return await db.BonusPoint.sum('remain', {
      where: {
        email: user.email
      }
    });
  }

  /*
    marked below codes jsut in case,
    if need to return a user's profile picture in future.
  */

  // findOneWithImages: async (userId) => {
  //   let user = await db.User.findById(userId);
  //   let userWithImage = UserService.withImage(user);
  //   return userWithImage;
  // },
  //
  // findAllWithImages: async () => {
  //   let users = await db.User.findAll();
  //   let usersWithImage = users.map(UserService.withImage);
  //   return usersWithImage;
  // },

  // withImage: (user) => {
  //   let userJson = user.toJSON();
  //   try {
  //     let src = `${__dirname}/../../assets/images/product/${product.id}.jpg`;
  //     let data = fs.readFileSync(src).toString("base64");
  //
  //     if (data) {
  //       let base64data = util.format("data:%s;base64,%s", mime.lookup(src), data);
  //       productJson.image = base64data;
  //     }
  //   } catch (error) {
  //     console.log(`can\'t find product ${product.id} image`);
  //     productJson.image = 'about:blank';
  //   }
  //   return productJson;
  // }

};
