
var self = module.exports = {
  limit: async (req) => {
    let limitValue = req.session.ProductService_productQuery_limit || 12;
    if (req.options.controller == 'shop' && req.options.action == 'list')
      limitValue = 24;

    return req.session.ProductService_productQuery_limit =
    parseInt(req.param('limit', limitValue));
  },
  offset: async (req) => {
    return await self.page(req) * await self.limit(req);
  },
  page: async (req) => {
    return req.session.ProductService_productQuery_page =
    parseInt(req.param('page',
      req.session.ProductService_productQuery_page || 0
    ));
  }
};
