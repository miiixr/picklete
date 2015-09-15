module.exports = function(sequelize, DataTypes) {

  var FAQType = sequelize.define('FAQType',{
    //問題類別名
    name:  DataTypes.STRING,
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  },{
    classMethods: {
      associate: function(models){
        FAQType.hasMany(models.FAQ);
        return
      }
    }
  });
  
  return FAQType;
};