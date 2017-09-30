'use strict';
module.exports = function(sequelize, DataTypes) {
  var recording = sequelize.define('recording', {
    room_name: DataTypes.STRING,
    user_name: DataTypes.STRING,
    video_name: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return recording;
};