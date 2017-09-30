'use strict';
module.exports = function(sequelize, DataTypes) {
  var Room = sequelize.define('Room', {
    room_code: DataTypes.STRING,
    room_name: DataTypes.STRING,
    description: DataTypes.STRING,
    limited: DataTypes.INTEGER,
    started_at: DataTypes.DATE,
    ended_at: DataTypes.DATE,
    enabled: DataTypes.BOOLEAN,
    status: DataTypes.INTEGER,
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
        Room.hasOne(models.Reservation, {foreignKey: 'reverse_id', targetKey: 'reverse_id'});
        Room.hasMany(models.Room_Invitation, {foreignKey: 'room_id'});
        Room.hasMany(models.Message, {foreignKey: 'room_code'});
        Room.hasMany(models.Transaction, {foreignKey: 'room_id'});
      }
    }
  });
  return Room;
};
