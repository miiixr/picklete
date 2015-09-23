let BonusController = {
  list: async function(req, res) {
    try{
      console.log('query',req.query);
      let query = req.query;
      let queryObj = {};

      if(query.keyword)
        queryObj.email= { 'like': '%'+query.keyword+'%'};
      else
        query.keyword = ''
      
      let page = req.session.UserController_controlMembers_page =
      parseInt(req.param('page',
        req.session.UserController_controlMembers_page || 0
      ));

      let limit = req.session.UserController_controlMembers_limit =
      parseInt(req.param('limit',
        req.session.UserController_controlMembers_limit || 10
      ));

      let allBonus = await db.BonusPoint.findAndCountAll({
        where: queryObj,
        offset: page * limit,
        limit: limit
      });
      res.view('bonusPoint/controlBonusDiscount',{
        pageName: "bonus-discount",
        query,
        page,
        limit,
        allBonus
      });
    }catch(e){
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  create: async function(req, res) {
    try{
      var newBonus = req.body;
      console.log('req',newBonus);

      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if(!re.test(newBonus.email))
        throw new Error ('請輸入mail');

      if(newBonus.remain <0)
        throw new Error ('紅利點數異常');

      let createBonusPoints = await db.BonusPoint.findOrCreate({
        where:{
          email: newBonus.email
        },
        defaults: newBonus
      });
      return res.ok(createBonusPoints);
    }catch(e){
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  update: async function(req, res) {
    try{
      var query = req.param('query');
      var updateData = req.body;

      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if(!re.test(query))
        throw new Error ('請輸入mail');

      let bonus = await db.BonusPoint.findOne({
        where: {
          email: query
        }
      });

      if(updateData.remain < bonus.remain && updateData.used == bonus.used)
        throw new Error ('更新紅利點數異常');

      if(updateData.remain > 0)
        bonus.remain = updateData.remain;
      else
        throw new Error ('更新紅利點數異常');

      if(updateData.used >= bonus.used)
        bonus.used = updateData.used;
      else
        throw new Error ('更新紅利點數異常');

      bonus = await bonus.save();
      return res.ok(bonus);
    }catch(e){
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  edit: async function(req, res) {
    try{
      var query = req.query;
      console.log("query",query);
      let bonus = await db.BonusPoint.findOne({
        where:{
          email:query.email
        }
      });
      console.log('bonus',bonus);
      res.view('bonusPoint/editBonus',{
        pageName: "editBonus",
        bonus
      });
    }catch(e){
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  add: async function(req, res) {
    try{
      res.view('bonusPoint/addBonus',{
        pageName: "addBonus",
      });
    }catch(e){
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
};
module.exports = BonusController;
