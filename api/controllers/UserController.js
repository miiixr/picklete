let userController = {

  findAll: async (req, res) => {
    try {
      // let users = await userService.findAllWithImages();
      let users = await UserService.findAll();
      return res.ok({users});
    } catch (error) {
      return res.serverError(error);
    }
  },

  index: async (req, res) => {
    try {
      // let users = await userService.findAllWithImages();
      let users = await UserService.findAll();
      return res.view({users});
    } catch (error) {
      return res.serverError(error);
    }
  },

  findOne: async (req, res) => {
    try {
      // let userId = req.param("userId");
      let userId = req.param("id");
      let user = await UserService.findOne(userId);
      // let user = await userService.findWithImages(userId);
      console.log("\n ### find user =>",user);
      return res.ok({user});
    } catch (error) {
      return res.serverError(error);
    }
  },

  show: async (req, res) => {
    try {
      let userId = req.param("id");
      // let user = await userService.findWithImages(userId);
      let user = await UserService.findOne(userId);
      return res.view({user});
    } catch (error) {
      return res.serverError(error);
    }
  },

  add: async (req, res) => {
    try{
      let newUser = req.body;
      console.log("\n ### new user =>\n",newUser);
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

  create: async (req, res) => {
    try {
      return res.view();
    } catch (error) {
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
      console.log("\n ### ensureDelete =>\n",ensureDelete);
      if(ensureDelete) {
        return res.serverError({msg: 'delete失敗'});
      }
      return res.redirect('user/index/');
    }catch(error){
      return res.serverError(error);
    }
  },

  setGroup: async (req, res) => {
    try{
      let groupId = req.param("group");
      let userId = req.param("id");
      console.log("\n ### groupId =>\n",groupId);
      console.log("\n ### userId =>\n",userId);
      let findUser = await db.User.findById(userId);
      if (!findUser) {
        return res.serverError({
          msg: '找不到User！ 請確認User ID！'
        });
      }
      findUser.group = groupId;
      let updateUser = await findUser.save();
      if(!updateUser) {
        return res.serverError({msg: 'Set User Group 失敗'});
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

  updateUser: async (req, res) => {
    try {
      let userId = req.param("id");
      let findUser = await db.user.findById(userId);
      if (!findUser) {
        return res.serverError({
          msg: '找不到User！ 請確認User ID！'
        });
      }
      findUser.username = req.body.user.username
      findUser.email = req.body.user.email
      findUser.mobile = req.body.user.mobile
      findUser.address = req.body.user.address
      findUser.group = req.body.user.group
      findUser.comment = req.body.user.comment
      let updateInfo = await findUser.save();
      if(!updateInfo) {
        return res.serverError({msg: '更新User失敗'});
      } else {
        return res.ok(findUser.toJSON());
      }
    } catch (error) {
      return res.serverError(error);
    }
  }

};

module.exports = userController;
