
module.exports = (sequelize, DataTypes) ->
  Product = sequelize.define 'Product', {
    # 商品款式名稱
    name: DataTypes.STRING
    # 庫存量
    stockQuantity: DataTypes.INTEGER
    # 售價
    price: DataTypes.INTEGER
    # 是否上架
    isPublish: {
      type: DataTypes.BOOLEAN,
      set: (value) ->
        return this.setDataValue('isPublish', Boolean(value))
    }
    # 商品尺寸
    size: DataTypes.STRING
    # 備註
    comment: DataTypes.STRING
    # 服務項目，可以多選，快遞，超商取貨， ...
    service:  {
      type: DataTypes.STRING,
      get: () ->
        value = this.getDataValue('service');

        if value
          return JSON.parse(value)
        return []
      set: (value) ->
        return this.setDataValue('service', JSON.stringify(value))
    }
    # 品牌國別, 日本，大陸，美國
    country: DataTypes.STRING
    # 製造產地
    madeby: DataTypes.STRING
    # 顏色
    color: DataTypes.INTEGER
    # 貨號
    productNumber: DataTypes.STRING
    # 敘述
    description: DataTypes.STRING
    # 產品材質
    spec: DataTypes.STRING
    # 照片
    photos:
      type: DataTypes.TEXT
      get: () ->
        value = this.getDataValue('photos');

        if value
          return JSON.parse(value)
        return []

      set: (value) ->
        return this.setDataValue('photos', JSON.stringify(value))
    # weight
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  paranoid: true,
  classMethods: associate: (models) ->
    Product.belongsTo(models.ProductGm)
    Product.belongsToMany(models.AdditionalPurchase, {through: 'AdditionalPurchaseProduct'});


  return Product
