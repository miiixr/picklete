validator = require('validator')
crypto = require('crypto')

###*
# Local Authentication Protocol
#
# The most widely used way for websites to authenticate users is via a username
# and/or email as well as a password. This module provides functions both for
# registering entirely new users, assigning passwords to already registered
# users and validating login requesting.
#
# For more information on local authentication in Passport.js, check out:
# http://passportjs.org/guide/username-password/
###

###*
# Register a new user
#
# This method creates a new user from a specified email, username and password
# and assign the newly created user a local Passport.
#
# @param {Object}   req
# @param {Object}   res
# @param {Function} next
###

exports.register = (req, res, next) ->
  email = req.param('email')
  username = req.param('username')
  password = req.param('password')
  if !email
    req.flash 'error', 'Error.Passport.Email.Missing'
    return next(new Error('No email was entered.'))
  if !username
    req.flash 'error', 'Error.Passport.Username.Missing'
    return next(new Error('No username was entered.'))
  if !password
    req.flash 'error', 'Error.Passport.Password.Missing'
    return next(new Error('No password was entered.'))

  db.User.create({
    username: username
    email: email
  })
  .then (user) ->
    # Generating accessToken for API authentication
    token = crypto.randomBytes(48).toString('base64')
    db.Passport.create({
      protocol: 'local'
      password: password
      user: user.id
      accessToken: token
    }).then (user) ->
      return next null, user
    .error (err) ->
      if err
        if err.code == 'E_VALIDATION'
          req.flash 'error', 'Error.Passport.Password.Invalid'

        user.destroy()
        .then () ->
          return next();

        .error (destroyErr) ->
          return next destroyErr or err



  .error (err) ->
    if err
      if err.code == 'E_VALIDATION'
        if err.invalidAttributes.email
          req.flash 'error', 'Error.Passport.Email.Exists'
        else
          req.flash 'error', 'Error.Passport.User.Exists'
      return next(err)


      return next null, user

###*
# Assign local Passport to user
#
# This function can be used to assign a local Passport to a user who doens't
# have one already. This would be the case if the user registered using a
# third-party service and therefore never set a password.
#
# @param {Object}   req
# @param {Object}   res
# @param {Function} next
###

exports.connect = (req, res, next) ->
  user = req.user
  password = req.param('password')
  db.Passport.findOne {
    protocol: 'local'
    user: user.id
  }, (err, passport) ->
    if err
      return next(err)
    if !passport
      db.Passport.create {
        protocol: 'local'
        password: password
        user: user.id
      }, (err, passport) ->
        next err, user
        return
    else
      next null, user
    return
  return

###*
# Validate a login request
#
# Looks up a user using the supplied identifier (email or username) and then
# attempts to find a local Passport associated with the user. If a Passport is
# found, its password is checked against the password supplied in the form.
#
# @param {Object}   req
# @param {string}   identifier
# @param {string}   password
# @param {Function} next
###

exports.login = (req, identifier, password, next) ->
  isEmail = validator.isEmail(identifier)
  query = {
    where: {}
    include: [
      db.Role
    ]
  }
  if isEmail
    query.where.email = identifier
  else
    query.where.username = identifier

  db.User.findOne(query).then (user) ->

    if !user
      if isEmail
        req.flash 'error', 'Error.Passport.Email.NotFound'
      else
        req.flash 'error', 'Error.Passport.Username.NotFound'
      return next(null, false)
    db.Passport.findOne({
      where: {
        protocol: 'local'
        userId: user.id
      }
    }).then (passport) ->
      if passport
        passport.validatePassword password, (err, res) ->
          if err
            return next(err)
          if !res
            req.flash 'error', 'Error.Passport.Password.Wrong'
            next null, false
          else
            next null, user
      else
        req.flash 'error', 'Error.Passport.Password.NotSet'
        return next(null, false)
      return
    return
  return
