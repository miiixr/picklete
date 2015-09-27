module.exports = (req, res, next) ->

  if res.locals and res.locals.company
    return next()

  res.locals = res.locals or {}

  # get user data
  res.locals.user = UserService.getLoginUser(req)
  console.log(res.locals.user);

  # get company data and brand list
  db.Company.findOne()
  .then (result) ->
    res.locals.company = result.dataValues;
    next()
  .then () ->
    BrandService.list()
    .then (brands) ->
      res.locals.brands = brands
      next()
