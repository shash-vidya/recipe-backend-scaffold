const { Sequelize } = require('sequelize');
const path = require('path');

// Use DATABASE_URL if provided (postgres), otherwise use sqlite file
const databaseUrl = process.env.DATABASE_URL;
let sequelize;
if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, { logging: false });
} else {
  const storage = path.join(__dirname, '..', 'database.sqlite');
  sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });
}

const User = require('./user')(sequelize);
const Recipe = require('./recipe')(sequelize);
const Review = require('./review')(sequelize);
const Favorite = require('./favorite')(sequelize);

// associations
User.hasMany(Recipe, { foreignKey: 'authorId', as: 'recipes' });
Recipe.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Recipe.hasMany(Review, { foreignKey: 'recipeId', as: 'reviews' });
Review.belongsTo(Recipe, { foreignKey: 'recipeId' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.belongsToMany(Recipe, { through: Favorite, as: 'favorites', foreignKey: 'userId' });
Recipe.belongsToMany(User, { through: Favorite, as: 'favoritedBy', foreignKey: 'recipeId' });

module.exports = { sequelize, User, Recipe, Review, Favorite };
