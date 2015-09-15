module.exports = function(sequelize, DataTypes) {

  var FAQ = sequelize.define('FAQ', {
    title: DataTypes.STRING,
    answer: DataTypes.STRING
  },{
    classMethods: {
      associate: function(models){
        FAQ.belongsTo(models.FAQType);
        return
      }
    }
  });
return FAQ;
};