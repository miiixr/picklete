
describe("brand query ", () => {
  it('without brand OTHER', async (done) => {

    let brands = await db.Brand.findAll({
      where: {
        type: {$ne: 'OTHER'}
      }
    });

    console.log(brands);
    done();
  });  
});
