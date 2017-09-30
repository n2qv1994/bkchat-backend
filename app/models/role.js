'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    role_code: DataTypes.STRING,
    role_name: DataTypes.STRING,
    description: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN
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
        Role.hasMany(models.User, {foreignKey: 'role_id'});
      }
    }
  });
  return Role;
};
