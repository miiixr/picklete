'use strict'
fs = require('fs')
path = require('path')
Sequelize = require('sequelize')
env = process.env.NODE_ENV or 'development'
config = {
  'username': process.env.MYSQL_USER || "root"
  'password': process.env.MYSQL_PASSWORD || "root"
  'host': process.env.MYSQL_1_PORT_3306_TCP_ADDR || "127.0.0.1"
  'port': process.env.MYSQL_1_PORT_3306_TCP_PORT || 3306
  'database': 'ec_platform',
  'dialect': 'mysql',
  'force': true
}

# config = {
#   'dialect': 'sqlite',
#   'storage': './db.development.sqlite',
#   'username': null,
#   'password': null,
#   'database': null,
#   'force': true
# }


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
