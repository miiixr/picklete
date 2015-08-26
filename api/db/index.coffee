'use strict'
fs = require('fs')
path = require('path')
Sequelize = require('sequelize')
config = sails.config.db

sequelize = new Sequelize(config.database, config.username, config.password, config)
db = {}
fs.readdirSync(__dirname).filter((file) ->
  file.indexOf('.') != 0 and file != 'index.coffee'
).forEach (file) ->
  model = sequelize.import(path.join(__dirname, file))
  db[model.name] = model
  return
Object.keys(db).forEach (modelName) ->
  if 'associate' of db[modelName]
    db[modelName].associate db
  return
db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
