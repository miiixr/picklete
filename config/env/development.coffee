###*
Development environment settings

This file can include shared settings for a development team,
such as API keys or remote database passwords.  If you're using
a version control solution for your Sails app, this file will
be committed to your repository unless you add it to your .gitignore
file.  If your repository will be publicly viewable, don't add
any private information to this file!
###
module.exports = {
  port: process.env.PORT or 1337
  environment: process.env.NODE_ENV or 'development'
  mailchimp:
    apiKey: "25592e91a2b20be38b4ee3169eeb9f68-us10"

  db:
    'dialect': 'sqlite',
    'storage': './db.development.sqlite', # ':memory:'
    'username': null,
    'password': null,
    'database': null,
    'force': true
}

###*
Set the default database connection for models in the development       *
environment (see config/connections.js and config/models.js )           *
###

# models: {
#   connection: 'someMongodbServer'
# }
