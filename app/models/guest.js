'use strict';
module.exports = function(sequelize, DataTypes) {
  var Guest = sequelize.define('Guest', {
    id: DataTypes.BIGINT,
    guest_code: DataTypes.STRING,
    guest_name: DataTypes.STRING,
    guest_phone: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Guest;
};