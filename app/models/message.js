'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    content: DataTypes.TEXT,
    sended_by: DataTypes.BIGINT,
    recieved_by: DataTypes.BIGINT,
    room_id: DataTypes.BIGINT,
    message_type: DataTypes.INTEGER
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
        Message.belongsTo(models.Room, {foreignKey: 'room_code', targetKey: 'room_code'});
        Message.belongsTo(models.User, {foreignKey: 'sended_by', targetKey: 'sended_by'});
        Message.belongsTo(models.User, {foreignKey: 'recieved_by', targetKey: 'recieved_by'});
        Message.belongsTo(models.Message_Type, {foreignKey: 'message_type', targetKey: 'message_type'});
      }
    }
  });
  return Message;
};
