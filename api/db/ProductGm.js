
module.exports = (sequelize, DataTypes) => {
  let ProductGm = sequelize.define('ProductGm', {
    // 品牌 id
    // brandId: DataTypes.INTEGER,
    // brandName: DataTypes.STRING,
    name: DataTypes.STRING,
    // 大館別 id
    // dptId: {
    //   type: DataTypes.STRING,
    //   get: function() {

    //     var value = this.getDataValue('dptId');

    //     if(value) {
    //       return JSON.parse(value);
    //     }

    //     return [];
    //   },
    //   set: function(value) {
    //     return this.setDataValue('dptId', JSON.stringify(value));
    //   }
    // },
    // 小館別 id
    // dptSubId: {
    //   type: DataTypes.STRING,
    //   get: function() {

    //     var value = this.getDataValue('dptSubId');

    //     if(value) {
    //       return JSON.parse(value);
    //     }

    //     return [];
    //   },
    //   set: function(value) {
    //     return this.setDataValue('dptSubId', JSON.stringify(value));
    //   }
    // },
    // 商品說明/商品文案
    explain: DataTypes.TEXT,
    // 使用方法
    usage: DataTypes.TEXT,
    // 注意事項
    notice: DataTypes.TEXT,
    // 商品標籤
    tag: {
      type: DataTypes.STRING,
      get: function() {

        var value = this.getDataValue('tag');

        if(value) {
          try {
            return JSON.parse(value);
          } catch (e) {
          }
        }

        return [];
      },
      set: function(value) {
        try {
          var tag = JSON.stringify(value);
        } catch (e) {
          var tag = "";
        }
        return this.setDataValue('tag', tag);
      }
    },
    // Cover photos
    coverPhoto: {
      type: DataTypes.TEXT,
      get: function() {

        var value = this.getDataValue('coverPhoto');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('coverPhoto', JSON.stringify(value));
      }
    }

  }, {
    classMethods: {
      associate: (models) => {
        ProductGm.belongsTo(models.Brand)
        ProductGm.hasMany(models.Product)
        ProductGm.belongsToMany(models.Dpt, {through: 'DptProductGm'});
        ProductGm.belongsToMany(models.DptSub, {through: 'DptSubProductGm'});
        ProductGm.belongsToMany(models.AdditionalPurchase, {through: 'AdditionalPurchaseProductGm'});
        ProductGm.belongsToMany(models.Promotion, {through: 'PromotionProductGm'});
        return
      }
    },
    paranoid: true
  });

  return ProductGm;
};
