module.exports.createTestData = async () => {

  var cloud = {
    name: '雲端農場',
    avatar: 'https://lh3.googleusercontent.com/trLzZYhuCnQz6gl_QM0XIPRWp9ty0ZMGe59vFnAF_iHp=s0',
    type: 'PRIME_GOOD',
    desc: '',
    banner: '',
    photos: []
  };

  var cloud = await db.Brand.create(cloud);

  var brandExample = [{
    name: '許順利先生',
    avatar: 'http://dev.agricloud.cc:3000/img/portrait3.jpg',
    type: 'PRIME_GOOD',
    desc: '希望社會更加重視食安問題',
    banner: 'https://cldup.com/u4aO1VQKny.jpg',
    photos: [
      'http://goo.gl/IRT1EM',
      'http://goo.gl/p9Y2BF'
    ]
  },{
    name: '朱清輝先生',
    avatar: 'http://dev.agricloud.cc:3000/img/portrait1.jpg',
    type: 'PRIME_GOOD',
    desc: '把最安全的水果給好朋友與消費者',
    banner: 'https://cldup.com/u4aO1VQKny.jpg',
    photos: [
    'http://goo.gl/IRT1EM',
    'http://goo.gl/p9Y2BF'
    ]
  }];

  var brand = await db.Brand.bulkCreate(brandExample);

  var dpt = await db.Dpt.create({
    name: '水果' ,
    weight: 1,
    official: true,
  });

  var dptSub = await db.DptSub.create({
    name: '柚子' ,
    weight: 1,
    official: true
  });
  var dptSub2 = await db.DptSub.create({
    name: '柳丁' ,
    weight: 1,
    official: true
  });


  await dpt.setDptSubs([dptSub, dptSub2]);

  var createdProductGmComplete = await db.ProductGm.create({
    BrandId: 1,
    name: "月圓人團圓好吃柚子",
    explain: '好吃食品就是要吃，吃吃吃',
    usage: '請安心食用',
    notice: '6 歲以上請多食用',

    coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
  });

  await createdProductGmComplete.setDpts([dpt]);
  await createdProductGmComplete.setDptSubs([dptSub]);

  let createdProduct =[{
    name: '圓滿柚',
    description: '每箱六台斤 甜度 ★★★',
    stockQuantity: 100,
    price: 500,
    ProductGmId: createdProductGmComplete.id,
    photos:['http://dev.agricloud.cc:3000/img/cover2.jpg', 'http://dev.agricloud.cc:3000/img/cover1.jpg']
  },{
    name: '團圓柚',
    description: '每箱六台斤 甜度 ★★★★',
    stockQuantity: 100,
    price: 625,
    ProductGmId: createdProductGmComplete.id,
    photos:['http://dev.agricloud.cc:3000/img/cover2.jpg', 'http://dev.agricloud.cc:3000/img/cover1.jpg']
  },{
    name: '平安柚',
    description: '每箱六台斤 甜度 ★★★★',
    stockQuantity: 100,
    price: 750,
    ProductGmId: createdProductGmComplete.id,
    photos:['http://dev.agricloud.cc:3000/img/cover2.jpg', 'http://dev.agricloud.cc:3000/img/cover1.jpg']
  },{
    name: '【特級】團圓柚',
    description: '每箱六台斤 甜度 ★★★★★',
    stockQuantity: 100,
    price: 950,
    ProductGmId: createdProductGmComplete.id,
    photos:['http://dev.agricloud.cc:3000/img/cover2.jpg', 'http://dev.agricloud.cc:3000/img/cover1.jpg']
  },{
    name: '【特級】平安柚',
    description: '每箱六台斤 甜度 ★★★★★',
    stockQuantity: 100,
    price: 1200,
    ProductGmId: createdProductGmComplete.id,
    photos:['http://dev.agricloud.cc:3000/img/cover2.jpg', 'http://dev.agricloud.cc:3000/img/cover1.jpg']
  }];
  await db.Product.bulkCreate(createdProduct);

  let bonusPoint = {
    email: 'smlsun@gmail.com',
    remain: 100
  }


  await db.BonusPoint.create(bonusPoint);


  // create company
  let companyObj = {
    avatar: "https://lh3.googleusercontent.com/trLzZYhuCnQz6gl_QM0XIPRWp9ty0ZMGe59vFnAF_iHp=s0",
    name: "agricloud",
    fullname: "創毅資訊股份有限公司",
    email: "hq@picklete.com",
    desc: "週一至週五 早上10:00 -下午5:00",
    line: "https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/contact.png"
  };

  await db.Company.create(companyObj);


}
