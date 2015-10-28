
var self = module.exports = {
  defaultLimitValue: async (req) => {
    let defaultLimitValue = 20;

    //todo: this is not good, let controller pass a defaultLimit params into
    if (req.options.controller == 'shop' && req.options.action == 'list') {
      defaultLimitValue = 24;
    }

    return defaultLimitValue;
  },
  limit: async (req) => {
    return parseInt(req.param('limit', await self.defaultLimitValue(req)));
  },
  offset: async (req) => {
    return await self.page(req) * await self.limit(req);
  },
  page: async (req) => {
    return parseInt(req.param('page', 0));
  },
  limitWithSession: async (req) => {
    let key = await sessionKey(req, 'limit');

    console.log('=== req.session[key] ===', req.session[key]);
    console.log('=== key ===', key);
    return req.session[key] =
      parseInt(req.param('limit', req.session[key] || self.defaultLimitValue(req)));
  },
  offsetWithSession: async (req) => {
    return await self.pageWithSession(req) * await self.limitWithSession(req);
  },
  pageWithSession: async (req) => {
    let key = await sessionKey(req, 'page');
    return req.session[key] =
      parseInt(req.param('page', req.session[key] || 0));
  },
  sessionKey: async (req, postfix) => {
    return req.options.controller + '.' + req.options.action + '.' + postfix;
  }
};
