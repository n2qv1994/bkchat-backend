'use strict';
module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define('Activity', {
    user_id: DataTypes.BIGINT,
    action_id: DataTypes.INTEGER,
    conversation_id: DataTypes.BIGINT,
    reverse_id: DataTypes.BIGINT
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
        Activity.belongsTo(models.User, {foreignKey: 'user_id', targetKey: 'user_id'});
        Activity.belongsTo(models.Activity_Type, {foreignKey: 'action_id', targetKey: 'action_id'});
      }
    }
  });
  return Activity;
};
