var crypto, validator;

validator = require('validator');

crypto = require('crypto');
import moment from 'moment';


exports.register = async function(req, res, next) {
  var email, password, username;
  email = req.param('email');
  username = req.param('username');
  password = req.param('password');

  try {

    if (!email) {
      throw new Error('No email was entered.');
    }

    if (!password) {
      throw new Error('No password was entered.');
    }


    let newUserParams = req.body;

    let role = await db.Role.find({
      where: {authority: 'user'}
    });

    let newUser = {
      username: newUserParams.username || email,
      email: email,
      fullName: newUserParams.fullName,
      gender: newUserParams.gender || 'none',
      RoleId: role.id,
      mobile: newUserParams.mobile,
      birthDate: moment(`${newUserParams.birthYear}${newUserParams.birthMonth}${newUserParams.birthDay}`, "YYYYMMDD"),
      birthYear: newUserParams.birthYear,
      birthMonth: newUserParams.birthMonth,
      birthDay: newUserParams.birthDay,
      city: newUserParams.city,
      region: newUserParams.region,
      zipcode: newUserParams.zipcode,
      address: newUserParams.address,
      privacyTermsAgree: newUserParams.privacyTermsAgree || false,
    }

    console.log('=== newUserParams ===', newUserParams);

    let user = await db.User.create(newUser);

    if(newUserParams.like && newUserParams.like.length)
      await user.setLikes(newUserParams.userLikes);

    var token = crypto.randomBytes(48).toString('base64');
    let passport = await db.Passport.create({
      protocol: 'local',
      password: password,
      UserId: user.id,
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
  db.Passport.find({
    protocol: 'local',
    UserId: user.id
  }, function(err, passport) {
    if (err) {
      return next(err);
    }
    if (!passport) {
      db.Passport.create({
        protocol: 'local',
        password: password,
        UserId: user.id
      }, function(err, passport) {
        next(err, user);
      });
    } else {
      next(null, user);
    }
  });
};


exports.login = function(req, identifier, password, next) {
  console.log('=== doLogin ===');
  var isEmail, query;
  isEmail = validator.isEmail(identifier);
  query = {
    where: {},
    include: [db.Role, db.Like]
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
    console.log('== user ==', user);
    db.Passport.findOne({
      where: {
        protocol: 'local',
        UserId: user.id
      }
    }).then(function(passport) {
      console.log('== passport ==', passport);
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
