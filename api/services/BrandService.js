module.exports = {
  list: async(name) => {
    let brands = {};

    brands.all = await db.Brand.findAll();

    brands.brandsGood = await db.Brand.findAll({
      where: {
        type: 'PRIME_GOOD',
      },
      order: 'weight ASC',
    });
    brands.brandsAgent = await db.Brand.findAll({
      where: {
        type: 'AGENT',
      },
      order: 'weight ASC',
    });

    brands.brandLock = await db.Brand.findAll({
      where: {
        type: 'OTHER',
      },
      order: 'weight ASC',
    });

    return brands;
  },
};
