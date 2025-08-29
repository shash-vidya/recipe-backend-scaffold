const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT },
    avatarUrl: { type: DataTypes.STRING }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.prototype.validatePassword = async function(password){
    return bcrypt.compare(password, this.passwordHash);
  };

  User.beforeCreate(async (user, opts) => {
    if (user.password) {
      const hash = await bcrypt.hash(user.password, 10);
      user.passwordHash = hash;
    }
  });

  return User;
};
