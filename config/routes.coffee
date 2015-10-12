###*
Route Mappings
(sails.config.routes)

Your routes map URLs to views and controllers.

If Sails receives a URL that doesn't match any of the routes below,
it will check for matching files (images, scripts, stylesheets, etc.)
in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
might match an image file: `/assets/images/foo.jpg`

Finally, if those don't match either, the default 404 handler is triggered.
See `api/responses/notFound.js` to adjust your app's 404 logic.

Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
CoffeeScript for the front-end.

For more information on configuring custom routes, check out:
http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
###

###*
Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
etc. depending on your default view engine) your home page.              *

(Alternatively, remove this and add an `index.html` file in your         *
`assets` directory)                                                      *
###
module.exports.routes = {
  "/": 'MainController.index'
  'get /login': 'AuthController.login'
  'get /logout': 'AuthController.logout'
  'get /register' : 'AuthController.register'
  'get /forgotPassword' :'AuthController.forgotPassword'
  'get /newPassword' : 'AuthController.newPassword'
  'get /verification': 'AuthController.verification'
  'get /verification/send': 'AuthController.sedVerificationMailAgain'

  'get /admin/' : 'AuthController.admin'
  'get /admin/login' : 'UserController.controlLogin'
  'get /admin/index-exclusive' : 'UserController.indexExclusive'

  'get /admin/password' : 'UserController.password'
  'post /admin/password' : 'UserController.password'
  'get /admin/brands' : 'BrandController.list'
  'get /admin/brands/create' : 'BrandController.create'
  'post /admin/brands/create' : 'BrandController.create'
  'get /admin/brands/update' : 'BrandController.update'
  'post /admin/brands/update' : 'BrandController.update'
  'post /admin/brands/delete/' : 'BrandController.delete'


  'get /admin/exclusive' : 'SelectionActiveController.list'
  'post /admin/exclusive' : 'SelectionActiveController.update'

  'get /admin/topicActivities' : 'TopicActiveController.list'
  'post /admin/topicActivities' : 'TopicActiveController.save'
  'get /admin/topicActivities/ajax' : 'TopicActiveController.ajax'

  'get /admin/index-slider' : 'SliderActivitiesController.list'

  'get /admin/slider/create': view: 'admin/sliderActivitiesDetail'
  'post /admin/slider/create' : 'SliderActivitiesController.create'
  'get /admin/slider/update' : 'SliderActivitiesController.showUpdate'
  'post /admin/slider/update' : 'SliderActivitiesController.update'
  'post /admin/slider/delete' : 'SliderActivitiesController.delete'



  'get /index' : 'SelectionActiveController.index'
  'get /FAQ' : 'FAQController.show'

  'get /brands' : view: 'main/brands'
  'get /user/cart' : 'UserController.cart'
  'get /user/loginStatus' : 'UserController.loginStatus'
  'get /user/cart-step-2' : 'ShopController.cartStep2'
  'get /user/cart-done' : view: 'main/cart-done'

  'get /admin/department' : 'DptController.list'
  'post /admin/department/update': 'DptController.update'
  'post /admin/department/sub/create' : 'DptSubController.create'
  'post /admin/department/sub/update' : 'DptSubController.update'
  'post /admin/department/sub/delete' : 'DptSubController.smDelete'

  'get /admin/goods' : 'ProductController.list'
  'get /admin/goods/update' : 'ProductController.showUpdate'
  'post /admin/goods/update' : 'ProductController.doUpdate'
  'get /admin/goods/create' : 'ProductController.showCreate'
  'post /admin/goods/create' : 'ProductController.doCreate'
  'post /admin/goods/delete' : 'ProductController.doDelete'
  'post /admin/image/upload' : 'ImageController.upload'

  'post /ckeditor/upload' : 'ImageController.ckeditorUpload'

  'get /admin/bonus' : 'BonusController.list'
  'post /admin/bonus' : 'BonusController.create'
  'put /admin/bonus/:query' : 'BonusController.update'
  'get /admin/bonus/edit' : 'BonusController.edit'
  'get /admin/bonus/add' : 'BonusController.add'

  # 'get /admin/shop-item-list' : 'UserController.controlShopItemList'
  'get /admin/order' : 'OrderController.index'

  'get /contact': 'ContactController.index'
  'get /admin/about' : 'AboutController.create'
  'post /admin/about' : 'AboutController.create'

  'get /admin/FAQ' : 'FAQController.FAQ'
  'get /admin/FAQAdd' : 'FAQController.FAQAdd'
  'post /admin/FAQAdd' : 'FAQController.FAQAdd'
  'get /admin/FAQUpdate' : 'FAQController.FAQUpdate'
  'post /admin/FAQUpdate' : 'FAQController.FAQUpdate'
  'get /admin/FAQTypeUpdate' : 'FAQController.FAQTypeUpdate'
  'post /admin/FAQTypeUpdate' : 'FAQController.FAQTypeUpdate'
  'post /admin/FAQDelete' : 'FAQController.FAQDelete'
  'post /admin/FAQTypeDelete' : 'FAQController.FAQTypeDelete'


  #'get /admin/qa-detail' : 'UserController.controlQaDetail'
  #'get /admin/qa-type' : 'UserController.controlQaType'
  #'get /admin/qa-add' : 'UserController.controlQaAdd'
  'get /admin/members' : 'UserController.controlMembers'
  'get /admin/member-detail/:id' : 'UserController.controlMemberDetail'

  # promotions
  'get /admin/shop-discount' : 'PromotionController.list'
  'post /admin/shopDiscount/create' : 'PromotionController.create'
  'get /admin/shop-discount-detail' : 'PromotionController.controlShopDiscountDetail'
  'get /admin/shop-discount-detail2' : 'PromotionController.controlShopDiscountDetail2'
  'get /admin/shop-discount-add-item' : 'PromotionController.controlShopDiscountAddItem'
  'get /admin/shop-buy-more' : 'PromotionController.controlShopBuyMore'
  'get /admin/shop-buy-more-detail' : 'PromotionController.controlShopBuyMoreDetail'
  'get /admin/shop-buy-more-add-item' : 'PromotionController.controlShopBuyMoreAddItem'
  'put /admin/buymoreUpdate' : 'PromotionController.addPurchaseUpdate'
  'get /admin/shop-report-form' : 'PromotionController.controlShopReportForm'

  # shopCode
  'get /admin/shop-code' : 'ShopCodeController.controlShopCode' # list
  'get /admin/shop-code/create': 'ShopCodeController.controlShopCodeDetail' # createView
  'post /admin/shop-code/create' : 'ShopCodeController.create' # createAction
  'get /admin/shop-code/update' : 'ShopCodeController.showUpdate' # updateView
  'post /admin/shop-code/update' : 'ShopCodeController.update' # updateAction

  # end promotions

  # shipping
  'get /admin/shipping' : 'ShippingController.list'
  'post /admin/shipping' : 'ShippingController.save'
  'get /shipping/:type' : 'ShippingController.type'
  # end shipping

  # client side / Have to login
  # 'get /member/fav' : view: 'main/member-fav'
  'get /member/favorite' : 'UserController.favorite'
  'get /member/purchase' : 'UserController.purchase'
  'get /member/setting' : 'UserController.edit'
  'post /member/update' : 'UserController.update'

  # client side / no need to login
  'get /index' : 'MainController.index'
  'get /about' : 'AboutController.show'

  'get /shop/products' : 'ShopController.list'

  'get /shop/products/:productGmid/:productId' : 'ShopController.show'

  'get /shop/done'  : 'ShopController.done'

  'get /brands/:id' : 'BrandController.show'

  # 'get /admin/brand' : 'BrandController.list'
  # 'post /admin/brand' : 'BrandController.create'
  # 'put /admin/brand/:brand' : 'BrandController.update'

  # 'get /admin/dpt' : 'DptController.list'
  # 'post /admin/dpt' : 'DptController.create'

  # 'get /admin/dpt_sub' : 'DptSubController.list'
  # 'post /admin/dpt_sub' : 'DptSubController.create'

  'post /auth/local': 'AuthController.callback'
  'post /auth/local/:action': 'AuthController.callback'

  'get /auth/:provider': 'AuthController.provider'
  'get /auth/:provider/callback': 'AuthController.callback'
  'get /auth/:provider/:action': 'AuthController.callback'

  'get /api/order/pay': 'OrderController.pay'

  "get /admin/login": view: "admin/login"

  'get /api/search/:keywords': 'SearchController.productsJson'
  'get /search': 'SearchController.products'
  'get /search/:keywords': 'SearchController.products'
  'get /checkCode' : 'ShopCodeController.checkCode'

  'post /allpay/paid':{
    controller: "PaymentController",
    action: "paid"
    cors: {
      origin: "*",
      credentials: false
    }
  }

  'post /allpay/paymentinfo':{
    controller: "PaymentController",
    action: "paymentinfo"
    cors: {
      origin: "*",
      credentials: false
    }
  }

  ###*
    ProductController
  ###
  'get /api/product': {
    controller: "ProductController",
    action: "find",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'get /api/product/:productId': {
    controller: "ProductController",
    action: "findOne",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  },

  'post /api/product': {
    controller: "ProductController",
    action: "add",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'put /api/product/publish/:id': {
    controller: "ProductController",
    action: "publish",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'put /api/product/unpublish/:id': {
    controller: "ProductController",
    action: "unpublish",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'delete /api/product/:id': {
    controller: "ProductController",
    action: "delete",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'post /api/product/update/:productId': {
    controller: "ProductController",
    action: "updateProduct",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  ###*
    OrderController
  ###
  'post /api/order': {
    controller: "OrderController",
    action: "create",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'get /api/order/status': {
    controller: "OrderController",
    action: "status",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'get /api/order/sync': {
    controller: "OrderController",
    action: "sync",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }

    'get /api/order/find/:serialNumber': {
      controller: "OrderController",
      action: "find",
      cors: {
       origin: "http://localhost:1337, http://localhost:8080",
       credentials: false
      }
    }

  }

  ###*
    UserController
  ###
  'get /api/user': {
    controller: "UserController",
    action: "findAll",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'get /api/user/:id': {
    controller: "UserController",
    action: "findOne",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'get /api/user/role/:id': {
    controller: "UserController",
    action: "filterByRole",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'get /api/user/search/:username': {
    controller: "UserController",
    action: "search",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'post /api/user': {
    controller: "UserController",
    action: "add",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'put /api/user/:id': {
    controller: "UserController",
    action: "update",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'put /api/user/:id/:roleid': {
    controller: "UserController",
    action: "setRole",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'delete /api/user/:id': {
    controller: "UserController",
    action: "delete",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  "/:controller/:action/:id?": {}

  'post /api/slider/create': {
    controller: "SliderActivitiesController",
    action: "createSlider",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'get /api/slider/list': {
    controller: "SliderActivitiesController",
    action: "listSlider",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'post /api/slider/update/:id': {
    controller: "SliderActivitiesController",
    action: "updateSlider",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'post /api/slider/delete/:id': {
    controller: "SliderActivitiesController",
    action: "deleteSlider",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }

  'post /api/shop-code/delete/:id': {
    controller: "ShopCodeController",
    action: "delete",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }
  'put /admin/brands/resetWeight' : {
    controller: "BrandController",
    action: "resetWeight",
    cors: {
     origin: "http://localhost:1337, http://localhost:8080",
     credentials: false
    }
  }
}

###*
Custom routes here...                                                    *

If a request to a URL doesn't match any of the custom routes above, it  *
is matched against Sails route blueprints. See `config/blueprints.js`    *
for configuration options and examples.                                  *
###
