module.exports.createTestData = async () => {

  var fruitProducts = [{
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
  await db.Product.bulkCreate(fruitProducts);

  var newProduct = {
    name: '斗六文旦柚禮盒',
    description: '3斤裝',
    stockQuantity: 10,
    price: 100,
    image: 'http://localhost:1337/images/product/1.jpg',
    isPublish: true,
    comment: 'this is a comment.'
  };
  var createdProduct = await db.Product.create(newProduct);

  var newOrder = {
    serialNumber: '0000000',
    paymentTotalAmount: 1234.567,
    quantity: 10,
    orderId: '1111',
    UserId: createNewBuyer.id,
    ProductId: createdProduct.id
  };
  var createdOrder = await db.Order.create(newOrder);

  var shipment = {
    username: '收件者',
    mobile: '0922-222-222',
    taxId: '123456789',
    email: 'receiver@gmail.com',
    address: '收件者的家',
    OrderId: createdOrder.id
  }
  var createShipment = await db.Shipment.create(shipment);


  var newOrder2 = {
    serialNumber: '0000001',
    paymentIsConfirmed: true,
    paymentTotalAmount: 1000,
    paymentConfirmDate: Date.now(),
    paymentConfirmName: '王小明',
    paymentConfirmPostfix: '54321',
    quantity: 5,
    orderId: '1111',
    UserId: createNewBuyer.id,
    ProductId: createdProduct.id
  };
  var createdOrder = await db.Order.create(newOrder2);
}
