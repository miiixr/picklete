module.exports = (req, res, next) ->

  if res.locals and res.locals.company
    return next()

  req.locals = req.locals or {}

  db.Company.findOne()
  .then((result) =>
    res.locals.company = result.dataValues;
    # console.log(result);
    # process.exit(1);
    next()
  )