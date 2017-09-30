'use strict';
module.exports = function(sequelize, DataTypes) {
  var Conversation = sequelize.define('Conversation', {
    conversation_code: DataTypes.STRING,
    guest_id: DataTypes.BIGINT,
    user_id: DataTypes.BIGINT,
    status: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Conversation;
};
