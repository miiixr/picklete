module.exports = {


  findAll : async () => {

    let dpts = await db.Dpt.findAll({
      include: [{
        model: db.DptSub
      }],
      order: ['Dpt.weight', 'DptSubs.weight']
    })

    let promotions = await db.Promotion.findAll({ 
      where: { endDate: {
        $gt: new Date()
      } 
    }
    });
    var promotionSubDpt = ["閃購專區", "優惠商品", "本月主題"];
    for (var i = 0; i < promotions.length; i++) {
      promotionSubDpt.push(promotions[i].title);
    }

    let special = await db.Dpt.find({ 
      where: { name: "特別企劃" },
      include: [{
        model: db.DptSub,
        where: {
          name: {
            $in: promotionSubDpt
          }
        }
      }] 
    });

    // console.log('==========');
    
    for (var i = 0; i < dpts.length; i++) {
      if(dpts[i].name === "特別企劃")
        dpts[i] = special;
    }
    // console.log(special.DptSubs);
    // console.log('==========***');


    return dpts;
  }

}
