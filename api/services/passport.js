var passport, path, url;

path = require('path');

url = require('url');

passport = require('passport');


/**
 * Passport Service
#
 * A painless Passport.js service for your Sails app that is guaranteed to
 * Rock Your Socks™. It takes all the hassle out of setting up Passport.js by
 * encapsulating all the boring stuff in two functions:
#
 *   passport.endpoint()
 *   passport.callback()
#
 * The former sets up an endpoint (/auth/:provider) for redirecting a user to a
 * third-party provider for authentication, while the latter sets up a callback
 * endpoint (/auth/:provider/callback) for receiving the response from the
 * third-party provider. All you have to do is define in the configuration which
 * third-party providers you'd like to support. It's that easy!
#
 * Behind the scenes, the service stores all the data it needs within "Pass-
 * ports". These contain all the information required to associate a local user
 * with a profile from a third-party provider. This even holds true for the good
 * ol' password authentication scheme – the Authentication Service takes care of
 * encrypting passwords and storing them in Passports, allowing you to keep your
 * User model free of bloat.
 */

passport.protocols = require('./protocols');


/**
 * Connect a third-party profile to a local user
#
 * This is where most of the magic happens when a user is authenticating with a
 * third-party provider. What it does, is the following:
#
 *   1. Given a provider and an identifier, find a matching Passport.
 *   2. From here, the logic branches into two paths.
#
 *     - A user is not currently logged in:
 *       1. If a Passport wasn't found, create a new user as well as a new
 *          Passport that will be assigned to the user.
 *       2. If a Passport was found, get the user associated with the passport.
#
 *     - A user is currently logged in:
 *       1. If a Passport wasn't found, create a new Passport and associate it
 *          with the already logged in user (ie. "Connect")
 *       2. If a Passport was found, nothing needs to happen.
#
 * As you can see, this function handles both "authentication" and "authori-
 * zation" at the same time. This is due to the fact that we pass in
 * `passReqToCallback: true` when loading the strategies, allowing us to look
 * for an existing session in the request and taking action based on that.
#
 * For more information on auth(entication|rization) in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 * http://passportjs.org/guide/authorize/
#
 * @param {Object}   req
 * @param {Object}   query
 * @param {Object}   profile
 * @param {Function} next
 */

passport.connect = async function(req, query, profile, next) {
  console.log('=== do login ===',query);
  console.log('=== do login profile ===',profile);
  var provider, user;
  user = {};
  provider = undefined;
  query.provider = req.param('provider');
  provider = profile.provider || query.provider;
  if (!provider) {
    return next(new Error('No authentication provider was identified.'));
  }
  if (profile.hasOwnProperty('emails')) {
    user.email = profile.emails[0].value || profile.emails[0];
  } else if (profile.hasOwnProperty('email')) {
    user.email = profile.email;
  }
  if (profile.hasOwnProperty('username')) {
    user.username = profile.email || profile.username || profile.displayName;
  } else if (profile.hasOwnProperty('family_name')) {
    user.username = profile.family_name;
  } else {
    user.username = user.email;
  }

  if(profile.hasOwnProperty('displayName')){
    user.fullName = profile.displayName;
  }

  if (!user.username && !user.email) {
    return next(new Error('Neither a username nor email was available'));
  }

  try {


    let passport = await db.Passport.findOne({
      where: {
        provider: provider,
        identifier: query.identifier.toString()
      }
    });

    //有一般使用者登入但沒使用FB註冊過
    let loginedUser = req.user;
    sails.log.info("=== loginedUser ===",loginedUser);
    if (loginedUser && !passport) {
      query.UserId = loginedUser.id;
      passport = await db.Passport.create(query);
      return next(null, loginedUser);
    }

    //已用FB註冊過，直接登入
    if(passport){
      if(query.hasOwnProperty('tokens') && query.tokens !== passport.tokens){
        passport.tokens = query.tokens;
        passport = await passport.save();
      }
      user = await db.User.findOne({
        where:{
          id: passport.UserId
        },
        include:{
          model: db.Role
        }
      });
      if(user)
        return next(null, user)
      else
        throw new Error('Error user not found');
    }

    // 註冊FB帳號
    let role = await db.Role.find({
      where: {authority: 'user'}
    });
    user.RoleId = role.id;

    let checkMail;
    if(user.hasOwnProperty('email')){
      checkMail = await db.User.findOne({where:{email:user.email}});
    }

    if(checkMail){
      // this flow for first time user was local register, then after use third-party login.
      query.UserId = checkMail.id;
      passport = await db.Passport.create(query);
      return next(null, checkMail);
    } else{
      user = await db.User.create(user);
      user.dataValues.Role = role;
      query.UserId = user.id;
      passport = await db.Passport.create(query);
      let messageResult = await ShopCodeService.sendWhenRegister({user});
      return next(null, user);
    }

  } catch (err) {
    req.flash('error',err.message);
    console.log(err);
    return next(err);
  }
  //
  // let passport = await db.Passport.findOne({
  //   where: {
  //     provider: provider,
  //     identifier: query.identifier.toString()
  //   }
  // }, function(err, passport) {
  //   if (err) {
  //     return next(err);
  //   }
  //
  //   if (!req.user) {
  //     if (!passport) {
  //       User.create(user, function(err, user) {
  //         if (err) {
  //           if (err.code === 'E_VALIDATION') {
  //             if (err.invalidAttributes.email) {
  //               req.flash('error', 'Error.Passport.Email.Exists');
  //             } else {
  //               req.flash('error', 'Error.Passport.User.Exists');
  //             }
  //           }
  //           return next(err);
  //         }
  //         query.user = user.id;
  //         Passport.create(query, function(err, passport) {
  //           if (err) {
  //             return next(err);
  //           }
  //           next(err, user);
  //         });
  //       });
  //     } else {
  //       if (query.hasOwnProperty('tokens') && query.tokens !== passport.tokens) {
  //         passport.tokens = query.tokens;
  //       }
  //       passport.save(function(err, passport) {
  //         if (err) {
  //           return next(err);
  //         }
  //         db.User.findOne({
  //           where: passport.user.id
  //         }, next);
  //       });
  //     }
  //   } else {
  //     if (!passport) {
  //       query.user = req.user.id;
  //       Passport.create(query, function(err, passport) {
  //         if (err) {
  //           return next(err);
  //         }
  //         next(err, req.user);
  //       });
  //     } else {
  //       next(null, req.user);
  //     }
  //   }
  // });
};


/**
 * Create an authentication endpoint
#
 * For more information on authentication in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
#
 * @param  {Object} req
 * @param  {Object} res
 */

passport.endpoint = function(req, res) {
  var options, provider, strategies;
  strategies = sails.config.passport;
  provider = req.param('provider');
  options = {};
  if (!strategies.hasOwnProperty(provider)) {
    console.log("=== what!? ===");
    return res.redirect('/login');
  }
  if (strategies[provider].hasOwnProperty('scope')) {
    options.scope = strategies[provider].scope;
  }
  this.authenticate(provider, options)(req, res, req.next);
};


/**
 * Create an authentication callback endpoint
#
 * For more information on authentication in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
#
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */

passport.callback = async function(req, res, next) {
  var action, provider;
  console.log('=== passport.callback ===', req.body);
  provider = req.param('provider', 'local');
  action = req.param('action');
  if (provider === 'local' && action !== void 0) {
    if (action === 'register' && !req.user) {
      await this.protocols.local.register(req, res, next);
    } else if (action === 'connect' && req.user) {
      this.protocols.local.connect(req, res, next);
    } else if (action === 'disconnect' && req.user) {
      this.protocols.local.disconnect(req, res, next);
    } else {
      next(new Error('Invalid action'));
    }
  } else {
    if (action === 'disconnect' && req.user) {
      this.disconnect(req, res, next);
    } else {
      this.authenticate(provider, next)(req, res, req.next);
    }
  }
};


/**
 * Load all strategies defined in the Passport configuration
#
 * For example, we could add this to our config to use the GitHub strategy
 * with permission to access a users email address (even if it's marked as
 * private) as well as permission to add and update a user's Gists:
#
    github: {
      name: 'GitHub',
      protocol: 'oauth2',
      strategy: require('passport-github').Strategy
      scope: [ 'user', 'gist' ]
      options: {
        clientID: 'CLIENT_ID',
        clientSecret: 'CLIENT_SECRET'
      }
    }
#
 * For more information on the providers supported by Passport.js, check out:
 * http://passportjs.org/guide/providers/
#
 */

passport.loadStrategies = function() {
  var self, strategies;
  self = this;
  strategies = sails.config.passport;
  Object.keys(strategies).forEach(function(key) {
    var Strategy, baseUrl, callback, options, protocol;
    options = {
      passReqToCallback: true
    };
    Strategy = void 0;
    if (key === 'local') {
      _.extend(options, {
        usernameField: 'identifier'
      });
      _.extend(options, strategies[key].options || {});
      if (strategies.local) {
        Strategy = strategies[key].strategy;
        self.use(new Strategy(options, self.protocols.local.login));
      }
    } else if (key === 'bearer') {
      if (strategies.bearer) {
        Strategy = strategies[key].strategy;
        self.use(new Strategy(self.protocols.bearer.authorize));
      }
    } else {
      protocol = strategies[key].protocol;
      callback = strategies[key].callback;
      if (!callback) {
        callback = 'auth/' + key + '/callback';
      }
      Strategy = strategies[key].strategy;
      baseUrl = sails.getBaseurl();
      switch (protocol) {
        case 'oauth':
        case 'oauth2':
          options.callbackURL = url.resolve(baseUrl, callback);
          break;
        case 'openid':
          options.returnURL = url.resolve(baseUrl, callback);
          options.realm = baseUrl;
          options.profile = true;
      }
      _.extend(options, strategies[key].options);
      self.use(new Strategy(options, self.protocols[protocol]));
    }
  });
};


/**
 * Disconnect a passport from a user
#
 * @param  {Object} req
 * @param  {Object} res
 */

passport.disconnect = function(req, res, next) {
  var provider, user;
  user = req.user;
  provider = req.param('provider');
  return db.Passport.findOne({
    where: {
      provider: provider,
      user: user.id
    }
  }).then(function(passport) {
    return db.Passport.destroy(passport.id).then(function() {
      return next(null, user);
    });
  });
};

passport.serializeUser(function(user, next) {
  sails.log.info("serializeUser",user);
  return next(null, user);
});

passport.deserializeUser(function(user, next) {
  sails.log.info("deserializeUser",user);
  return next(null, user);
});

module.exports = passport;

// ---
// generated by coffee-script 1.9.2
