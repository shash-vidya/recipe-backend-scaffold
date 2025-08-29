const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Favorite = sequelize.define('Favorite', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }
  }, {
    tableName: 'favorites',
    timestamps: true
  });
  return Favorite;
};
