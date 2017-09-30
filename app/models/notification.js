'use strict';
module.exports = function(sequelize, DataTypes) {
  var Notification = sequelize.define('Notification', {
    notice_code: DataTypes.STRING,
    notice_by: DataTypes.BIGINT,
    notice_type: DataTypes.STRING,
    name: DataTypes.STRING,
    notice_image: DataTypes.STRING,
    notice_body: DataTypes.STRING,
    notice_room: DataTypes.STRING,
    send_at: DataTypes.DATE,
    readed: DataTypes.BOOLEAN,
    user_id: DataTypes.BIGINT
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
        Notification.belongsTo(models.User, {foreignKey: 'user_id', targetKey: 'user_id'});
        Notification.belongsTo(models.User, {foreignKey: 'notice_by', targetKey: 'notice_by'});
      }
    }
  });
  return Notification;
};
