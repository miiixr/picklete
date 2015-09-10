let BonusController = {
  list: async function(req, res) {
    try{
      console.log('query',req.query);
      let query = req.query;
      let queryObj = {};

      if(query.keyword)
        queryObj.email= { 'like': '%'+query.keyword+'%'};

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
  }
};
module.exports = BonusController;