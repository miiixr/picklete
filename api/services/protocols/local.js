var crypto, validator;

validator = require('validator');

crypto = require('crypto');



exports.register = async function(req, res, next) {
  var email, password, username;
  console.log('=== exports.register ===');
  email = req.param('email');
  username = req.param('username');
  password = req.param('password');
  if (!email) {
    req.flash('error', 'Error.Passport.Email.Missing');
    return next(new Error('No email was entered.'));
  }
  if (!username) {
    req.flash('error', 'Error.Passport.Username.Missing');
    return next(new Error('No username was entered.'));
  }
  if (!password) {
    req.flash('error', 'Error.Passport.Password.Missing');
    return next(new Error('No password was entered.'));
  }

  try {

    let role = await db.Role.create({
      authority: 'user'
    });

    let user = await db.User.create({
      username: username,
      email: email,
      RoleId: role.id
    });

    var token = crypto.randomBytes(48).toString('base64');
    let passport = db.Passport.create({
      protocol: 'local',
      password: password,
      user: user.id,
      accessToken: token
    });

    return next(null, user);

  } catch (err) {
    console.error(err.stack);
    req.flash('error', err.message);
    return next(err);

  }
};



exports.connect = function(req, res, next) {
  var password, user;
  user = req.user;
  password = req.param('password');
  db.Passport.findOne({
    protocol: 'local',
    user: user.id
  }, function(err, passport) {
    if (err) {
      return next(err);
    }
    if (!passport) {
      db.Passport.create({
        protocol: 'local',
        password: password,
        user: user.id
      }, function(err, passport) {
        next(err, user);
      });
    } else {
      next(null, user);
    }
  });
};


exports.login = function(req, identifier, password, next) {
  var isEmail, query;
  isEmail = validator.isEmail(identifier);
  query = {
    where: {},
    include: [db.Role]
  };
  if (isEmail) {
    query.where.email = identifier;
  } else {
    query.where.username = identifier;
  }
  db.User.findOne(query).then(function(user) {
    if (!user) {
      if (isEmail) {
        req.flash('error', 'Error.Passport.Email.NotFound');
      } else {
        req.flash('error', 'Error.Passport.Username.NotFound');
      }
      return next(null, false);
    }
    db.Passport.findOne({
      where: {
        protocol: 'local',
        userId: user.id
      }
    }).then(function(passport) {
      if (passport) {
        passport.validatePassword(password, function(err, res) {
          if (err) {
            return next(err);
          }
          if (!res) {
            req.flash('error', 'Error.Passport.Password.Wrong');
            return next(null, false);
          } else {
            return next(null, user);
          }
        });
      } else {
        req.flash('error', 'Error.Passport.Password.NotSet');
        return next(null, false);
      }
    });
  });
};
