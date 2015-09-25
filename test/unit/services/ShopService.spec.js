
import moment from 'moment';

describe("about Shop Service", function() {
	let brand,product,productGm;

	before(async (done) => {
		try{
			brand = await db.Brand.create({
				name : "測試品牌",
				type : "AGENT",
				desc : "測試歐"
      });

 			productGm = await db.ProductGm.create({
				brandId : brand.id
			});

			product = await db.Product.create({
				name: '測試商品',
	      description: '毫無反應只是個測試',
	      stockQuantity: '100',
	      isPublish: 'true',
	      price: 999,
	      size: 'normal',
	      service: ["express"],
	      country: 'U.K',
	      madeby: 'TW',
	      color: 3,
	      productNumber: '1-USA-2-G',
	      spec: 'super-metal',
	      photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg'],
	      ProductGmId: productGm.id
			});



			done();
		} catch (e) {
      console.log(e.stack);
      done(e);
    }
	});

	after((done) => {
	  done();
  });

  it('find brand product', async (done) => {
    try {

			let findProduct = await ShopService.findBrand(brand.id);

      findProduct.should.be.an.Object;
      done();
    
    } catch (e) {

      console.log(e);
      done(e);
    }
  });

	it('no find brand product', async (done) => {
    
    try {

			let findProduct = await ShopService.findBrand();
			findProduct.should.be.an.Array;
      done();
    
    } catch (e) {

      console.log(e);
      done(e);
    }
  });
});