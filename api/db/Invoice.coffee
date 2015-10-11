
module.exports = (sequelize, DataTypes) ->
  Invoice = sequelize.define('Invoice', {
    invoiceType: DataTypes.ENUM('duplex', 'triplex', 'charity')
    taxId: DataTypes.STRING
    charityName: DataTypes.STRING
    title: DataTypes.STRING
  }, classMethods: associate: (models) ->
    return
  )
  return Invoice
