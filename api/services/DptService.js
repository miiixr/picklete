module.exports = {


  findAll : async () => {

    let dpts = await db.Dpt.findAll({
      include: [{
        model: db.DptSub
      }],
      order: ['Dpt.weight', 'DptSubs.weight']
    })

    return dpts;
  }

}
