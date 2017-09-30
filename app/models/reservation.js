'use strict';
module.exports = function(sequelize, DataTypes) {
  var Reservation = sequelize.define('Reservation', {
    made_at: DataTypes.DATE,
    description: DataTypes.STRING,
    status: DataTypes.INTEGER,
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
        Reservation.belongsTo(models.User, {foreignKey: 'user_id', targetKey: 'user_id'});
      }
    }
  });
  return Reservation;
};
