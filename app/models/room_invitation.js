'use strict';
module.exports = function(sequelize, DataTypes) {
  var Room_Invitation = sequelize.define('Room_Invitation', {
    user_id: DataTypes.BIGINT,
    room_id: DataTypes.BIGINT
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
        Room_Invitation.belongsTo(models.Room, {foreignKey: 'room_id', targetKey: 'room_id'});
        Room_Invitation.belongsTo(models.User, {foreignKey: 'user_id', targetKey: 'user_id'});
      }
    }
  });
  return Room_Invitation;
};
