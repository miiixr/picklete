
module.exports = (sequelize, DataTypes) ->
  Invoice = sequelize.define('Invoice', {
    invoiceType: DataTypes.ENUM('duplex', 'triplex')
    taxId: DataTypes.STRING
    addressee: DataTypes.ENUM('buyer', 'charity')
    charityName: DataTypes.STRING
    title: DataTypes.STRING
  }, classMethods: associate: (models) ->
    return
  )
  return Invoice
