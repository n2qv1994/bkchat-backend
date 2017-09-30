'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    user_code: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    image: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    user_name: DataTypes.STRING,
    pass_word: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    status: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Notification, {foreignKey: 'user_id'});
        User.hasMany(models.Reservation, {foreignKey: 'user_id'});
        User.hasMany(models.Transaction, {foreignKey: 'user_id'});
        User.hasMany(models.Activity, {foreignKey: 'user_id'});
        User.hasMany(models.Message, {foreignKey: 'sended_by'});
        User.hasMany(models.Message, {foreignKey: 'recieved_by'});
        User.belongsTo(models.Role, {foreignKey: 'role_id', targetKey: 'role_id'});
      }
    }
  });
  return User;
};