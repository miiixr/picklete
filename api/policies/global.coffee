module.exports = (req, res, next) ->


  req.setLocale(req.language);
  if res.locals and res.locals.company
    return next()

  res.locals = res.locals or {}

  # get user data
  res.locals.user = UserService.getLoginUser(req)
  # console.log("user--->",res.locals.user);

  try
    res.locals.gaTrackingID = sails.config.googleAnalytics.trackingID;
    # get company data and brand list
    db.Company.findOne()
    .then (result) ->
      res.locals.company = result.dataValues;
    .then () ->
      db.Brand.findAll({order: 'weight ASC',})
      .then (brands) ->
        res.locals.brands = brands;
    .then () ->
      db.Dpt.findAll({order: 'weight',})
      .then (Dpts) ->
        res.locals.headDpts = Dpts;
        # console.log("headDpts--->",res.locals.headDpts);
        next()
  catch error
    console.error "==== without Company Data!! ===="
