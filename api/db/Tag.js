module.exports = (sequelize, DataTypes) => {

  let Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Tag;
};