'use strict';
module.exports = function(sequelize, DataTypes) {
  var Activity_Type = sequelize.define('Activity_Type', {
    action_code: DataTypes.STRING,
    action_name: DataTypes.STRING,
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
        Activity_Type.hasMany(models.Activity, {foreignKey: 'action_id'});
        Activity_Type.hasMany(models.Transaction, {foreignKey: 'action_id'});
      }
    }
  });
  return Activity_Type;
};