module.exports.createTestData = async () => {

  var cloud = {
    name: '雲端農場',
    avatar: '',
    type: 'OTHER',
    desc: '',
    banner: '',
    photos: []
  };

  var cloud = await db.Brand.create(cloud);

  var dpt = await db.Dpt.create({
    name: '水果' ,
    weight: 1,
    official: true,
  });

  var DptId = await db.DptSub.create({
    name: '柚子' ,
    weight: 1,
    official: true,
    DptId: dpt.id,
  });

  await dpt.setDptSubs(DptId);

  var createdProductGmComplete = await db.ProductGm.create({
    BrandId: 1,
    name: "好好吃商品",
    explain: '好吃食品就是要吃，吃吃吃',
    usage: '請安心食用',
    notice: '6 歲以上請多食用',
    depId: dpt.id,
    depSubId: DptId.id,
    coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
  });

  await createdProductGmComplete.setDpts([dpt]);
  await createdProductGmComplete.setDptSubs([DptId]);

  let createdProduct =[{
    name: '圓滿柚',
    description: '每箱六台斤 甜度 ★★★',
    stockQuantity: 100,
    price: 500
  },{
    name: '團圓柚',
    description: '每箱六台斤 甜度 ★★★★',
    stockQuantity: 100,
    price: 625
  },{
    name: '平安柚',
    description: '每箱六台斤 甜度 ★★★★',
    stockQuantity: 100,
    price: 750
  },{
    name: '【特級】團圓柚',
    description: '每箱六台斤 甜度 ★★★★★',
    stockQuantity: 100,
    price: 950
  },{
    name: '【特級】平安柚',
    description: '每箱六台斤 甜度 ★★★★★',
    stockQuantity: 100,
    price: 1200
  }];
  await db.Product.bulkCreate(createdProduct);

  let bonusPoint = {
    email: 'smlsun@gmail.com',
    remain: 100
  }


  await db.BonusPoint.create(bonusPoint);
}
