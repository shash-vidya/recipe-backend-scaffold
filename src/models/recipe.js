const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Recipe = sequelize.define('Recipe', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    servings: { type: DataTypes.INTEGER },
    prepTimeMinutes: { type: DataTypes.INTEGER },
    cookTimeMinutes: { type: DataTypes.INTEGER },
    difficulty: { type: DataTypes.STRING },
    diet: { type: DataTypes.STRING },
    ingredients: { type: DataTypes.JSON },
    steps: { type: DataTypes.JSON },
    mainImageUrl: { type: DataTypes.STRING }
  }, {
    tableName: 'recipes',
    timestamps: true
  });
  return Recipe;
};
