module.exports = (req, res, next) ->

  if res.locals and res.locals.company
    return next()

  req.locals = req.locals or {}

  db.Company.findOne()
  .then (result) ->
    res.locals.company = result.dataValues;
  .then () ->
    db.Brand.findAll()
    .then (brands) ->
      res.locals.brands = brands;
      next()