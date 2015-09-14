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
  "/": view: "homepage"
  'get /login': 'AuthController.login'
  'get /logout': 'AuthController.logout'
  'get /register': 'AuthController.register'

  'get /admin/login' : 'UserController.controlLogin'
  'get /admin/index-slider' : 'UserController.indexSlider'
  'get /admin/index-slider-detail' : 'UserController.indexSliderDetail'
  'get /admin/index-exclusive' : 'UserController.indexExclusive'
  'get /admin/index-theme' : 'UserController.indexTheme'

  'get /admin/password' : 'UserController.password'
  'post /admin/password' : 'UserController.password'

  'get /admin/' : 'AuthController.admin'
  'get /admin/brands' : 'BrandController.list'
  'get /admin/brands/create' : 'BrandController.create'
  'post /admin/brands/create' : 'BrandController.create'
  'get /admin/brands/update' : 'BrandController.update'
  'post /admin/brands/update' : 'BrandController.update'
  'get /admin/exclusive' : view: 'admin/exclusive'
  'get /admin/index-theme' : view: 'admin/themeActivities'

  
  'get /index' : view: 'main/index'
  'get /member/fav' : view: 'main/member-fav'
  'get /member/purchase' : view: 'main/member-purchase'
  'get /member/setting' : view: 'main/member-setting'
  'get /shop/product' : view: 'main/shop-product'
  'get /user/signup' : view: 'main/signup'
  'get /shop/products' : 'ShopController.list'
  'get /brands' : view: 'main/brands'
  'get /user/cart' : view: 'main/cart'
  'get /user/cart-step-2' : view: 'main/cart-step-2'
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
  'post /admin/image/upload' : 'ImageController.upload'

  # promotions
  'get /admin/shop-discount' : 'PromotionController.list'
  'get /admin/shop-discount-detail' : 'PromotionController.controlShopDiscountDetail'
  'get /admin/shop-discount-detail2' : 'PromotionController.controlShopDiscountDetail2'
  'get /admin/shop-discount-add-item' : 'PromotionController.controlShopDiscountAddItem'
  'get /admin/shop-buy-more' : 'PromotionController.controlShopBuyMore'
  'get /admin/shop-buy-more-detail' : 'PromotionController.controlShopBuyMoreDetail'
  'get /admin/shop-buy-more-add-item' : 'PromotionController.controlShopBuyMoreAddItem'
  'get /admin/shop-code' : 'PromotionController.controlShopCode'
  'get /admin/shop-code-detail' : 'PromotionController.controlShopCodeDetail'
  'get /admin/shop-report-form' : 'PromotionController.controlShopReportForm'
  # end promotions

  'get /admin/bonus' : 'BonusController.list'

  # 'get /admin/shop-item-list' : 'UserController.controlShopItemList'
  'get /admin/order' : 'OrderController.index'
  'get /admin/about' : 'UserController.controlAbout'
  'get /admin/qa' : 'UserController.controlQa'
  'get /admin/qa-detail' : 'UserController.controlQaDetail'
  'get /admin/qa-type' : 'UserController.controlQaType'
  'get /admin/qa-add' : 'UserController.controlQaAdd'
  'get /admin/members' : 'UserController.controlMembers'
  'get /admin/member-detail/:id' : 'UserController.controlMemberDetail'

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


  "get /admin/login": view: "admin/login"

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

}

###*
Custom routes here...                                                    *

If a request to a URL doesn't match any of the custom routes above, it  *
is matched against Sails route blueprints. See `config/blueprints.js`    *
for configuration options and examples.                                  *
###
