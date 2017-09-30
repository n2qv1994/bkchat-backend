'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message_Type = sequelize.define('Message_Type', {
    message_type: DataTypes.STRING
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
        Message_Type.hasMany(models.Message, {foreignKey: 'message_type'});
      }
    }
  });
  return Message_Type;
};
