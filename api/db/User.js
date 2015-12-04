module.exports = function(sequelize, DataTypes) {
  var User;
  User = sequelize.define('User', {
    username: DataTypes.STRING,
    fullName: DataTypes.STRING,
    gender: DataTypes.ENUM('none', 'male', 'female'),
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    mobile: DataTypes.STRING,
    birthYear: DataTypes.STRING,
    birthMonth: DataTypes.STRING,
    birthDay: DataTypes.STRING,
    birthDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    region: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    orderSyncToken: DataTypes.STRING,
    forgotToken: DataTypes.STRING,
    verification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dateCreated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    privacyTermsAgree: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    paranoid: true,
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Passport);
        User.belongsTo(models.Role);
        User.belongsToMany(models.Like, {
          through: 'UserLike'
        });
        User.belongsToMany(models.Product, {
          through: 'UserFavorite'
        });
        User.belongsToMany(models.ShopCode, {
          through: 'userShopCode'
        });
      }
    },
    hooks: {
      afterUpdate: async function(user, options) {
        if (user.previous('email') === '' && user.email !== '') {
          await ShopCodeService.sendWhenRegister({user});
        }
      },

      afterCreate: async function(user, options) {
        if (user.email !== '') {
          await ShopCodeService.sendWhenRegister({user});
        }
      }
    }
  });
  return User;
};
