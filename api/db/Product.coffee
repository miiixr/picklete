
module.exports = (sequelize, DataTypes) ->
  Product = sequelize.define 'Product', {
    # 商品款式
    name: DataTypes.STRING
    stockQuantity: DataTypes.INTEGER
    price: DataTypes.INTEGER
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
    # 款式
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
  }, classMethods: associate: (models) ->
    return Product.belongsTo(models.ProductGm)

  return Product
