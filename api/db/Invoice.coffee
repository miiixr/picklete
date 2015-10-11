
module.exports = (sequelize, DataTypes) ->
  Invoice = sequelize.define('Invoice', {
    type: DataTypes.ENUM('duplex', 'triplex', 'charity')
    taxId: DataTypes.STRING
    charityName: DataTypes.STRING
    title: DataTypes.STRING
  }, classMethods: associate: (models) ->
    return
  )
  return Invoice
