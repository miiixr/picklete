
module.exports = (sequelize, DataTypes) ->
  Invoice = sequelize.define('Invoice', {
    type: {
      type: DataTypes.ENUM('duplex', 'triplex', 'charity'),
      defaultValue: 'duplex'
    }
    taxId: DataTypes.STRING
    charityName: DataTypes.STRING
    title: DataTypes.STRING
  }, classMethods: associate: (models) ->
    return
  )
  return Invoice
